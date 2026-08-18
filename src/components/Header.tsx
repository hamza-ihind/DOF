'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, Heart, Lock, LogOut, Sun, Moon, Globe } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAdminSession();
  }, [pathname]);

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
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.activities'), href: '/#activities' },
    { name: t('nav.members'), href: '/members' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 py-3 border-b border-slate-100 dark:border-slate-800'
      }`}
    >
      <div className="wide-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight leading-none text-[#0a4f6c] dark:text-sky-400 group-hover:text-[#aa1c34] dark:group-hover:text-red-400 transition-colors">
              Defenders <span className="text-[#aa1c34] dark:text-red-400">of Future</span>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`text-sm font-semibold transition-colors py-1 ${
                  isActive
                    ? 'text-[#aa1c34] dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#aa1c34] dark:hover:text-red-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Theme Toggle + Language Switcher + Admin/Support */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Switcher Control */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
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

          {/* Admin Control */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0a4f6c] dark:bg-blue-600 text-white text-xs font-bold shadow hover:bg-[#083c53] transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                {t('nav.admin')}
              </Link>

              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 transition-all"
                title="Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0a4f6c] dark:text-sky-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              {t('nav.admin')}
            </Link>
          )}

          {/* Support Us Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>{t('nav.support')}</span>
          </Link>

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
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#aa1c34]"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-bold text-[#aa1c34] dark:text-red-400"
          >
            ♥ {t('nav.support')}
          </Link>
        </div>
      )}
    </header>
  );
}
