import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
await sql.transaction([sql`DELETE FROM sessions WHERE expires_at < NOW()`, sql`DELETE FROM rate_limits WHERE expires_at < NOW()`]);
console.log('Expired sessions and rate-limit buckets removed.');
