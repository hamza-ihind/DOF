import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { hashToken } from '@/lib/auth';
import { bodyJson, database, emailField, failure, rateLimit, HttpError } from '@/lib/security';
import { sendMail, appUrl, mailConfig } from '@/lib/mail';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request); const email = emailField(body.email);
    if (body.consent !== true) throw new HttpError(400, 'Please agree to receive the newsletter');
    await rateLimit(request, 'subscribe', 5, 3600); mailConfig(); const base = appUrl();
    const token = randomBytes(32).toString('hex'), unsubscribe = randomBytes(32).toString('hex'), sql = database();
    const existing = await sql`SELECT confirmed FROM newsletter_subscribers WHERE email = ${email}`;
    if (!existing[0]?.confirmed) {
      await sql`INSERT INTO newsletter_subscribers (email, token_hash, token_expires_at, unsubscribe_hash) VALUES (${email}, ${hashToken(token)}, NOW() + INTERVAL '24 hours', ${hashToken(unsubscribe)}) ON CONFLICT (email) DO UPDATE SET token_hash = EXCLUDED.token_hash, token_expires_at = EXCLUDED.token_expires_at`;
      await sendMail(email, 'Confirm your Defenders of Future newsletter subscription', `Please confirm your subscription within 24 hours:\n${base}/newsletter/confirm?token=${token}\n\nIf you did not request this, ignore this email. You will not receive newsletters until you confirm.`);
    }
    return NextResponse.json({ success: true, message: 'Check your inbox to confirm your subscription. If you are already subscribed, you are all set.' });
  } catch (error) { return failure(error); }
}