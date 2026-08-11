import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveContactMessage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Save submission to Neon Database
    await saveContactMessage(name, email, subject || 'General Inquiry', message);

    // Send email notification via Resend if API Key is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.includes('placeholder')) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Defenders of Future <contact@defendersoffuture.org>',
          to: ['contact@defendersoffuture.org'],
          subject: `[DOF Contact] ${subject || 'New Inquiry'} from ${name}`,
          html: `
            <h2>New Contact Message - Defenders of Future (Biougra)</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #0a4f6c;">
              ${message.replace(/\n/g, '<br/>')}
            </blockquote>
          `
        });
      } catch (emailErr) {
        console.warn('Resend email notification warning:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received successfully!'
    });
  } catch (error: any) {
    console.error('Contact API handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing message.' },
      { status: 500 }
    );
  }
}
