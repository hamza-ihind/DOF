'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  Menu,
  X,
  Heart,
  Lock,
  LogOut,
  Sun,
  Moon,
  Globe,
  Home,
  Info,
  Sparkles,
  Users,
  Calendar,
  Mail,
  Newspaper,
  User,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // Handle header background shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check admin session on path changes
  useEffect(() => {
    checkAdminSession();
  }, [pathname]);

  // Close side navigation on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close side navigation on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when side navigation drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      setIsAdminLoggedIn(data.authenticated === true);
    } catch {
      setIsAdminLoggedIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAdminLoggedIn(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
<<<<<<< HEAD
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.about'), href: '/#about', icon: Info },
    { name: t('nav.activities'), href: '/#activities', icon: Sparkles },
    { name: t('nav.members'), href: '/members', icon: Users },
    { name: t('nav.events'), href: '/events', icon: Calendar },
    { name: t('nav.contact'), href: '/contact', icon: Mail },
    { name: t('nav.newsletters'), href: '/newsletters', icon: Newspaper },
    { name: t('nav.memberSpace'), href: '/account', icon: User },
=======
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.activities'), href: '/#activities' },
    { name: t('nav.members'), href: '/members' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.newsletter'), href: '/newsletter' },
    { name: t('nav.contact'), href: '/contact' },
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href.startsWith('/#')) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 py-3 border-b border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="wide-container flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-[#0a4f6c] dark:text-sky-400 group-hover:text-[#aa1c34] dark:group-hover:text-red-400 transition-colors">
                Defenders <span className="text-[#aa1c34] dark:text-red-400">of Future</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Bar (Cleanly visible on large screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map((link, idx) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`text-xs xl:text-sm font-semibold transition-all px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                    active
                      ? 'text-[#aa1c34] dark:text-red-400 bg-red-50 dark:bg-red-950/40 shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#aa1c34] dark:hover:text-red-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls: Theme + Language + Admin/Support + Mobile Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher Control */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-[#0a4f6c] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === 'fr'
                    ? 'bg-[#aa1c34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FR
              </button>
            </div>

            {/* Admin Control (Desktop/Tablet) */}
            {isAdminLoggedIn ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white text-xs font-bold shadow hover:bg-[#083c53] transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{t('nav.admin')}</span>
                </Link>

                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 transition-all"
                  title="Logout Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0a4f6c] dark:text-sky-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{t('nav.admin')}</span>
              </Link>
            )}

            {/* Support Us Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow transition-all shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span className="hidden md:inline">{t('nav.support')}</span>
            </Link>

            {/* Mobile / Tablet Menu Button (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
              aria-label="Open side navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              <span className="text-xs font-bold hidden xs:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation Bar (Slide-out Drawer for Phone & Tablet) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[300px] sm:w-[340px] max-w-[85vw] bg-white dark:bg-slate-900 z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Side Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 flex items-center justify-center text-white shadow">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="font-extrabold text-sm tracking-tight text-[#0a4f6c] dark:text-sky-400">
              Defenders <span className="text-[#aa1c34] dark:text-red-400">of Future</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
            Navigation
          </div>
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={idx}
                href={link.href}
<<<<<<< HEAD
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-red-50 dark:bg-red-950/40 text-[#aa1c34] dark:text-red-400 font-bold border border-red-200/60 dark:border-red-900/40 shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#aa1c34] dark:hover:text-red-400'
=======
                className={`text-sm font-semibold transition-colors py-1 ${
                  isActive
                    ? 'text-[#aa1c34] dark:text-red-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#aa1c34] dark:hover:text-red-400'
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-[#aa1c34] dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span>{link.name}</span>
                </div>
                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#aa1c34] dark:bg-red-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                )}
              </Link>
            );
          })}
        </nav>

<<<<<<< HEAD
        {/* Drawer Bottom Controls & CTAs */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-3">
          {/* Quick Controls: Theme & Language */}
          <div className="flex items-center justify-between gap-2">
=======
        {/* Action Controls: Theme Toggle + 3-Language Switcher (EN | FR | AR) + Admin/Support */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Switcher Control (EN | FR) */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
<<<<<<< HEAD
=======
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                language === 'fr'
                  ? 'bg-[#aa1c34] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

          {/* Admin Control */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white text-xs font-bold shadow hover:bg-[#083c53] transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                {t('nav.admin')}
              </Link>
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea

            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-[#0a4f6c] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
<<<<<<< HEAD
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === 'fr'
                    ? 'bg-[#aa1c34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                FR
=======
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('admin.logout')}</span>
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
              </button>
            </div>
          </div>

<<<<<<< HEAD
          {/* Support Us CTA */}
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>{t('nav.support')}</span>
          </Link>

          {/* Admin link / Logout */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white text-xs font-bold shadow hover:bg-[#083c53] transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('nav.admin')}</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminLogout();
                }}
                className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#aa1c34] dark:text-red-300 border border-red-200 dark:border-red-800 transition-all"
                title="Logout Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
=======
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500">Language / اللغة</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-[#0a4f6c] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded text-xs font-bold ${language === 'fr' ? 'bg-[#aa1c34] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                FR
              </button>
            </div>
          </div>

          {navLinks.map((link, idx) => (
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 text-[#0a4f6c] dark:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav.admin')}</span>
            </Link>
<<<<<<< HEAD
          )}
=======
          ))}
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
        </div>
      </aside>
    </>
  );
}
