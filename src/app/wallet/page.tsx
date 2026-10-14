'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coins,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { siteConfig } from '@/config/site';

export default function WalletPage() {
  const { demoBalance, transactions, resetAllDemoData } = useDemoBetting();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Wallet</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-emerald-400" />
            Simulated Demo Credits Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View your play balance and audit demo transaction records.
          </p>
        </div>

        <button
          type="button"
          onClick={resetAllDemoData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182029] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#263342] hover:border-rose-800 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Wallet
        </button>
      </div>

      {/* Strict Legal Non-Gambling Disclaimer */}
      <div id="disclaimer" className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>IMPORTANT: SIMULATED DEMO CURRENCY ONLY</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-200/90">
          {siteConfig.footer.demoNotice}
        </p>
      </div>

      {/* Balance Hero Card */}
      <div className="bg-gradient-to-br from-[#121820] to-[#182029] border border-[#263342] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Available Play Balance
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white flex items-baseline gap-2">
              <span>{demoBalance.toLocaleString()}</span>
              <span className="text-base sm:text-lg font-sans text-emerald-400 font-bold uppercase">
                DEMO PTS
              </span>
            </div>
          </div>

          {/* Admin-only credit info notice */}
          <div className="w-full md:w-auto max-w-sm p-4 rounded-xl bg-[#182029] border border-[#263342] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>How to Get Credits</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Virtual credits can only be manually allocated by an authorized administrator.
              Self-service faucets, welcome bonuses, and automatic refills are disabled.
            </p>
            <p className="text-[11px] text-slate-500">
              Contact your platform admin to request a demo credit allocation.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2632]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            Simulated Credits Ledger ({transactions.length} Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Audit-Verified
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No transactions yet. Your ledger will appear here once credits are allocated by an admin.
          </div>
        ) : (
          <div className="divide-y divide-[#1c2632]">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.amount > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-200 block truncate">
                      {tx.description}
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      {tx.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-mono font-bold block ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} pts
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Bal: {tx.balanceAfter.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
