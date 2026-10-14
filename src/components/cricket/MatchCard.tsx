'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { CricketMatch } from '@/types/cricket';
import { MatchStatusBadge } from './MatchStatusBadge';
import { TeamLogoPlaceholder } from './TeamLogoPlaceholder';
import { ScoreDisplay } from './ScoreDisplay';
import { WinProbabilityBar } from './WinProbabilityBar';
import { useDemoBetting } from '@/context/DemoBettingContext';

interface MatchCardProps {
  match: CricketMatch;
  compact?: boolean;
}

const BALL_COLOR: Record<string, string> = {
  '0': 'bg-[#1c2632] text-slate-400',
  '1': 'bg-[#1f2d3d] text-slate-300',
  '2': 'bg-[#1a2e22] text-emerald-400',
  '3': 'bg-[#1a2e22] text-emerald-300',
  '4': 'bg-emerald-600 text-white font-bold',
  '6': 'bg-amber-500 text-white font-bold',
  W: 'bg-rose-600 text-white font-bold',
  Wd: 'bg-amber-800 text-amber-200 text-[9px]',
  Nb: 'bg-amber-800 text-amber-200 text-[9px]',
};

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { addBetToSlip, betSlip } = useDemoBetting();

  const winnerMarket = match.markets.find((m) => m.category === 'MATCH_WINNER');

  const handleQuickBet = (e: React.MouseEvent, option: { id: string; label: string; odds: number }) => {
    e.preventDefault();
    e.stopPropagation();
    if (!winnerMarket) return;
    addBetToSlip({
      matchId: match.id,
      matchTitle: `${match.teamHome.name} vs ${match.teamAway.name}`,
      marketId: winnerMarket.id,
      marketName: winnerMarket.name,
      optionId: option.id,
      optionLabel: option.label,
      odds: option.odds,
    });
  };

  const isHomeBatting = match.status === 'live' && match.scores.home.some((s) => !s.isCompleted);
  const isAwayBatting = match.status === 'live' && match.scores.away.some((s) => !s.isCompleted);

  return (
    <div
      className={`group relative bg-[#121820] hover:bg-[#151d26] border rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-sm flex flex-col justify-between ${
        match.status === 'live'
          ? 'border-emerald-500/20 hover:border-emerald-500/35 shadow-emerald-900/10'
          : 'border-[#232f38] hover:border-slate-700/80'
      }`}
    >
      {/* Live glow effect */}
      {match.status === 'live' && (
        <div className="absolute inset-0 rounded-xl bg-emerald-500/3 pointer-events-none" />
      )}

      <div>
        {/* Header: Series & Match Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#1c2632]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#1c2632] text-slate-300 uppercase tracking-wide shrink-0">
              {match.format}
            </span>
            <span className="text-xs text-slate-400 truncate font-medium">{match.series}</span>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>

        {/* Teams and Scores */}
        <div className="space-y-3 mb-3">
          {/* Away Team */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <TeamLogoPlaceholder team={match.teamAway} size="sm" />
              <div className="min-w-0">
                <span
                  className={`text-sm font-semibold truncate block ${
                    isAwayBatting ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {match.teamAway.name}
                  {isAwayBatting && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-dot" />
                  )}
                </span>
              </div>
            </div>
            <ScoreDisplay scores={match.scores.away} isCurrentBatting={isAwayBatting} />
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <TeamLogoPlaceholder team={match.teamHome} size="sm" />
              <div className="min-w-0">
                <span
                  className={`text-sm font-semibold truncate block ${
                    isHomeBatting ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {match.teamHome.name}
                  {isHomeBatting && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-dot" />
                  )}
                </span>
              </div>
            </div>
            <ScoreDisplay scores={match.scores.home} isCurrentBatting={isHomeBatting} />
          </div>
        </div>

        {/* Status text */}
        <div className="bg-[#0b0f14]/60 rounded-lg p-2.5 text-xs text-slate-300 font-medium mb-2.5 flex items-center justify-between">
          <span className="truncate text-emerald-400/90 font-medium">{match.statusText}</span>
          {match.currentRunRate && (
            <span className="text-slate-400 text-[11px] font-mono ml-2 shrink-0">
              CRR: {match.currentRunRate.toFixed(1)}
            </span>
          )}
        </div>

        {/* Recent balls */}
        {match.recentBalls && match.recentBalls.length > 0 && match.status === 'live' && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold mr-0.5">This Over</span>
            {match.recentBalls.slice(-6).map((ball, i) => (
              <span
                key={i}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  BALL_COLOR[ball] || BALL_COLOR['0']
                }`}
              >
                {ball}
              </span>
            ))}
          </div>
        )}

        {/* Win Probability Bar */}
        {match.winProbability && match.status === 'live' && (
          <div className="mb-2.5">
            <WinProbabilityBar
              homeName={match.teamHome.shortName}
              awayName={match.teamAway.shortName}
              homeProb={match.winProbability.home}
              awayProb={match.winProbability.away}
              variant="compact"
            />
          </div>
        )}
      </div>

      {/* Footer / Quick Demo Odds and Details Link */}
      <div className="pt-2 border-t border-[#1c2632] space-y-2.5">
        {winnerMarket && winnerMarket.options.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              DEMO 1X2
            </span>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {winnerMarket.options.slice(0, 2).map((opt) => {
                const isSelectedInSlip = betSlip.some(
                  (b) => b.matchId === match.id && b.optionId === opt.id
                );
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={(e) => handleQuickBet(e, opt)}
                    aria-label={`Demo bet on ${opt.label} at odds ${opt.odds.toFixed(2)}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition active:scale-95 ${
                      isSelectedInSlip
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-[#182029] hover:bg-[#1f2935] text-slate-200 border-[#263342] hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate max-w-[70px]">{opt.label}</span>
                    <span className="font-mono font-bold text-emerald-400 ml-1">
                      {opt.odds.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="truncate text-[11px] text-slate-400">
            {match.venue}, {match.city}
          </span>
          <Link
            href={`/match/${match.id}`}
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium text-xs ml-2 shrink-0 group-hover:translate-x-0.5 transition-transform"
          >
            Match Center
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};


