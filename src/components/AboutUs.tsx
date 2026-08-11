import React from 'react';
import { Paintbrush, PackageCheck, Droplets, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="about" className="py-12 bg-slate-50 relative overflow-hidden">
      <div className="wide-container relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a4f6c]">
            Who We Are & What We Do
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <strong className="text-[#0a4f6c]">Defenders of Future</strong> is a non-profit association based in Biougra, Morocco, refurbishing schools in forgotten villages, distributing food & essential packages, and drilling clean water wells.
          </p>
        </div>

        {/* 3 Core Pillars - Wide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: School Refurbishment & Supplies */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-[#0a4f6c] text-white flex items-center justify-center mb-4 shadow">
              <Paintbrush className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] mb-2">
              School Refurbishment & Supplies
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Serving students in forgotten villages to ensure an optimal learning environment.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Sanding walls for repainting and repairing floors & ceilings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Stocking classrooms with notebooks, pens, art materials & backpacks.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Food & Hygiene Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-[#aa1c34] text-white flex items-center justify-center mb-4 shadow">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] mb-2">
              Distribution of Food & Essentials
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Providing essential food packages containing flour and soaps based on family size census.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Gathering family size information prior to village return visit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Procuring, sorting, and delivering flour bags and various soaps.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Spring of Life Well Drilling */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="w-11 h-11 rounded-xl bg-[#0a4f6c] text-white flex items-center justify-center mb-4 shadow">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a4f6c] mb-2">
              &ldquo;Spring of Life&rdquo; Well Drilling
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Bringing new life to village inhabitants through deep clean water access.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Site selection and consulting experts to determine suitability.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#aa1c34] shrink-0 mt-0.5" />
                <span>Drilling to necessary depth for immediate clean water access.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
