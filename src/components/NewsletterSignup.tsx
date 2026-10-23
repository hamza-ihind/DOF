'use client';
import { useState } from 'react';
export default function NewsletterSignup() {
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); setBusy(true); setMessage('');
    try { const res = await fetch('/api/newsletter/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), consent: data.get('consent') === 'on' }) }); const result = await res.json(); if (!res.ok) throw new Error(result.error); setMessage(result.message); form.reset(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to subscribe'); } finally { setBusy(false); }
  }
  return <section className="newsletter-band"><div><p className="eyebrow">STAY CONNECTED</p><h2>Good things happen when we stay in touch.</h2><p>Get community stories, project updates, and opportunities to take part. Confirm your email to join; unsubscribe whenever you like.</p></div><form onSubmit={submit} className="form-stack"><label>Email address<input name="email" type="email" required maxLength={254} placeholder="you@example.com" /></label><label className="check-label"><input type="checkbox" name="consent" required />I agree to receive Defenders of Future newsletters.</label><button disabled={busy} className="primary-button">{busy ? 'Subscribing...' : 'Keep me updated'}</button>{message && <p role="status">{message}</p>}</form></section>;
}