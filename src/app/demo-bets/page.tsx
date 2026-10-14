'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ReceiptText,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DemoBetsPage() {
  const { placedBets, cashOutBet, settleBetSimulation } = useDemoBetting();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SETTLED'>('ALL');

  const pendingBets = placedBets.filter((b) => b.status === 'PENDING');
  const settledBets = placedBets.filter((b) => b.status !== 'PENDING');

  const filteredBets = placedBets.filter((b) => {
    if (filter === 'PENDING') return b.status === 'PENDING';
    if (filter === 'SETTLED') return b.status !== 'PENDING';
    return true;
  });

  // Calculate simulated P&L
  const totalStaked = placedBets.reduce((acc, b) => acc + b.stake, 0);
  const totalPayout = placedBets.reduce((acc, b) => acc + (b.payoutAmount || 0), 0);
  const netDemoProfit = totalPayout - (placedBets.filter(b => b.status !== 'PENDING').reduce((acc, b) => acc + b.stake, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">My Demo Bets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ReceiptText className="w-6 h-6 text-emerald-400" />
            My Demo Bets Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track active simulated wagers, settled profits/losses, and test early cashouts.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'ALL', label: `All (${placedBets.length})` },
            { id: 'PENDING', label: `Open (${pendingBets.length})` },
            { id: 'SETTLED', label: `Settled (${settledBets.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as 'ALL' | 'PENDING' | 'SETTLED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#121820] text-slate-400 hover:text-white border border-[#232f38]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* P&L Performance Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121820] border border-[#232f38]">
          <span className="text-slate-400 text-xs block mb-1">Total Demo Bets</span>
          <span className="font-mono text-xl font-bold text-white">{placedBets.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#121820] border border-[#232f38]">
          <span className="text-slate-400 text-xs block mb-1">Total Demo Staked</span>
          <span className="font-mono text-xl font-bold text-slate-200">
            {totalStaked.toLocaleString()} <span className="text-xs">pts</span>
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#121820] border border-[#232f38]">
          <span className="text-slate-400 text-xs block mb-1">Demo Returns Paid</span>
          <span className="font-mono text-xl font-bold text-emerald-400">
            {totalPayout.toLocaleString()} <span className="text-xs">pts</span>
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#121820] border border-[#232f38]">
          <span className="text-slate-400 text-xs block mb-1">Settled Net Demo P&L</span>
          <span
            className={`font-mono text-xl font-bold flex items-center gap-1 ${
              netDemoProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netDemoProfit >= 0 ? '+' : ''}
            {netDemoProfit.toLocaleString()} <span className="text-xs">pts</span>
          </span>
        </div>
      </div>

      {/* Bets List */}
      {filteredBets.length === 0 ? (
        <EmptyState
          title="No demo bets found"
          description="You haven't placed any simulated bets under this tab yet. Explore live and upcoming matches to make your first selection."
          actionText="Browse In-Play Matches"
          actionHref="/live"
        />
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="p-4 sm:p-5 rounded-xl bg-[#121820] border border-[#232f38] hover:border-slate-700 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {bet.matchTitle}
                  </span>
                  <span>•</span>
                  <span className="text-xs text-slate-500 font-mono">{bet.placedAt}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-white">
                    {bet.selection}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    @ {bet.odds.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">({bet.marketName})</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-300">
                  <span>Stake: <strong>{bet.stake.toLocaleString()} pts</strong></span>
                  <span>Est. Return: <strong>{bet.potentialPayout.toLocaleString()} pts</strong></span>
                  {bet.payoutAmount !== undefined && (
                    <span className="text-emerald-400 font-bold">
                      Settled Payout: {bet.payoutAmount.toLocaleString()} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                {bet.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      OPEN
                    </span>

                    {/* Simulation tools: Cashout & Settlement testers */}
                    <button
                      type="button"
                      onClick={() => cashOutBet(bet.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#182029] hover:bg-[#1f2935] text-amber-300 border border-[#263342] transition"
                      title="Simulate early cashout return"
                    >
                      Cashout ({(bet.stake * 0.88).toFixed(0)} pts)
                    </button>

                    <button
                      type="button"
                      onClick={() => settleBetSimulation(bet.id, 'WON')}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-950/40 hover:bg-emerald-800/40 text-emerald-400 border border-emerald-700/50 transition"
                      title="Simulate winning outcome"
                    >
                      Sim Won
                    </button>

                    <button
                      type="button"
                      onClick={() => settleBetSimulation(bet.id, 'LOST')}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-950/40 hover:bg-rose-800/40 text-rose-400 border border-rose-700/50 transition"
                      title="Simulate losing outcome"
                    >
                      Sim Lost
                    </button>
                  </div>
                ) : bet.status === 'WON' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    WON (+{((bet.payoutAmount || 0) - bet.stake).toLocaleString()} pts)
                  </span>
                ) : bet.status === 'CASHED_OUT' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <RotateCcw className="w-4 h-4" />
                    CASHED OUT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    <XCircle className="w-4 h-4" />
                    LOST (-{bet.stake.toLocaleString()} pts)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
