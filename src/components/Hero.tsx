import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, PackageCheck, Droplets } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#0a4f6c] via-[#06354a] to-[#0a4f6c] text-white py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" />

      <div className="wide-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Headlines & CTA */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Defenders of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-[#aa1c34]">Future</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Refurbishing rural primary schools, distributing food and essential packages, and drilling deep water wells under the banner <strong className="text-white font-bold">&ldquo;Spring of Life&rdquo;</strong> to serve forgotten villages around Biougra, Morocco.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold text-sm shadow transition-all"
              >
                <span>View Activities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/members"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                <span>Meet Members</span>
              </Link>
            </div>

            {/* Quick 3 Pillars Bar */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfa234] mb-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#aa1c34]" />
                  <span>Schools</span>
                </div>
                <div className="text-[11px] text-slate-300">Sanding, paint & supplies</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfa234] mb-0.5">
                  <PackageCheck className="w-3.5 h-3.5 text-[#aa1c34]" />
                  <span>Food Package</span>
                </div>
                <div className="text-[11px] text-slate-300">Flour, staples & soap</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfa234] mb-0.5">
                  <Droplets className="w-3.5 h-3.5 text-[#aa1c34]" />
                  <span>Spring of Life</span>
                </div>
                <div className="text-[11px] text-slate-300">Deep water well drilling</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/10">
              <div className="relative aspect-[16/10] w-full bg-slate-800">
                <Image
                  src="/images/school_renovation.jpg"
                  alt="Defenders of Future Volunteers"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
