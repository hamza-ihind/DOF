import React from 'react';
import { getMembers } from '@/lib/db';
import MemberCard from '@/components/MemberCard';

export const metadata = {
  title: 'Association Members | Defenders of Future',
  description: 'Team members and volunteers of Defenders of Future association.',
};

export const revalidate = 60;

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="pt-6 sm:pt-8 pb-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="wide-container">
        
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            Association Members
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            The dedicated team members and volunteers driving change in our local communities.
          </p>
        </div>

        {/* Clean Members Grid - No level or tier separators */}
        {members.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No members registered yet.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add association members in the Admin panel to display them here.</p>
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
