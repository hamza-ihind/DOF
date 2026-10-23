'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { EventItem, Member } from '@/lib/seedData';
import ImageUploadInput from './ImageUploadInput';
export default function EventEditor({ event, members }: { event?: EventItem; members: Member[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<EventItem, 'id'>>(event || { title: '', slug: '', category: 'School Refurbishment', date: new Date().toISOString().slice(0, 10), location: 'Biougra, Morocco', imageUrl: '', excerpt: '', content: '', impactSummary: '', contributingMemberIds: [], timelineDays: [] });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setError('');
    try {
      const response = await fetch('/api/events', { method: event ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: event?.id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to save event');
      router.push('/admin/events'); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save event'); } finally { setBusy(false); }
  }
  return <main className="workspace"><Link href="/admin/events">Back to event reports</Link><div className="section-heading"><div><p className="eyebrow">COMMUNITY STORIES</p><h1>{event ? 'Edit event report' : 'Share a new event'}</h1><p>Give your community a clear account of the activity, the people, and the outcome.</p></div></div>
    <form onSubmit={save} className="panel form-stack"><h2>The essentials</h2><div className="form-grid">
      <label>Event title<input required maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
      <label>URL slug <span className="hint">(optional; generated from title)</span><input pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={220} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></label>
      <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as EventItem['category'] })}>{['School Refurbishment', 'Food Package Distribution', 'Spring of Life Well Drilling'].map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Date<input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
    </div>
    <label>Location<input required maxLength={255} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
    <ImageUploadInput label="Cover image" value={form.imageUrl} onChange={imageUrl => setForm({ ...form, imageUrl })} />
    <label>Short summary<textarea required maxLength={1000} rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></label>
    <label>Full report<textarea required maxLength={30000} rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></label>
    <label>Impact summary <span className="hint">(optional)</span><input maxLength={255} value={form.impactSummary} onChange={e => setForm({ ...form, impactSummary: e.target.value })} /></label>
    <fieldset><legend>Contributing members</legend><div className="flex flex-wrap gap-4 mt-3">{members.length ? members.map(m => <label className="check-label" key={m.id}><input type="checkbox" checked={form.contributingMemberIds.includes(m.id)} onChange={e => setForm({ ...form, contributingMemberIds: e.target.checked ? [...form.contributingMemberIds, m.id] : form.contributingMemberIds.filter(id => id !== m.id) })} />{m.name}</label>) : <p className="hint">Add team profiles in the dashboard to credit contributors.</p>}</div></fieldset>
    <div className="section-heading"><h2>Activity timeline</h2><button type="button" className="secondary-button" onClick={() => setForm({ ...form, timelineDays: [...form.timelineDays, { dayNumber: form.timelineDays.length + 1, title: '', date: form.date, description: '', images: [] }] })}>Add a day</button></div>
    {form.timelineDays.map((day, index) => <fieldset className="panel form-stack" key={index}><legend>Day {index + 1}</legend><label>Title<input required value={day.title} onChange={e => setForm({ ...form, timelineDays: form.timelineDays.map((d, i) => i === index ? { ...d, title: e.target.value } : d) })} /></label><label>Date<input required type="date" value={day.date} onChange={e => setForm({ ...form, timelineDays: form.timelineDays.map((d, i) => i === index ? { ...d, date: e.target.value } : d) })} /></label><label>Description<textarea required value={day.description} onChange={e => setForm({ ...form, timelineDays: form.timelineDays.map((d, i) => i === index ? { ...d, description: e.target.value } : d) })} /></label><ImageUploadInput label="Day photo (optional)" value={day.images[0] || ''} onChange={url => setForm({ ...form, timelineDays: form.timelineDays.map((d, i) => i === index ? { ...d, images: [url, ...d.images.slice(1)] } : d) })} /><button type="button" onClick={() => setForm({ ...form, timelineDays: form.timelineDays.filter((_, i) => i !== index) })}>Remove day</button></fieldset>)}
    {error && <p role="alert" className="form-error">{error}</p>}<div className="form-actions"><Link href="/admin/events">Cancel</Link><button className="primary-button" disabled={busy}>{busy ? 'Saving...' : event ? 'Save changes' : 'Publish event'}</button></div>
    </form></main>;
}