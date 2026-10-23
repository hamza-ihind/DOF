import { NextResponse } from 'next/server';
import { hashPassword, createSession } from '@/lib/auth';
import { bodyJson, database, emailField, failure, field, HttpError, rateLimit } from '@/lib/security';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request);
    await rateLimit(request, 'register', 5, 3600);
    const name = field(body.name, 'name', 120);
    const email = emailField(body.email);
    const password = field(body.password, 'password', 128);
    if (password.length < 12) throw new HttpError(400, 'Use a password with at least 12 characters');
    const hash = await hashPassword(password);
    const sql = database();
    const rows = await sql`INSERT INTO users (name, email, password_hash) VALUES (${name}, ${email}, ${hash}) ON CONFLICT (email) DO NOTHING RETURNING id`;
    if (!rows.length) throw new HttpError(409, 'Unable to register with this email. Try signing in.');
    await createSession('member', rows[0].id);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) { return failure(error); }
}