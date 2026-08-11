'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { MOCK_CAROUSEL_ITEMS } from '@/lib/seedData';

export default function ActivitiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? MOCK_CAROUSEL_ITEMS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === MOCK_CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  return (
    <section id="activities" className="py-12 bg-white relative overflow-hidden">
      <div className="wide-container">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c]">
              Recent Field Activities
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Highlights of school makeovers, food package sorting, and well drilling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-[#0a4f6c] hover:text-white text-[#0a4f6c] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-[#aa1c34] hover:text-white text-[#aa1c34] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Box */}
        <div
          className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-800"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[400px] sm:min-h-[460px] w-full flex items-center">
            {MOCK_CAROUSEL_ITEMS.map((item, idx) => {
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a4f6c] via-[#0a4f6c]/50 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-3xl space-y-2 text-white">
                    <span className="text-xs font-bold text-[#dfa234]">
                      {item.tag} • {item.location}
                    </span>

                    <h3 className="text-xl sm:text-3xl font-extrabold leading-tight text-white">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-1">
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#0a4f6c] hover:bg-[#dfa234] hover:text-white font-bold text-xs shadow transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
