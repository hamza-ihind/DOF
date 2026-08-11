import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import ActivitiesCarousel from '@/components/ActivitiesCarousel';
import MemberCard from '@/components/MemberCard';
import EventCard from '@/components/EventCard';
import ContactForm from '@/components/ContactForm';
import { getMembers, getEvents } from '@/lib/db';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const members = await getMembers();
  const events = await getEvents();

  const featuredMembers = members.slice(0, 4);
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Us Section */}
      <AboutUs />

      {/* 3. Activities Carousel */}
      <ActivitiesCarousel />

      {/* 4. Featured Events Section */}
      <section className="py-12 bg-slate-50 relative overflow-hidden">
        <div className="wide-container">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c]">
                Latest Association Events
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
                Read full detailed reports from our school makeovers, food parcel drops, and deep well drilling projects.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#aa1c34] hover:text-[#0a4f6c] transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((item) => (
              <EventCard key={item.id} eventItem={item} allMembers={members} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Team Members Spotlight Section */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="wide-container">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c]">
              Meet Our Team Members
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              The compassionate Moroccan leaders and volunteers driving change in forgotten villages near Biougra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0a4f6c] hover:bg-[#aa1c34] text-white font-bold text-xs shadow transition-colors"
            >
              <span>View Full Organizational Tree</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Contact Us Section */}
      <ContactForm />
    </div>
  );
}
