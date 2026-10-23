import { NextResponse } from 'next/server';
import { bodyJson, database, failure, field, emailField, rateLimit, HttpError } from '@/lib/security';
import { sendMail } from '@/lib/mail';
export async function POST(request: Request) {
  try {
    const body = await bodyJson(request);
    const name = field(body.name, 'name', 120), email = emailField(body.email), subject = field(body.subject || 'General inquiry', 'subject', 200), message = field(body.message, 'message', 5000);
    await rateLimit(request, 'contact', 5, 3600);
    const to = process.env.RESEND_TO_EMAIL;
    if (!to || /placeholder|example\.com|your_|delivered@resend/i.test(to)) throw new HttpError(503, 'The contact mailbox is not configured yet. Please try again later.');
    await sendMail(to, `[DOF Contact] ${subject}`, `Name: ${name}\nEmail: ${email}\n\n${message}`, email);
    // Delivery is authoritative; archiving failure must not invite duplicate emails.
    try { const sql = database(); await sql`INSERT INTO contact_messages (name, email, subject, message) VALUES (${name}, ${email}, ${subject}, ${message})`; } catch { console.error('Contact email sent but archive unavailable'); }
    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) { return failure(error); }
}