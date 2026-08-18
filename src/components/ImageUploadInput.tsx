'use client';

import React, { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';
import { Upload, Image as ImageIcon, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadInput({ value, onChange, label = 'Image Photo' }: ImageUploadInputProps) {
  const [tab, setTab] = useState<'uploadthing' | 'file' | 'url'>('uploadthing');
  const [urlInput, setUrlInput] = useState(value);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ text: 'File size must be less than 5MB', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
        setStatusMsg({ text: 'Image loaded successfully!', type: 'success' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setStatusMsg({ text: 'Image URL updated!', type: 'success' });
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
          {label}
        </label>

        {/* Tab switchers - clean slate style */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setTab('uploadthing')}
            className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all ${
              tab === 'uploadthing' ? 'bg-[#0a4f6c] dark:bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            UploadThing
          </button>
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all ${
              tab === 'file' ? 'bg-[#0a4f6c] dark:bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            Local File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-all ${
              tab === 'url' ? 'bg-[#0a4f6c] dark:bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {/* Image Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
          <img
            src={value}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">Selected Image Preview</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{value}</p>
          </div>
        </div>
      )}

      {/* UploadThing Tab */}
      {tab === 'uploadthing' && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                onChange(res[0].url);
                setStatusMsg({ text: 'Uploaded successfully via UploadThing!', type: 'success' });
              }
            }}
            onUploadError={(error: Error) => {
              console.warn('UploadThing notice:', error.message);
              setStatusMsg({ 
                text: 'UploadThing requires UPLOADTHING_TOKEN in .env file. You can also use the Local File or URL tab.', 
                type: 'error' 
              });
            }}
            appearance={{
              button: 'bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm w-full transition-all',
              allowedContent: 'text-[10px] text-slate-500 dark:text-slate-400 mt-1'
            }}
          />
        </div>
      )}

      {/* Direct Local File Selector Tab */}
      {tab === 'file' && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-2 text-center">
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all">
            <Upload className="w-4 h-4 text-[#0a4f6c] dark:text-sky-400" />
            <span>Choose Image File from Computer</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Supports PNG, JPG, WEBP (Max 5MB)</p>
        </div>
      )}

      {/* Direct URL Tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://... or /images/..."
              className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
          >
            Apply
          </button>
        </div>
      )}

      {/* Status Feedback */}
      {statusMsg && (
        <div className={`text-[11px] font-medium flex items-center gap-1.5 ${
          statusMsg.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          <span>{statusMsg.text}</span>
        </div>
      )}
    </div>
  );
}
