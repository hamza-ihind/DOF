import { neon } from '@neondatabase/serverless';
import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
export function database() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder')) throw new Error('Database is not configured');
  return neon(process.env.DATABASE_URL);
}
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function failure(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  console.error('Request failed:', error instanceof Error ? error.name : 'Unknown error');
  return NextResponse.json({ success: false, error: 'This service is temporarily unavailable. Please try again.' }, { status: 503 });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : new URL(request.url).origin;
  if ((origin && origin !== expected) || request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Cross-site request rejected');
}
export async function bodyJson(request: Request) {
  sameOrigin(request);
  if (!request.headers.get('content-type')?.includes('application/json')) throw new HttpError(415, 'JSON is required');
  const text = await request.text();
  if (text.length > 100000) throw new HttpError(413, 'Request is too large');
  try { const body = JSON.parse(text); if (!body || typeof body !== 'object' || Array.isArray(body)) throw 0; return body; }
  catch { throw new HttpError(400, 'Invalid request'); }
}
export function field(value: unknown, label: string, max = 255, required = true): string {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new HttpError(400, `Enter a valid ${label} (up to ${max} characters)`);
  return value.trim();
}
export function emailField(value: unknown) {
  const email = field(value, 'email address', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Enter a valid email address');
  return email;
}
export function idField(value: unknown) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new HttpError(400, 'Invalid ID');
  return id;
}
export function amountField(value: unknown) {
  if (typeof value !== 'number' && typeof value !== 'string') throw new HttpError(400, 'Invalid amount');
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 99999999.99 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001) throw new HttpError(400, 'Enter a positive amount with at most two decimal places');
  return amount;
}
export function dateField(value: unknown) {
  const date = field(value, 'date', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new HttpError(400, 'Enter a valid date');
  return date;
}
export function imageField(value: unknown) {
  const url = field(value || '/images/placeholder.svg', 'image URL', 500);
  if (!/^\/images\/[\w./-]+$/.test(url) && !/^https:\/\/[^\s]+$/.test(url)) throw new HttpError(400, 'Use an HTTPS image URL or upload an image');
  return url;
}
// Configure a trusted proxy to overwrite x-forwarded-for before enabling TRUST_PROXY.
export async function rateLimit(request: Request, scope: string, limit = 8, seconds = 900) {
  const address = process.env.TRUST_PROXY === 'true' ? request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown' : 'shared';
  const key = createHash('sha256').update(`${scope}:${address}:${Math.floor(Date.now() / (seconds * 1000))}`).digest('hex');
  const sql = database();
  const rows = await sql`INSERT INTO rate_limits (key, count, expires_at) VALUES (${key}, 1, NOW() + ${seconds} * INTERVAL '1 second') ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1 RETURNING count`;
  if (Number(rows[0].count) > limit) throw new HttpError(429, 'Too many attempts. Please try again later.');
}
