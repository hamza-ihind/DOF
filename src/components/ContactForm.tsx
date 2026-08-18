'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  return (
    <section id="contact" className="pt-12 pb-6 sm:pb-8 bg-slate-50 dark:bg-slate-900/60 relative overflow-hidden transition-colors duration-300 scroll-mt-20 sm:scroll-mt-24">
      <div className="wide-container relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
                {t('contact.title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c] dark:text-sky-300">{t('contact.hq')}</h4>
                  <p className="text-slate-600 dark:text-slate-400">Biougra, Chtouka Aït Baha Region, Morocco</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#aa1c34] dark:bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c] dark:text-sky-300">{t('contact.phone')}</h4>
                  <p className="text-slate-600 dark:text-slate-400">+212 600-000000</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c] dark:text-sky-300">{t('contact.email')}</h4>
                  <p className="text-slate-600 dark:text-slate-400">contact@defendersoffuture.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg transition-colors">
            <h3 className="text-xl font-bold text-[#0a4f6c] dark:text-sky-300 mb-4">
              {t('contact.formTitle')}
            </h3>

            {status === 'success' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold">{t('contact.successTitle')}</h4>
                  <p>{t('contact.successDesc')}</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-bold">{t('contact.errorTitle')}</h4>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {t('contact.nameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {t('contact.topicLabel')}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs"
                >
                  <option value="General Inquiry">{t('contact.topicOption1')}</option>
                  <option value="School Refurbishment">{t('contact.topicOption2')}</option>
                  <option value="Food Package Drive">{t('contact.topicOption3')}</option>
                  <option value="Spring of Life Well">{t('contact.topicOption4')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#aa1c34] text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <span>{t('contact.sending')}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('contact.sendBtn')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
