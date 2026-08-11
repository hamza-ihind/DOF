import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react';
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
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          {/* Location & Date Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#aa1c34]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{eventItem.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-[#0a4f6c]" />
              <span>{eventItem.date}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#0a4f6c] group-hover:text-[#aa1c34] transition-colors leading-snug">
            <Link href={`/events/${eventItem.slug}`}>
              {eventItem.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {eventItem.excerpt}
          </p>
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

