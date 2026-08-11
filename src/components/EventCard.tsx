import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Users, Sparkles } from 'lucide-react';
import { EventItem, Member } from '@/lib/seedData';

interface EventCardProps {
  eventItem: EventItem;
  allMembers: Member[];
}

export default function EventCard({ eventItem, allMembers }: EventCardProps) {
  // Find contributing members for this event
  const contributingMembers = allMembers.filter((m) =>
    eventItem.contributingMemberIds.includes(m.id)
  );

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/9] w-full bg-slate-800 overflow-hidden">
          <Image
            src={eventItem.imageUrl}
            alt={eventItem.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#0a4f6c] text-white rounded-full text-xs font-bold shadow-md">
              {eventItem.category}
            </span>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <Calendar className="w-3.5 h-3.5 text-[#dfa234]" />
            <span>{eventItem.date}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#aa1c34]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{eventItem.location}</span>
          </div>

          <h3 className="text-xl font-bold text-[#0a4f6c] group-hover:text-[#aa1c34] transition-colors leading-snug">
            <Link href={`/events/${eventItem.slug}`}>
              {eventItem.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {eventItem.excerpt}
          </p>

          {/* Impact Summary Pill */}
          {eventItem.impactSummary && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-[#0a4f6c] text-xs font-extrabold rounded-lg border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-[#dfa234]" />
                {eventItem.impactSummary}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contributing Members Section */}
      <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#0a4f6c]" />
            Contributing Team:
          </div>
          {/* Avatar Stack */}
          <div className="flex items-center -space-x-2">
            {contributingMembers.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="relative w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200"
                title={`${member.name} - ${member.role}`}
              >
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {contributingMembers.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-[#0a4f6c] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                +{contributingMembers.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/events/${eventItem.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#aa1c34] hover:text-[#0a4f6c] transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
