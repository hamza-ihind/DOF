import React from 'react';
import Image from 'next/image';
import { Member } from '@/lib/seedData';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between relative overflow-hidden group">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[#0a4f6c] dark:bg-blue-500 group-hover:bg-[#aa1c34] dark:group-hover:bg-red-500 transition-colors" />

      <div className="w-full flex flex-col items-center">
        {/* Circle Photo Avatar */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#0a4f6c] to-[#aa1c34] shadow-sm">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 border border-white dark:border-slate-800">
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Member Name */}
        <h3 className="text-base font-bold text-[#0a4f6c] dark:text-sky-300 mb-1 group-hover:text-[#aa1c34] dark:group-hover:text-red-400 transition-colors">
          {member.name}
        </h3>

        {/* Role Badge */}
        <div className="inline-block px-2.5 py-0.5 bg-[#aa1c34]/10 dark:bg-red-950/50 text-[#aa1c34] dark:text-red-300 rounded-full text-xs font-bold mb-2">
          {member.role}
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {member.bio}
        </p>
      </div>
    </div>
  );
}
