import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
const schema = fs.readFileSync(path.resolve('src/lib/schema.sql'), 'utf8');
const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
await sql.transaction(statements.map(statement => sql(statement)));
console.log('Database schema migrated successfully. No content was seeded.');

