'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { EventDay } from '@/lib/seedData';

interface TimelineDayCardProps {
  day: EventDay;
}

export default function TimelineDayCard({ day }: TimelineDayCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? day.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev === day.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-[#0a4f6c] pb-8 last:pb-0">
      {/* Timeline Bullet Node */}
      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#0a4f6c] text-white font-extrabold text-xs flex items-center justify-center border-4 border-slate-50 shadow">
        {day.dayNumber}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Day Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-[#0a4f6c]">
            {day.title}
          </h3>
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-[#aa1c34]" />
            {day.date}
          </span>
        </div>

        {/* Day Description */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {day.description}
        </p>

        {/* Day Photo Carousel / Gallery */}
        {day.images && day.images.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-[#0a4f6c]" />
                Day {day.dayNumber} Photo Gallery ({currentImgIndex + 1}/{day.images.length})
              </span>
              {day.images.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevImage}
                    className="p-1 rounded-md bg-slate-100 hover:bg-[#0a4f6c] hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-1 rounded-md bg-slate-100 hover:bg-[#aa1c34] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <Image
                src={day.images[currentImgIndex]}
                alt={`${day.title} photo ${currentImgIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
