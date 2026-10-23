'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return; setBusy(true); setError('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/' + (register ? 'register' : 'login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Please try again');
      router.push('/account'); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Connection error'); } finally { setBusy(false); }
  }
  return <main className="workspace max-w-xl"><p className="eyebrow">DEFENDERS OF FUTURE</p><h1>{register ? 'Be part of the change.' : 'Welcome back.'}</h1><p className="my-4 text-slate-500">{register ? 'Create your member account. Our team will review your application before enabling transaction submissions.' : 'Sign in to your member space to view your approval status and contributions.'}</p><form onSubmit={submit} className="panel form-stack">
    {register && <label>Full name<input name="name" required maxLength={120} autoComplete="name" /></label>}
    <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>Password<input name="password" type="password" required minLength={register ? 12 : 1} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} /></label>
    {register && <p className="hint">Use at least 12 characters. Approval is required before you can submit a transaction.</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="primary-button" disabled={busy}>{busy ? 'Please wait...' : register ? 'Create account' : 'Sign in'}</button>
    <Link href={register ? '/login' : '/register'}>{register ? 'Already a member? Sign in' : 'New here? Create an account'}</Link>
    </form></main>;
}