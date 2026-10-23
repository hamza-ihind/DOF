import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
const prompt = createInterface({ input: process.stdin, output: process.stdout });
const password = await prompt.question('New admin password (visible while typing; at least 12 characters): ');
prompt.close();
if (password.length < 12 || password.length > 128) throw new Error('Use 12-128 characters');
const salt = randomBytes(16).toString('hex');
console.log('ADMIN_PASSWORD_HASH=' + salt + ':' + scryptSync(password, salt, 64).toString('hex'));
