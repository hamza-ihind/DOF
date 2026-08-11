import React from 'react';
import EventCard from '@/components/EventCard';
import { getEvents, getMembers } from '@/lib/db';

export const metadata = {
  title: 'Field Events & Activity Blog | Defenders of Future Biougra',
  description: 'Explore field reports, school makeovers, food parcel distributions, and well drilling projects by Defenders of Future in Biougra, Morocco.',
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();
  const members = await getMembers();

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="wide-container">
        
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c]">
            Events & Impact Stories
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Detailed reports of completed field activities in Biougra and surrounding forgotten villages, featuring multi-day timelines and contributing team members.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((eventItem) => (
            <EventCard key={eventItem.id} eventItem={eventItem} allMembers={members} />
          ))}
        </div>

      </div>
    </div>
  );
}
