import { NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';
import { createSession, verifyPassword } from '@/lib/auth';
import { bodyJson, failure, field, HttpError, rateLimit } from '@/lib/security';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request);
    await rateLimit(request, 'admin-login');
    const username = field(body.username, 'username');
    const password = field(body.password, 'password', 128);
    if (!process.env.ADMIN_USERNAME || (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD)) throw new HttpError(503, 'Administrator credentials have not been configured');
    const equal = (a: string, b: string) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
    const validPassword = process.env.ADMIN_PASSWORD_HASH ? await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH) : equal(password, process.env.ADMIN_PASSWORD!);
    if (!validPassword || !equal(username, process.env.ADMIN_USERNAME)) throw new HttpError(401, 'Invalid username or password');
    await createSession('admin', null);
    return NextResponse.json({ success: true });
  } catch (error) { return failure(error); }
}
