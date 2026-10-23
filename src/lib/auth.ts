import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { randomBytes, createHash, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { database, HttpError } from './security';
export const SESSION_COOKIE = 'dof_session';
const deriveKey = promisify(scrypt);
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = await deriveKey(password, salt, 64) as Buffer;
  return `${salt}:${key.toString('hex')}`;
}
export async function verifyPassword(password: string, hash: string) {
  const [salt, hex] = hash.split(':');
  const expected = Buffer.from(hex, 'hex');
  const actual = await deriveKey(password, salt, 64) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export type Session = { role: 'admin' | 'member'; userId: number | null; name: string; status: string };
export async function getSession(token?: string): Promise<Session | null> {
  token ??= (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const sql = database();
  const rows = await sql`SELECT s.role, s.user_id AS "userId", u.name, u.status FROM sessions s LEFT JOIN users u ON u.id = s.user_id WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > NOW()`;
  const row = rows[0];
  if (!row || (row.role === 'member' && !['pending', 'active'].includes(row.status))) return null;
  return { role: row.role, userId: row.userId, name: row.name || 'Administrator', status: row.role === 'admin' ? 'active' : row.status };
}
export async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') throw new HttpError(session ? 403 : 401, 'Administrator access required');
  return session;
}
export async function requireMember() {
  const session = await getSession();
  if (session?.role !== 'member' || session.status !== 'active') throw new HttpError(session ? 403 : 401, 'An approved member account is required');
  return session;
}
export async function createSession(role: 'admin' | 'member', userId: number | null) {
  const token = randomBytes(32).toString('hex');
  const sql = database();
  await sql`INSERT INTO sessions (token_hash, role, user_id, expires_at) VALUES (${hashToken(token)}, ${role}, ${userId}, NOW() + INTERVAL '12 hours')`;
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 43200 });
}
export async function logout() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) { const sql = database(); await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`; }
  (await cookies()).set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function requireAdminPage() {
  const session = await getSession();
  if (session?.role !== 'admin') redirect(session ? '/account' : '/admin');
  return session;
}
