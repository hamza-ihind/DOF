'use client';

import React from 'react';
import { Paintbrush, PackageCheck, Droplets, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-12 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden transition-colors duration-300 scroll-mt-20 sm:scroll-mt-24">
      <div className="wide-container relative z-10">
        
        {/* Header Section */}
        <div className="text-center w-full mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            {t('about.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('about.subtitle')}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* 3 Core Pillars - Wide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: School Refurbishment & Supplies */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white flex items-center justify-center mb-4 shadow">
              <Paintbrush className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] dark:text-sky-300 mb-2">
              {t('about.pillar1Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {t('about.pillar1Desc')}
            </p>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar1Bullet1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar1Bullet2')}</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Food & Hygiene Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#aa1c34] dark:bg-red-700 text-white flex items-center justify-center mb-4 shadow">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] dark:text-sky-300 mb-2">
              {t('about.pillar2Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {t('about.pillar2Desc')}
            </p>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar2Bullet1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar2Bullet2')}</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Spring of Life Well Drilling */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white flex items-center justify-center mb-4 shadow">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] dark:text-sky-300 mb-2">
              {t('about.pillar3Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {t('about.pillar3Desc')}
            </p>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar3Bullet1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] dark:text-red-400 shrink-0 mt-0.5" />
                <span>{t('about.pillar3Bullet2')}</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
