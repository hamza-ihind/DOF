import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getMembers } from '@/lib/db';
import { Calendar, MapPin, ArrowLeft, Sparkles, Users } from 'lucide-react';
import TimelineDayCard from '@/components/TimelineDayCard';

export const revalidate = 60;

export default async function SingleEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const eventItem = await getEventBySlug(params.slug);
  if (!eventItem) {
    notFound();
  }

  const allMembers = await getMembers();
  const contributingMembers = allMembers.filter((m) =>
    eventItem.contributingMemberIds.includes(m.id)
  );

  return (
    <div>
      {/* Top Blue Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 overflow-hidden">
        <div className="bg-[#0a4f6c] dark:bg-blue-500 h-full w-full" />
      </div>

      <div className="pt-6 sm:pt-8 pb-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="wide-container">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4f6c] dark:text-sky-400 hover:text-[#aa1c34] dark:hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Events</span>
            </Link>
          </div>

          {/* 2-Column Layout: Main Story/Timeline (Left) & Sidebar (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN CONTENT COLUMN: Header, Banner, & Timeline */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Title & Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-[#0a4f6c] dark:bg-blue-600 text-white font-bold rounded-md">
                    {eventItem.category}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-400" />
                    {eventItem.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#aa1c34] dark:text-red-300 bg-rose-50 dark:bg-red-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-red-800">
                    <MapPin className="w-3.5 h-3.5" />
                    {eventItem.location}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-300 leading-tight">
                  {eventItem.title}
                </h1>

                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {eventItem.excerpt}
                </p>
              </div>

              {/* Event Main Banner */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700">
                <Image
                  src={eventItem.imageUrl}
                  alt={eventItem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* TIMELINE SECTION (Day 1, Day 2, Day 3...) */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
                <div className="border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#aa1c34] dark:text-red-400 uppercase tracking-wider block">
                      Step-by-Step Chronology
                    </span>
                    <h2 className="text-xl font-bold text-[#0a4f6c] dark:text-sky-300">
                      Mission Field Timeline
                    </h2>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#0a4f6c] dark:text-sky-400" />
                </div>

                {/* Render Timeline Days */}
                {eventItem.timelineDays && eventItem.timelineDays.length > 0 ? (
                  <div className="space-y-0 pt-4">
                    {eventItem.timelineDays.map((day) => (
                      <TimelineDayCard key={day.dayNumber} day={day} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {eventItem.content}
                  </p>
                )}
              </div>

            </div>

            {/* SIDEBAR COLUMN: Contributing Members & Support */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="sticky top-20 space-y-6">
                
                {/* Sidebar Box 1: Contributing Members */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0a4f6c] dark:text-sky-300">
                        Contributing Team
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Members on this activity
                      </p>
                    </div>
                  </div>

                  {/* List of Contributing Members in 2 per row grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {contributingMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                        {/* Circle Photo */}
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white dark:border-slate-800 shadow-sm bg-slate-200 dark:bg-slate-700">
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#0a4f6c] dark:text-sky-300 truncate">
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Box 2: Support Card */}
                <div className="bg-[#0a4f6c] dark:bg-slate-950 text-white rounded-2xl p-6 shadow-md border border-[#0a4f6c] dark:border-slate-800 space-y-3 text-xs">
                  <h4 className="text-sm font-bold leading-snug">
                    {eventItem.impactSummary || 'Empowering Local Communities'}
                  </h4>
                  <p className="text-slate-200 dark:text-slate-300 text-[11px] leading-relaxed">
                    Defenders of Future is non-profit and volunteer-driven. Every contribution directly funds schools, food packages, and deep water wells.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold text-xs shadow transition-colors"
                    >
                      Support Next Mission
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
