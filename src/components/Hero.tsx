'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-[#0a4f6c] via-[#06354a] to-[#0a4f6c] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-white py-12 lg:py-16 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" />

      <div className="wide-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Headlines & CTA */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white dark:text-slate-50">
              {t('hero.titlePrefix')} <span className="text-red-400">{t('hero.titleSuffix')}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('hero.description')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>{t('hero.btnActivities')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/members"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                <span>{t('hero.btnMembers')}</span>
              </Link>
            </div>
          </div>

          {/* Visual Showcase / Placeholder Picture */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/10">
              <div className="relative aspect-[16/10] w-full bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Defenders of Future Showcase Picture"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
