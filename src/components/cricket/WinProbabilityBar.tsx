'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface WinProbabilityBarProps {
  homeName: string;
  awayName: string;
  homeProb: number;
  awayProb: number;
  variant?: 'compact' | 'full';
}

export const WinProbabilityBar: React.FC<WinProbabilityBarProps> = ({
  homeName,
  awayName,
  homeProb,
  awayProb,
  variant = 'compact',
}) => {
  const total = homeProb + awayProb;
  const homeWidth = total > 0 ? Math.round((homeProb / total) * 100) : 50;
  const awayWidth = 100 - homeWidth;

  if (variant === 'full') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Win Probability (DEMO)
          </span>
        </div>

        <div className="space-y-2">
          {/* Progress bar */}
          <div className="relative h-5 rounded-full overflow-hidden bg-[#1c2632] flex">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-1000 ease-out flex items-center justify-center"
              style={{ width: `${awayWidth}%` }}
            >
              {awayWidth > 15 && (
                <span className="text-[10px] font-bold text-white">{awayWidth}%</span>
              )}
            </div>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 ease-out flex items-center justify-center"
              style={{ width: `${homeWidth}%` }}
            >
              {homeWidth > 15 && (
                <span className="text-[10px] font-bold text-white">{homeWidth}%</span>
              )}
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 block" />
              <span className="text-slate-300 font-medium">{awayName}</span>
              <span className="font-mono font-bold text-sky-400">{awayWidth}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-emerald-400">{homeWidth}%</span>
              <span className="text-slate-300 font-medium">{homeName}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for match cards
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="text-slate-500 w-7 text-right font-mono">{awayWidth}%</span>
      <div className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-[#1c2632] flex">
        <div
          className="h-full bg-sky-500/70 transition-all duration-700"
          style={{ width: `${awayWidth}%` }}
        />
        <div
          className="h-full bg-emerald-500/70 transition-all duration-700"
          style={{ width: `${homeWidth}%` }}
        />
      </div>
      <span className="text-slate-500 w-7 font-mono">{homeWidth}%</span>
    </div>
  );
};
