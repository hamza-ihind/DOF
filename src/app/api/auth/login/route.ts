import { NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import { bodyJson, database, emailField, failure, field, HttpError, rateLimit } from '@/lib/security';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request);
    await rateLimit(request, 'member-login');
    const email = emailField(body.email);
    const password = field(body.password, 'password', 128);
    const sql = database();
    const rows = await sql`SELECT id, password_hash, status FROM users WHERE email = ${email}`;
    const user = rows[0];
    const valid = await verifyPassword(password, user?.password_hash || '00000000000000000000000000000000:' + '00'.repeat(64));
    if (!user || !valid || user.status === 'rejected') throw new HttpError(401, 'Invalid email or password, or account unavailable');
    await createSession('member', user.id);
    return NextResponse.json({ success: true });
  } catch (error) { return failure(error); }
}