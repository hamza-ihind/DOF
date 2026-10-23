'use client';
import { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';
export default function ImageUploadInput({ value, onChange, label = 'Image' }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [error, setError] = useState('');
  return <fieldset className="image-picker"><legend>{label}</legend><div className="flex flex-col sm:flex-row gap-5 items-start">
    <img src={value || '/images/placeholder.svg'} alt="Selected image preview" className="w-24 h-24 rounded-2xl object-cover bg-slate-100" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
    <div className="flex-1 w-full space-y-3"><UploadButton endpoint="imageUploader" onClientUploadComplete={files => { if (files[0]) { onChange(files[0].url); setError(''); } }} onUploadError={() => setError('Upload unavailable. Try again or use an existing HTTPS image URL.')} appearance={{ button: 'bg-[#0a4f6c] text-white rounded-xl text-sm px-4', allowedContent: 'text-slate-500 text-xs' }} />
    <label className="block">Or use an image URL<input type="text" maxLength={500} value={value} placeholder="https://" onChange={e => onChange(e.target.value)} className="w-full mt-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent p-3" /></label>
    {value && <button type="button" className="text-sm underline" onClick={() => onChange('')}>Remove image</button>}{error && <p role="alert" className="form-error">{error}</p>}</div>
  </div></fieldset>;
}