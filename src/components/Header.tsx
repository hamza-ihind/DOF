'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, Heart, Lock, LogOut } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check Admin auth state on navigation
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
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Activities', href: '/#activities' },
    { name: 'Members', href: '/members' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200'
          : 'bg-white py-3 border-b border-slate-100'
      }`}
    >
      <div className="wide-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#0a4f6c] flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight leading-none text-[#0a4f6c] group-hover:text-[#aa1c34] transition-colors">
              Defenders <span className="text-[#aa1c34]">of Future</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Biougra Association
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors py-1 ${
                  isActive ? 'text-[#aa1c34]' : 'text-slate-700 hover:text-[#aa1c34]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Conditional Action Area: Admin Login OR Admin Panel + Logout */}
        <div className="flex items-center gap-2.5">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a4f6c] text-white text-xs font-bold shadow hover:bg-[#083c53] transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Panel
              </Link>

              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#aa1c34] text-xs font-bold border border-red-200 transition-all"
                title="Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0a4f6c] text-xs font-bold border border-slate-200 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#aa1c34] text-white text-xs font-bold shadow hover:bg-[#7d1224] transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            Support Us
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-slate-800 hover:text-[#aa1c34]"
            >
              {link.name}
            </Link>
          ))}
          {isAdminLoggedIn ? (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-bold text-[#0a4f6c] flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminLogout();
                }}
                className="w-full text-left py-1.5 text-sm font-bold text-[#aa1c34] flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout Admin
              </button>
            </>
          ) : (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-[#0a4f6c] flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
