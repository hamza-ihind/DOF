'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
type Account = { id: number; name: string; email: string; status: string };
export default function AccountApprovals() {
  const [accounts, setAccounts] = useState<Account[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState<number | null>(null), [loading, setLoading] = useState(true);
  async function load() { try { const res = await fetch('/api/admin/accounts'); const data = await res.json(); if (!res.ok) throw new Error(data.error); setAccounts(data.accounts); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load accounts'); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function update(id: number, status: string) {
    setBusy(id); setError('');
    try { const res = await fetch('/api/admin/accounts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update account'); } finally { setBusy(null); }
  }
  return <main className="workspace"><Link href="/admin">Back to dashboard</Link><div className="section-heading"><div><p className="eyebrow">MEMBERSHIP</p><h1>Review member accounts</h1><p>Verify each applicant before allowing transaction submissions. Public team profiles are managed separately.</p></div></div>{error && <p role="alert" className="form-error">{error}</p>}<section className="panel">{loading ? <p>Loading accounts...</p> : accounts.length ? accounts.map(a => <div className="list-row" key={a.id}><div><strong>{a.name}</strong><p>{a.email}</p><span className="status-badge">{a.status}</span></div><div className="flex gap-2 flex-wrap">{a.status !== 'active' && <button disabled={busy !== null} className="primary-button" onClick={() => update(a.id, 'active')}>Approve</button>}{a.status === 'active' ? <button disabled={busy !== null} className="secondary-button" onClick={() => update(a.id, 'pending')}>Suspend</button> : a.status !== 'rejected' && <button disabled={busy !== null} className="secondary-button" onClick={() => update(a.id, 'rejected')}>Reject</button>}</div></div>) : <p>No applications yet. New registrations will appear here.</p>}</section></main>;
}