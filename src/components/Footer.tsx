'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a4f6c] dark:bg-slate-950 text-white pt-10 pb-6 border-t-4 border-[#aa1c34] relative overflow-hidden text-sm transition-colors duration-300">
      <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" />

      <div className="wide-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1: Association Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#aa1c34] flex items-center justify-center text-white shadow">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white leading-none">
                  Defenders <span className="text-[#dfa234]">of Future</span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('footer.bio')}
            </p>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1.5">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#dfa234] transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#dfa234] transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-[#dfa234] transition-colors">{t('nav.members')}</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#dfa234] transition-colors">{t('nav.events')}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#dfa234] transition-colors">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1.5">
              {t('footer.hq')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#aa1c34] shrink-0" />
                <span>Biougra, Chtouka Aït Baha, Morocco</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#aa1c34] shrink-0" />
                <span>+212 600-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#aa1c34] shrink-0" />
                <span>contact@defendersoffuture.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright bar - Copyright of E11even */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-300">
          <p>© {new Date().getFullYear()} Defenders of Future. {t('footer.copyright')} <strong className="text-white font-bold">E11even</strong>.</p>
        </div>
      </div>
    </footer>
  );
}
