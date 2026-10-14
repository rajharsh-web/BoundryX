'use client';

import React, { useState } from 'react';
import { CheckCircle2, Check } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export default function AdminSettlementsPage() {
  const { matches, updateMarketStatus, placedBets, settleBetSimulation } = useDemoBetting();
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [selectedWinnerOptionId, setSelectedWinnerOptionId] = useState<string>('');
  const [settledNotice, setSettledNotice] = useState<string | null>(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const winnerMarket = selectedMatch?.markets.find((m) => m.category === 'MATCH_WINNER');

  const handleSettle = () => {
    if (!selectedMatch || !winnerMarket || !selectedWinnerOptionId) return;

    // 1. Update market in state
    updateMarketStatus(selectedMatch.id, winnerMarket.id, 'SETTLED', selectedWinnerOptionId);

    // 2. Find any placed demo bets on this match
    const winnerOpt = winnerMarket.options.find((o) => o.id === selectedWinnerOptionId);
    if (winnerOpt) {
      placedBets.forEach((b) => {
        if (b.matchId === selectedMatch.id && b.status === 'PENDING') {
          if (b.selection === winnerOpt.label) {
            settleBetSimulation(b.id, 'WON');
          } else {
            settleBetSimulation(b.id, 'LOST');
          }
        }
      });
    }

    setSettledNotice(
      `Successfully settled market: declared "${winnerOpt?.label}" as the official winner!`
    );
    setTimeout(() => setSettledNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Market & Match Settlement Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Resolve finished matches, determine winning selections, and disburse simulated payouts.
          </p>
        </div>
      </div>

      {settledNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{settledNotice}</span>
        </div>
      )}

      {/* Match Picker */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block">
          Select Match to Settle
        </label>
        <select
          value={selectedMatchId}
          onChange={(e) => {
            setSelectedMatchId(e.target.value);
            setSelectedWinnerOptionId('');
          }}
          className="w-full bg-[#182029] border border-[#263342] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500"
        >
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.teamHome.name} vs {m.teamAway.name} ({m.format} - {m.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Settlement Execution Panel */}
      {selectedMatch && winnerMarket && (
        <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2632]">
            <div>
              <h3 className="text-sm font-bold text-white">
                Market: {winnerMarket.name}
              </h3>
              <span className="text-xs text-slate-400">
                Current Status: <strong>{winnerMarket.status}</strong>
              </span>
            </div>
            {winnerMarket.status === 'SETTLED' && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ALREADY SETTLED
              </span>
            )}
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Choose the Winning Outcome:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {winnerMarket.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedWinnerOptionId(opt.id)}
                  className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedWinnerOptionId === opt.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : opt.isWinner
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-[#182029] hover:bg-[#1f2935] border-[#263342] text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm block">{opt.label}</span>
                    <span className="text-xs opacity-80">Odds: {opt.odds.toFixed(2)}</span>
                  </div>
                  {opt.isWinner && (
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                      Confirmed Winner
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1c2632] flex items-center justify-end">
            <button
              type="button"
              disabled={!selectedWinnerOptionId}
              onClick={handleSettle}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Payout Simulated Bets</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
