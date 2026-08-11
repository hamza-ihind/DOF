import React from 'react';
import { getMembers } from '@/lib/db';
import MemberCard from '@/components/MemberCard';

export const metadata = {
  title: 'Association Organizational Tree | Defenders of Future Biougra',
  description: 'Organizational tree of Defenders of Future in Biougra, Morocco.',
};

export const revalidate = 60;

export default async function MembersPage() {
  const members = await getMembers();

  const tier1Members = members.filter((m) => m.tier === 1);
  const tier2Members = members.filter((m) => m.tier === 2);
  const tier3Members = members.filter((m) => m.tier === 3);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="wide-container">
        
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c]">
            Organizational Tree
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Defenders of Future team structure in Biougra, Morocco.
          </p>
        </div>

        {/* ORGANIZATIONAL TREE CONTAINER */}
        <div className="space-y-8 relative">
          
          {/* LEVEL 1 */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
              {tier1Members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Tree Line Connector 1 */}
          <div className="hidden md:flex flex-col items-center py-2">
            <div className="w-0.5 h-8 bg-gradient-to-b from-[#0a4f6c] to-[#aa1c34]" />
            <div className="w-2/3 h-0.5 bg-[#aa1c34]" />
            <div className="w-0.5 h-6 bg-[#aa1c34]" />
          </div>

          {/* LEVEL 2 */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
              {tier2Members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Tree Line Connector 2 */}
          <div className="hidden md:flex flex-col items-center py-2">
            <div className="w-0.5 h-8 bg-gradient-to-b from-[#aa1c34] to-[#0a4f6c]" />
            <div className="w-4/5 h-0.5 bg-[#0a4f6c]" />
            <div className="w-0.5 h-6 bg-[#0a4f6c]" />
          </div>

          {/* LEVEL 3 */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-5xl w-full">
              {tier3Members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

