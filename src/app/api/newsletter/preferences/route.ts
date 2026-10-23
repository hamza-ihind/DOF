import { NextResponse } from 'next/server';
import { hashToken } from '@/lib/auth';
import { bodyJson, database, failure, field, HttpError } from '@/lib/security';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request), token = field(body.token, 'link token', 64);
    if (!/^[a-f0-9]{64}$/.test(token)) throw new HttpError(400, 'Invalid link');
    const sql = database();
    const rows = body.action === 'confirm' ? await sql`UPDATE newsletter_subscribers SET confirmed = TRUE WHERE token_hash = ${hashToken(token)} AND token_expires_at > NOW() RETURNING id` : body.action === 'unsubscribe' ? await sql`DELETE FROM newsletter_subscribers WHERE unsubscribe_hash = ${hashToken(token)} RETURNING id` : [];
    if (!rows.length) throw new HttpError(400, 'This link is invalid or expired. Please subscribe again if needed.');
    return NextResponse.json({ success: true });
  } catch (error) { return failure(error); }
}