'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function ContactForm() {
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
    <section id="contact" className="py-12 bg-slate-50 relative overflow-hidden">
      <div className="wide-container relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c]">
                Get In Touch With Our Team
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Whether you wish to collaborate on a school renovation, contribute to food supply packages, or support deep water well drilling in Biougra, we would love to hear from you.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c]">Association HQ</h4>
                  <p className="text-slate-600">Biougra, Chtouka Aït Baha Region, Morocco</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#aa1c34] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c]">Phone</h4>
                  <p className="text-slate-600">+212 600-000000</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a4f6c]">Direct Email (Resend)</h4>
                  <p className="text-slate-600">contact@defendersoffuture.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-[#0a4f6c] mb-4">
              Send Us a Message
            </h3>

            {status === 'success' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Message Sent Successfully!</h4>
                  <p>Our team in Biougra will respond shortly.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Submission Error</h4>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yassine El Mansouri"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs text-slate-800 bg-white"
                >
                  <option value="General Inquiry">General Association Inquiry</option>
                  <option value="School Refurbishment">School Refurbishment & Supplies</option>
                  <option value="Food Package Drive">Food & Essential Supplies Distribution</option>
                  <option value="Spring of Life Well">Spring of Life Well Drilling Project</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we collaborate to help forgotten villages in Biougra?"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] text-xs text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-lg bg-[#0a4f6c] hover:bg-[#aa1c34] text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Association</span>
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
