'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Menu,
  X,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { BalanceDisplay } from '@/components/betting/BalanceDisplay';
import { useDemoBetting } from '@/context/DemoBettingContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { betSlip, setIsSlipOpen, user } = useDemoBetting();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cricket', href: '/cricket' },
    { name: 'Live', href: '/live', badge: 'LIVE' },
    { name: 'Upcoming', href: '/upcoming' },
    { name: 'Results', href: '/results' },
    { name: 'My Bets', href: '/demo-bets' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0e141a]/95 backdrop-blur-md border-b border-[#232f38] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-hidden"
              aria-label={`${siteConfig.name} Home`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition">
                    {siteConfig.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {siteConfig.logo.badge}
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#182029] text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-[#151d26]'
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-dot" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Demo Balance, Bet Slip Button, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance Display */}
            <div className="hidden sm:block">
              <BalanceDisplay />
            </div>

            <div className="sm:hidden">
              <BalanceDisplay compact />
            </div>

            {/* Bet Slip Trigger */}
            <button
              type="button"
              onClick={() => setIsSlipOpen(true)}
              aria-label="Open bet slip"
              className="relative p-2 sm:px-3 sm:py-2 rounded-lg bg-[#182029] hover:bg-[#1f2935] text-slate-200 border border-[#263342] transition flex items-center gap-2"
            >
              <ReceiptText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold hidden md:inline">Slip</span>
              {betSlip.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {betSlip.length}
                </span>
              )}
            </button>

            {/* Admin Console Shortcut (Only visible if role is admin) */}
            {user.role === 'admin' && (
              <Link
                href="/admin"
                title="Admin Portal"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* Profile Avatar / Link or Sign In */}
            {user.id !== 'guest' ? (
              <Link
                href="/profile"
                aria-label="User Profile"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#182029] text-slate-300 hover:text-white transition border border-transparent hover:border-[#263342]"
              >
                <div className="w-7 h-7 rounded-full bg-[#1e2935] border border-[#263342] flex items-center justify-center text-xs font-bold text-emerald-400">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#182029] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1c2632] bg-[#121820] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#182029] text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#182029]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      LIVE
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#1c2632] flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#182029]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Console</span>
            </Link>
            <Link
              href="/wallet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
            >
              <span>Demo Wallet</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
