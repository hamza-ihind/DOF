import HomeCommunity from '@/components/HomeCommunity';
import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import ActivitiesCarousel from '@/components/ActivitiesCarousel';
import MemberCard from '@/components/MemberCard';
import EventCard from '@/components/EventCard';
import HomeMembersSection from '@/components/HomeMembersSection';
import ContactForm from '@/components/ContactForm';
import { getMembers, getEvents } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our team will share activity reports here. Stay connected for upcoming news.</p>
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
      <HomeMembersSection members={members} />

      <HomeCommunity />
      {/* 6. Contact Us Section */}
      <ContactForm />
    </div>
  );
}