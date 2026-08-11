import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getMembers } from '@/lib/db';
import { Calendar, MapPin, ArrowLeft, Shield, Sparkles, Users } from 'lucide-react';
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
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="wide-container">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4f6c] hover:text-[#aa1c34] transition-colors"
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
                <span className="px-3 py-1 bg-[#0a4f6c] text-white font-bold rounded-md">
                  {eventItem.category}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-[#dfa234]" />
                  {eventItem.date}
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#aa1c34] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <MapPin className="w-3.5 h-3.5" />
                  {eventItem.location}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a4f6c] leading-tight">
                {eventItem.title}
              </h1>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {eventItem.excerpt}
              </p>
            </div>

            {/* Event Main Banner */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow border border-slate-200">
              <Image
                src={eventItem.imageUrl}
                alt={eventItem.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* TIMELINE SECTION (Day 1, Day 2, Day 3...) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#aa1c34] uppercase tracking-wider block">
                    Step-by-Step Chronology
                  </span>
                  <h2 className="text-xl font-bold text-[#0a4f6c]">
                    Mission Field Timeline
                  </h2>
                </div>
                <Sparkles className="w-5 h-5 text-[#dfa234]" />
              </div>

              {/* Render Timeline Days */}
              {eventItem.timelineDays && eventItem.timelineDays.length > 0 ? (
                <div className="space-y-0 pt-4">
                  {eventItem.timelineDays.map((day) => (
                    <TimelineDayCard key={day.dayNumber} day={day} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  {eventItem.content}
                </p>
              )}
            </div>

          </div>

          {/* SIDEBAR COLUMN: Contributing Members & Quick Info */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="sticky top-20 space-y-6">
              
              {/* Sidebar Box 1: Contributing Members */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] text-white flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a4f6c]">
                      Contributing Team
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Association members on this activity
                    </p>
                  </div>
                </div>

                {/* List of Contributing Members with Circle Photos */}
                <div className="space-y-3">
                  {contributingMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#0a4f6c]/30 transition-colors">
                      {/* Circle Photo */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-sm bg-slate-200">
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#0a4f6c] truncate">
                          {member.name}
                        </h4>
                        <p className="text-[11px] text-[#aa1c34] font-semibold truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Box 2: Activity Summary Card */}
              <div className="bg-[#0a4f6c] text-white rounded-2xl p-6 shadow-md space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#dfa234] font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Biougra Field Mission</span>
                </div>
                <h4 className="text-sm font-bold leading-snug">
                  {eventItem.impactSummary || 'Empowering Forgotten Villages'}
                </h4>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Defenders of Future is non-profit and 100% volunteer-driven. Every contribution directly funds schools, food packages, and deep water wells.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold text-xs shadow transition-colors"
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
  );
}
