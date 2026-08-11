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
    let emailSent = false;
    let emailWarning = null;

    if (resendKey && !resendKey.includes('placeholder')) {
      try {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Defenders of Future <onboarding@resend.dev>';
        const toEmail = process.env.RESEND_TO_EMAIL || 'delivered@resend.dev';

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          replyTo: email,
          subject: `[DOF Contact] ${subject || 'New Inquiry'} from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px;">
              <h2 style="color: #0a4f6c; margin-bottom: 16px;">New Contact Message - Defenders of Future (Biougra)</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background: #f1f5f9; padding: 16px; border-left: 4px solid #0a4f6c; margin: 12px 0; border-radius: 4px;">
                ${message.replace(/\n/g, '<br/>')}
              </blockquote>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
              <p style="font-size: 12px; color: #64748b;">Defenders of Future Association • Biougra, Chtouka Aït Baha, Morocco</p>
            </div>
          `
        });

        if (error) {
          console.warn('Resend email error:', error);
          emailWarning = error.message;
        } else {
          emailSent = true;
          console.log('Resend email sent successfully, id:', data?.id);
        }
      } catch (emailErr: any) {
        console.warn('Resend email notification warning:', emailErr);
        emailWarning = emailErr?.message || 'Email sending failed';
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been saved and received successfully!',
      emailSent,
      emailWarning
    });
  } catch (error: any) {
    console.error('Contact API handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing message.' },
      { status: 500 }
    );
  }
}

