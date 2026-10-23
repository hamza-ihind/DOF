'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function NewsletterPreference({ token, action }: { token: string; action: 'confirm' | 'unsubscribe' }) {
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  async function submit() { setBusy(true); try { const res = await fetch('/api/newsletter/preferences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, action }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setDone(true); setMessage(action === 'confirm' ? 'You are subscribed. Thank you for staying connected.' : 'You have been unsubscribed.'); } catch (e) { setMessage(e instanceof Error ? e.message : 'Please try again'); } finally { setBusy(false); } }
  return <main className="workspace max-w-xl"><section className="panel form-stack"><h1>{action === 'confirm' ? 'Confirm your subscription' : 'Unsubscribe from newsletters'}</h1>{message && <p role="status">{message}</p>}{!done && <button className="primary-button" disabled={busy || !token} onClick={submit}>{busy ? 'Please wait...' : action === 'confirm' ? 'Confirm subscription' : 'Unsubscribe'}</button>}<Link href="/newsletters">Return to newsletters</Link></section></main>;
}