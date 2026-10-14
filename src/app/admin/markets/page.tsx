'use client';

import React, { useState } from 'react';
import { TrendingUp, Lock, Unlock, Check } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export default function AdminMarketsPage() {
  const { matches, updateMarketStatus } = useDemoBetting();
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleMarketSuspension = (matchId: string, marketId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'OPEN' : 'SUSPENDED';
    updateMarketStatus(matchId, marketId, nextStatus);
    setFeedback(`Market ${marketId} status changed to ${nextStatus}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Markets & Simulated Odds Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Suspend betting markets during DRS reviews or adjust simulated risk exposure.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Markets grouped by match */}
      <div className="space-y-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-5 rounded-2xl bg-[#121820] border border-[#232f38] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2632]">
              <div>
                <span className="font-bold text-white text-sm">
                  {match.teamHome.name} vs {match.teamAway.name}
                </span>
                <span className="text-xs text-slate-400 ml-2">({match.series})</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {match.markets.length} Markets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.markets.map((mkt) => {
                const isSuspended = mkt.status === 'SUSPENDED';

                return (
                  <div
                    key={mkt.id}
                    className="p-4 rounded-xl bg-[#182029] border border-[#263342] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">
                        {mkt.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleMarketSuspension(match.id, mkt.id, mkt.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          isSuspended
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>SUSPENDED</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>OPEN</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {mkt.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="p-2 rounded-lg bg-[#121820] border border-[#232f38] flex justify-between items-center"
                        >
                          <span className="text-slate-300 truncate max-w-[100px]">
                            {opt.label}
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {opt.odds.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
