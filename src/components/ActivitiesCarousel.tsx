'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { EventItem } from '@/lib/seedData';

interface ActivitiesCarouselProps {
  events?: EventItem[];
}

export default function ActivitiesCarousel({ events }: ActivitiesCarouselProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = (events && events.length > 0)
    ? events.map((event) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        tag: event.category,
        location: event.location,
        desc: event.excerpt,
        image: event.imageUrl
      }))
    : [];

  const prevSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused || items.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, items.length]);

  return (
    <section id="activities" className="py-12 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300 scroll-mt-20 sm:scroll-mt-24">
      <div className="wide-container">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400">
              {t('carousel.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {t('carousel.subtitle')}
            </p>
          </div>

          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0a4f6c] dark:hover:bg-blue-600 hover:text-white text-[#0a4f6c] dark:text-sky-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#aa1c34] dark:hover:bg-red-600 hover:text-white text-[#aa1c34] dark:text-red-400 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Box or Empty State */}
        {items.length === 0 ? (
          <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No association activities published yet.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add new activity missions in the Admin panel to feature them here.</p>
          </div>
        ) : (
          <div
            className="relative rounded-2xl overflow-hidden bg-slate-900 dark:bg-slate-950 shadow-lg border border-slate-800"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative min-h-[400px] sm:min-h-[460px] w-full flex items-center">
              {items.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a4f6c] via-[#0a4f6c]/50 to-transparent dark:from-slate-950 dark:via-slate-950/60" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-3xl space-y-2 text-white">
                      <span className="text-xs font-bold text-[#dfa234]">
                        {item.tag} • {item.location}
                      </span>

                      <h3 className="text-xl sm:text-3xl font-extrabold leading-tight text-white">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="pt-1">
                        <Link
                          href={item.slug ? `/events/${item.slug}` : '/events'}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0a4f6c] hover:bg-[#dfa234] hover:text-white font-bold text-xs shadow transition-colors"
                        >
                          <span>{t('carousel.viewDetails')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
