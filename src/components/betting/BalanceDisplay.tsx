'use client';

import React from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

interface BalanceDisplayProps {
  compact?: boolean;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ compact = false }) => {
  const { demoBalance } = useDemoBetting();

  if (compact) {
    return (
      <Link
        href="/wallet"
        aria-label="View demo balance"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#182029] border border-[#263342] hover:border-slate-600 transition"
      >
        <Coins className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-mono text-xs font-bold text-white">
          {demoBalance.toLocaleString()}
        </span>
        <span className="text-[10px] text-emerald-400 font-bold uppercase">
          DEMO
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/wallet"
      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#182029] border border-[#263342] hover:border-slate-600 transition shadow-xs"
      title="Simulated Demo Credits (No Real Money - Admin Allocation Only)"
    >
      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
        <Coins className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition">
            {demoBalance.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            DEMO PTS
          </span>
        </div>
      </div>
    </Link>
  );
};
