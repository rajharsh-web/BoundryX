'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f14] border-t border-[#1c2632] mt-16 pb-20 lg:pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Strict Demo Disclaimer Box */}
        <div className="mb-10 p-4 sm:p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200/90 flex flex-col sm:flex-row items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
              Educational & Simulated Entertainment Notice
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {siteConfig.footer.demoNotice}
            </p>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1c2632]">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                DEMO
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Col 2: Cricket Coverage */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Cricket Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cricket" className="hover:text-emerald-400 transition">
                  All Matches & Series
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-emerald-400 transition">
                  In-Play & Live Scores
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="hover:text-emerald-400 transition">
                  Upcoming Fixtures
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-emerald-400 transition">
                  Completed Match Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Simulated Betting */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Simulated Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/demo-bets" className="hover:text-emerald-400 transition">
                  My Demo Bets & P&L
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="hover:text-emerald-400 transition">
                  Demo Wallet & Free Faucet
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition">
                  Profile & Demo Limits
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition">
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Terms & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footer.legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-emerald-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {siteConfig.name}. Simulated cricket entertainment portal.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Demo Simulator Mode Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
