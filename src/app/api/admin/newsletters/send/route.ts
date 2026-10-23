import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { requireAdmin, hashToken } from '@/lib/auth';
import { bodyJson, database, failure, idField, HttpError } from '@/lib/security';
import { sendMail, appUrl, mailConfig } from '@/lib/mail';
export async function POST(request: Request) {
  try {
    await requireAdmin(); const body = await bodyJson(request), id = idField(body.id); mailConfig(); const base = appUrl(), sql = database();
    const issues = await sql`SELECT * FROM newsletters WHERE id = ${id} AND published = TRUE`; if (!issues.length) throw new HttpError(400, 'Publish this newsletter before sending');
    const issue = issues[0];
    // Small retryable batches; each recipient has a stable provider idempotency key.
    const subscribers = await sql`SELECT s.id, s.email FROM newsletter_subscribers s WHERE confirmed = TRUE AND NOT EXISTS (SELECT 1 FROM newsletter_deliveries d WHERE d.newsletter_id = ${id} AND d.subscriber_id = s.id AND d.sent_at IS NOT NULL) ORDER BY s.id LIMIT 5`;
    let sent = 0;
    for (const subscriber of subscribers) {
      // Reuse a signed unsubscribe token rather than rotating links on retries.
      const { createHmac } = await import('crypto');
      if (!process.env.NEWSLETTER_SECRET || process.env.NEWSLETTER_SECRET.length < 32) throw new HttpError(503, 'Newsletter signing secret is not configured');
      const token = createHmac('sha256', process.env.NEWSLETTER_SECRET).update(String(subscriber.id)).digest('hex');
      await sql`UPDATE newsletter_subscribers SET unsubscribe_hash = ${hashToken(token)} WHERE id = ${subscriber.id}`;
      await sendMail(subscriber.email, issue.title, `${issue.summary}\n\n${issue.content}\n\nRead online: ${base}/newsletters#issue-${id}\nUnsubscribe: ${base}/newsletter/unsubscribe?token=${token}`, undefined, `newsletter-${id}-subscriber-${subscriber.id}`);
      await sql`INSERT INTO newsletter_deliveries (newsletter_id, subscriber_id, sent_at) VALUES (${id}, ${subscriber.id}, NOW()) ON CONFLICT (newsletter_id, subscriber_id) DO UPDATE SET sent_at = NOW()`;
      sent++;
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    const remaining = await sql`SELECT COUNT(*)::int AS count FROM newsletter_subscribers s WHERE confirmed = TRUE AND NOT EXISTS (SELECT 1 FROM newsletter_deliveries d WHERE d.newsletter_id = ${id} AND d.subscriber_id = s.id AND d.sent_at IS NOT NULL)`;
    return NextResponse.json({ success: true, sent, remaining: remaining[0].count });
  } catch (error) { return failure(error); }
}