'use client';

import React from 'react';
import { Lock, Check } from 'lucide-react';
import { BettingMarket } from '@/types/cricket';
import { useDemoBetting } from '@/context/DemoBettingContext';

interface MarketCardProps {
  market: BettingMarket;
  matchTitle: string;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, matchTitle }) => {
  const { addBetToSlip, removeBetFromSlip, betSlip } = useDemoBetting();

  const isSuspended = market.status === 'SUSPENDED';

  const toggleOption = (option: { id: string; label: string; odds: number }) => {
    if (isSuspended) return;

    const existingInSlip = betSlip.find(
      (b) => b.matchId === market.matchId && b.marketId === market.id && b.optionId === option.id
    );

    if (existingInSlip) {
      removeBetFromSlip(existingInSlip.id);
    } else {
      addBetToSlip({
        matchId: market.matchId,
        matchTitle,
        marketId: market.id,
        marketName: market.name,
        optionId: option.id,
        optionLabel: option.label,
        odds: option.odds,
      });
    }
  };

  return (
    <div className="bg-[#121820] border border-[#232f38] rounded-xl p-4 sm:p-5 transition shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1c2632]">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white tracking-tight">
            {market.name}
          </h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            DEMO
          </span>
        </div>
        {isSuspended ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Lock className="w-3 h-3" />
            SUSPENDED
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            {market.options.length} Selections
          </span>
        )}
      </div>

      {market.description && (
        <p className="text-xs text-slate-400 mb-3">{market.description}</p>
      )}

      {/* Grid of Options */}
      <div
        className={`grid gap-2.5 ${
          market.options.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : market.options.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {market.options.map((opt) => {
          const isSelected = betSlip.some(
            (b) => b.matchId === market.matchId && b.marketId === market.id && b.optionId === opt.id
          );

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isSuspended}
              onClick={() => toggleOption(opt)}
              aria-pressed={isSelected}
              className={`flex items-center justify-between p-3 rounded-lg border text-xs sm:text-sm font-medium transition duration-150 ${
                isSuspended
                  ? 'bg-[#182029]/50 text-slate-500 border-[#263342] cursor-not-allowed'
                  : isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-[#182029] hover:bg-[#1f2935] text-slate-200 border-[#263342] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                <span className="truncate">{opt.label}</span>
              </div>
              <span
                className={`font-mono font-bold shrink-0 ${
                  isSelected ? 'text-white' : 'text-emerald-400'
                }`}
              >
                {opt.odds.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
