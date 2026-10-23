import { Resend } from 'resend';
import { HttpError } from './security';
export function mailConfig() {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from || /placeholder|example\.com|your_/i.test(key + from)) throw new HttpError(503, 'Email service is not configured yet. Please try again later.');
  return { client: new Resend(key), from };
}
export function appUrl() {
  if (!process.env.APP_URL) throw new HttpError(503, 'Email links are not configured yet');
  return new URL(process.env.APP_URL).origin;
}
export async function sendMail(to: string, subject: string, text: string, replyTo?: string, idempotencyKey?: string) {
  const { client, from } = mailConfig();
  const { error } = await client.emails.send({ from, to, subject, text, ...(replyTo ? { replyTo } : {}) }, idempotencyKey ? { idempotencyKey } : undefined);
  if (error) throw new HttpError(502, 'Email could not be sent. Please try again later.');
}