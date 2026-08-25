'use client';

import React from 'react';
import { Member } from '@/lib/seedData';
import MemberCard from '@/components/MemberCard';
import { useLanguage } from '@/context/LanguageContext';

interface MembersViewProps {
  members: Member[];
}

export default function MembersView({ members }: MembersViewProps) {
  const { t } = useLanguage();

  return (
    <div className="pt-6 sm:pt-8 pb-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="wide-container">
        
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            {t('members.pageTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t('members.pageSubtitle')}
          </p>
        </div>

        {/* Clean Members Grid */}
        {members.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('members.noMembers')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('members.noMembersDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
