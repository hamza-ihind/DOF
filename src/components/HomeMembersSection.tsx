'use client';

import React from 'react';
import Link from 'next/link';
import { Member } from '@/lib/seedData';
import MemberCard from './MemberCard';
import { useLanguage } from '@/context/LanguageContext';

interface HomeMembersSectionProps {
  members: Member[];
}

export default function HomeMembersSection({ members }: HomeMembersSectionProps) {
  const { t } = useLanguage();
  const featuredMembers = members.slice(0, 4);

  return (
    <section className="py-12 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <div className="wide-container">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            {t('members.homeTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            {t('members.homeSubtitle')}
          </p>
        </div>

        {featuredMembers.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 mb-8">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('members.noMembers')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('members.noMembersDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#aa1c34] text-white font-bold text-xs shadow transition-colors"
          >
            <span>{t('members.viewFullTree')}</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
