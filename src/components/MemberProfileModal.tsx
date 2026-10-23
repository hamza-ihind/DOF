'use client';
import { useEffect, useRef, useState } from 'react';
import { X, UserRound } from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
type Form = { name: string; role: string; photoUrl: string; bio: string; location: string };
export default function MemberProfileModal({ editing, form, onChange, onClose, onSave }: { editing: boolean; form: Form; onChange: (form: Form) => void; onClose: () => void; onSave: (e: React.FormEvent) => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { const element = dialog.current; const previous = document.activeElement as HTMLElement; element?.showModal(); element?.querySelector<HTMLInputElement>('input')?.focus(); const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  return <dialog ref={dialog} className="member-dialog" aria-labelledby="member-dialog-title" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target === dialog.current && !busy) onClose(); }}>
    <div className="dialog-header"><div className="flex gap-4 items-center"><div className="rounded-2xl p-3 bg-sky-100 dark:bg-sky-950 text-[#0a4f6c] dark:text-sky-300"><UserRound /></div><div><p className="eyebrow">OUR PEOPLE</p><h2 id="member-dialog-title">{editing ? 'Edit team profile' : 'Introduce a team member'}</h2></div></div><button type="button" aria-label="Close member form" disabled={busy} onClick={onClose}><X size={22} /></button></div>
    <form className="form-stack p-6 sm:p-8" onSubmit={async e => { e.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await onSave(e); } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save profile'); } finally { setBusy(false); } }}>
      <p className="hint">Create a public profile for the team page. Member account approvals are managed separately.</p>
      <div className="form-grid"><label>Full name <span aria-hidden="true">*</span><input autoFocus required maxLength={120} value={form.name} placeholder="Full name" onChange={e => onChange({ ...form, name: e.target.value })} /></label><label>Position <span aria-hidden="true">*</span><input required maxLength={120} value={form.role} placeholder="Role in the association" onChange={e => onChange({ ...form, role: e.target.value })} /></label></div>
      <label>Location<input maxLength={255} value={form.location} placeholder="City, country" onChange={e => onChange({ ...form, location: e.target.value })} /></label>
      <ImageUploadInput label="Profile photo" value={form.photoUrl === '/images/placeholder.svg' ? '' : form.photoUrl} onChange={photoUrl => onChange({ ...form, photoUrl })} />
      <label>About this member<textarea rows={4} maxLength={3000} value={form.bio} placeholder="Share their background, interests, and contribution to the association." onChange={e => onChange({ ...form, bio: e.target.value })} /></label>
      {error && <p role="alert" className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="secondary-button" disabled={busy} onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save profile' : 'Add team member'}</button></div>
    </form></dialog>;
}