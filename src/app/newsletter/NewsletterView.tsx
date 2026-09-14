'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Newspaper, 
  ExternalLink, 
  Play, 
  Instagram, 
  Video, 
  Calendar, 
  Sparkles, 
  ArrowUpRight,
  Search,
  Tag
} from 'lucide-react';
import { NewsletterItem } from '@/lib/seedData';
import { useLanguage } from '@/context/LanguageContext';

interface NewsletterViewProps {
  newsletters: NewsletterItem[];
}

function getLinkDetails(url: string, t: (key: any) => string) {
  const lower = (url || '').toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return {
      type: 'youtube',
      label: t('newsletter.watchVideo'),
      badge: 'YouTube Video',
      icon: <Play className="w-4 h-4 fill-current" />
    };
  }
  if (lower.includes('instagram.com')) {
    return {
      type: 'instagram',
      label: t('newsletter.viewPost'),
      badge: 'Instagram',
      icon: <Instagram className="w-4 h-4" />
    };
  }
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    return {
      type: 'facebook',
      label: t('newsletter.viewPost'),
      badge: 'Facebook',
      icon: <Video className="w-4 h-4" />
    };
  }
  return {
    type: 'external',
    label: t('newsletter.openLink'),
    badge: 'Media / Link',
    icon: <ExternalLink className="w-4 h-4" />
  };
}

export default function NewsletterView({ newsletters }: NewsletterViewProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const sorted = useMemo(() => {
    return [...newsletters].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [newsletters]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.description.toLowerCase().includes(q) ||
      (n.category && n.category.toLowerCase().includes(q))
    );
  }, [sorted, searchQuery]);

  const featured = filtered.length > 0 ? filtered[0] : null;
  const restItems = filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <div className="pt-6 sm:pt-8 pb-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <div className="wide-container space-y-10">
        
        {/* Page Header Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a4f6c]/10 dark:bg-sky-950/60 text-[#0a4f6c] dark:text-sky-300 text-xs font-bold mb-1">
            <Newspaper className="w-3.5 h-3.5" />
            <span>DOF Media & Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a4f6c] dark:text-sky-400 tracking-tight">
            {t('newsletter.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t('newsletter.subtitle')}
          </p>

          {newsletters.length > 3 && (
            <div className="pt-2 max-w-md mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher une actualité ou vidéo...' : 'Search news, videos, or posts...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#0a4f6c]/10 dark:bg-sky-950/60 text-[#0a4f6c] dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
              <Newspaper className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">{t('newsletter.noNewsletters')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('newsletter.noNewslettersDesc')}</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* FEATURED HERO CARD ON TOP */}
            {featured && (
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#aa1c34] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('newsletter.featured')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.date}
                  </span>
                </div>

                <a
                  href={featured.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover:ring-[#0a4f6c] dark:hover:ring-sky-400"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Featured Image */}
                    <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={featured.imageUrl || '/images/school_renovation.jpg'}
                        alt={featured.title}
                        fill
                        unoptimized={Boolean(featured.imageUrl && featured.imageUrl.startsWith('http'))}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden" />
                      
                      {/* Play / Link Floating Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                          {getLinkDetails(featured.linkUrl, t).icon}
                          <span>{featured.category || getLinkDetails(featured.linkUrl, t).badge}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-[#0a4f6c] dark:text-sky-300 group-hover:bg-[#aa1c34] group-hover:text-white transition-colors shadow-lg">
                        <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Featured Details */}
                    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="hidden lg:flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a4f6c]/10 dark:bg-sky-950/60 text-[#0a4f6c] dark:text-sky-300 text-xs font-bold">
                            <Tag className="w-3 h-3" />
                            {featured.category || getLinkDetails(featured.linkUrl, t).badge}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#aa1c34] dark:group-hover:text-red-400 transition-colors leading-tight">
                          {featured.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                          {featured.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a4f6c] group-hover:bg-[#aa1c34] dark:bg-blue-600 dark:group-hover:bg-red-600 text-white font-bold text-xs shadow-md transition-colors">
                          {getLinkDetails(featured.linkUrl, t).icon}
                          <span>{getLinkDetails(featured.linkUrl, t).label}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </span>

                        <span className="text-xs text-slate-400 font-mono">
                          {featured.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* PREVIOUS NEWSLETTERS GRID */}
            {restItems.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-lg font-extrabold text-[#0a4f6c] dark:text-sky-400">
                    {language === 'fr' ? 'Toutes les publications & médias' : 'All Stories & Media'}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {restItems.length} {language === 'fr' ? 'articles' : 'stories'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restItems.map((item) => {
                    const linkInfo = getLinkDetails(item.linkUrl, t);
                    return (
                      <a
                        key={item.id}
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-[#0a4f6c] dark:hover:ring-sky-400"
                      >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-[#0a4f6c] group-hover:bg-[#aa1c34] transition-colors z-10" />

                        <div>
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                            <Image
                              src={item.imageUrl || '/images/school_renovation.jpg'}
                              alt={item.title}
                              fill
                              unoptimized={Boolean(item.imageUrl && item.imageUrl.startsWith('http'))}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                                {linkInfo.icon}
                                <span>{item.category || linkInfo.badge}</span>
                              </span>
                            </div>

                            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-[#0a4f6c] dark:text-sky-300 group-hover:bg-[#aa1c34] group-hover:text-white transition-colors shadow">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-2">
                            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.date}</span>
                            </div>

                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#aa1c34] dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-5 pt-0">
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#0a4f6c] dark:text-sky-300 group-hover:text-[#aa1c34] dark:group-hover:text-red-400">
                            <span className="flex items-center gap-1.5">
                              {linkInfo.icon}
                              <span>{linkInfo.label}</span>
                            </span>
                            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
