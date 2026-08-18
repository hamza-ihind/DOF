import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import ActivitiesCarousel from '@/components/ActivitiesCarousel';
import MemberCard from '@/components/MemberCard';
import EventCard from '@/components/EventCard';
import ContactForm from '@/components/ContactForm';
import { getMembers, getEvents } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const members = await getMembers();
  const events = await getEvents();

  const featuredMembers = members.slice(0, 4);
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="space-y-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Us Section */}
      <AboutUs />

      {/* 3. Activities Carousel */}
      <ActivitiesCarousel events={events} />

      {/* 4. Featured Events Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/80 relative overflow-hidden transition-colors duration-300">
        <div className="wide-container">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
                Latest Association Events
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl">
                Read full detailed reports from our school makeovers, food parcel drops, and deep well drilling projects.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#aa1c34] dark:text-red-400 hover:text-[#0a4f6c] dark:hover:text-sky-300 transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No events published yet.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create new event reports in the Admin control panel to display them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((item) => (
                <EventCard key={item.id} eventItem={item} allMembers={members} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. Team Members Spotlight Section */}
      <section className="py-12 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
        <div className="wide-container">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
              Meet Our Team Members
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              The compassionate Moroccan leaders and volunteers driving change in forgotten villages near Biougra.
            </p>
          </div>

          {featuredMembers.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 mb-8">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No team members registered yet.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add association members in the Admin control panel to present your team.</p>
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
              <span>View Association Members</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Contact Us Section */}
      <ContactForm />
    </div>
  );
}
