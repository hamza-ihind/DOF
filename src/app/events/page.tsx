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
    <div className="pt-6 sm:pt-8 pb-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="wide-container">
        
        {/* Page Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
            Events & Impact Stories
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Detailed reports of completed field activities in Biougra and surrounding forgotten villages, featuring multi-day timelines and contributing team members.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No events published yet.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create new event mission reports in the Admin control panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((eventItem) => (
              <EventCard key={eventItem.id} eventItem={eventItem} allMembers={members} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
