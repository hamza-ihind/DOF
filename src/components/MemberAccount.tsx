'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type Transaction = { id: number; amount: number; notes: string; date: string };
export default function MemberAccount({ name, active }: { name: string; active: boolean }) {
  const router = useRouter(); const [transactions, setTransactions] = useState<Transaction[]>([]); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(active);
  async function load() {
    try { const res = await fetch('/api/transactions', { cache: 'no-store' }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setTransactions(data.transactions); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to load transactions'); } finally { setLoading(false); }
  }
  useEffect(() => { if (active) void load(); }, [active]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return; const form = e.currentTarget; setBusy(true); setMessage('');
    try {
      const values = new FormData(form);
      const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: values.get('amount'), description: values.get('description') }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      form.reset(); setMessage('Your transaction has been recorded.'); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to save transaction'); } finally { setBusy(false); }
  }
  async function signOut() { const res = await fetch('/api/auth/logout', { method: 'POST' }); if (res.ok) { router.push('/login'); router.refresh(); } else setMessage('Unable to sign out. Please try again.'); }
  return <main className="workspace"><div className="section-heading"><div><p className="eyebrow">MEMBER SPACE</p><h1>Hello, {name}.</h1></div><button className="secondary-button" onClick={signOut}>Sign out</button></div>
    {!active ? <section className="panel form-stack"><span className="status-badge">Awaiting approval</span><h2>Your application is with our team.</h2><p>An administrator needs to verify your account. Once approved, you can record your own contributions here.</p><button className="secondary-button" onClick={() => router.refresh()}>Check approval status</button></section> :
    <div className="grid lg:grid-cols-2 gap-8"><form onSubmit={submit} className="panel form-stack"><h2>Record a contribution</h2><p className="hint">Enter the amount and a short description. This records a transaction; it does not charge a payment method.</p><label>Amount (MAD)<input name="amount" type="number" min="0.01" max="99999999.99" step="0.01" required /></label><label>Description<textarea name="description" rows={4} maxLength={2000} required /></label><button className="primary-button" disabled={busy}>{busy ? 'Saving...' : 'Submit transaction'}</button></form><section className="panel"><h2>Your transactions</h2>{loading ? <p>Loading...</p> : transactions.length ? transactions.map(tx => <div className="list-row" key={tx.id}><div><strong>{Number(tx.amount).toLocaleString()} MAD</strong><p className="whitespace-pre-wrap break-words">{tx.notes}</p></div><time className="hint">{tx.date}</time></div>) : <p className="mt-4 hint">You have not recorded any transactions yet.</p>}</section></div>}
    {message && <p role="status" className="panel mt-5">{message}</p>}</main>;
}