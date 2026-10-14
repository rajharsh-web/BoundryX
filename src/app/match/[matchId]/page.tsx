'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Radio,
  MapPin,
  TrendingUp,
  FileText,
  Info,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchStatusBadge } from '@/components/cricket/MatchStatusBadge';
import { TeamLogoPlaceholder } from '@/components/cricket/TeamLogoPlaceholder';
import { ScoreDisplay } from '@/components/cricket/ScoreDisplay';
import { MarketCard } from '@/components/betting/MarketCard';
import { EmptyState } from '@/components/ui/EmptyState';

function MatchDetailPageContent() {
  const params = useParams();
  const matchId = params?.matchId as string;
  const { matches } = useDemoBetting();

  const match = matches.find((m) => m.id === matchId);
  const [activeTab, setActiveTab] = useState<'markets' | 'commentary' | 'scorecard' | 'info'>('markets');

  if (!match) {
    return (
      <div className="py-12">
        <EmptyState
          title="Match Not Found"
          description={`We could not locate the cricket fixture with ID "${matchId}". It may have expired or was removed.`}
          actionText="Browse All Cricket Matches"
          actionHref="/cricket"
        />
      </div>
    );
  }

  const matchTitle = `${match.teamHome.name} vs ${match.teamAway.name}`;

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link
          href="/cricket"
          className="inline-flex items-center gap-1 hover:text-emerald-400 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cricket
        </Link>
        <span>/</span>
        <span className="text-slate-300 truncate">{match.series}</span>
        <span>/</span>
        <span className="text-white truncate font-medium">{matchTitle}</span>
      </div>

      {/* Hero Match Center Scoreboard */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Top match meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c2632]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#1c2632] text-slate-300">
              {match.format}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              {match.series}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1 hidden sm:flex">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {match.venue}, {match.city}
            </span>
            <MatchStatusBadge status={match.status} />
          </div>
        </div>

        {/* Big Teams Score Row */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Away Team */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#182029] border border-[#232f38]">
            <div className="flex items-center gap-3 sm:gap-4">
              <TeamLogoPlaceholder team={match.teamAway} size="lg" />
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-white">
                  {match.teamAway.name}
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {match.teamAway.shortName}
                </span>
              </div>
            </div>
            <ScoreDisplay scores={match.scores.away} className="text-right" />
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#182029] border border-[#232f38]">
            <div className="flex items-center gap-3 sm:gap-4">
              <TeamLogoPlaceholder team={match.teamHome} size="lg" />
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-white">
                  {match.teamHome.name}
                </h2>
                <span className="text-xs text-emerald-400 font-medium">
                  {match.teamHome.shortName}
                </span>
              </div>
            </div>
            <ScoreDisplay scores={match.scores.home} className="text-right" />
          </div>
        </div>

        {/* Live Match Situation Bar */}
        <div className="p-3.5 rounded-xl bg-[#0b0f14] border border-[#1c2632] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-dot" />
            <span className="font-semibold text-emerald-400 text-sm">
              {match.statusText}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
            {match.currentRunRate && (
              <span>CRR: <strong className="text-white">{match.currentRunRate.toFixed(2)}</strong></span>
            )}
            {match.requiredRunRate && (
              <span>RRR: <strong className="text-emerald-400">{match.requiredRunRate.toFixed(2)}</strong></span>
            )}
            {match.target && (
              <span>Target: <strong className="text-white">{match.target}</strong></span>
            )}
          </div>
        </div>

        {/* Batters at crease & Current Bowler (if available) */}
        {match.batsmenAtCrease && match.batsmenAtCrease.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1c2632] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Batters */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                Batters at Crease
              </span>
              {match.batsmenAtCrease.map((b, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-200">
                  <span className="font-medium">
                    {b.name} {b.onStrike && <strong className="text-emerald-400">*</strong>}
                  </span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{b.runs}</strong> ({b.balls}) • {b.fours}x4, {b.sixes}x6
                  </span>
                </div>
              ))}
            </div>

            {/* Bowler */}
            {match.currentBowler && (
              <div className="space-y-1.5 sm:border-l sm:border-[#1c2632] sm:pl-4">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Current Bowler
                </span>
                <div className="flex justify-between items-center text-slate-200">
                  <span className="font-medium">{match.currentBowler.name}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{match.currentBowler.wickets}/{match.currentBowler.runs}</strong> in {match.currentBowler.overs} ov
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232f38] overflow-x-auto pb-1">
        {[
          { id: 'markets', label: `Demo Markets (${match.markets.length})`, icon: TrendingUp },
          { id: 'commentary', label: 'Live Commentary', icon: Radio },
          { id: 'scorecard', label: 'Full Scorecard', icon: FileText },
          { id: 'info', label: 'Match Info', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'markets' | 'commentary' | 'scorecard' | 'info')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-[#121820]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Demo Markets */}
      {activeTab === 'markets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold text-slate-300">
              Interactive Simulated Cricket Odds
            </span>
            <span className="text-emerald-400 font-bold uppercase tracking-wide">
              100% Risk Free Demo Wagering
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {match.markets.map((market) => (
              <MarketCard key={market.id} market={market} matchTitle={matchTitle} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Live Commentary */}
      {activeTab === 'commentary' && (
        <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-live-dot" />
            Ball-by-Ball Live Commentary Stream
          </h3>

          {match.commentary && match.commentary.length > 0 ? (
            <div className="divide-y divide-[#1c2632] space-y-3">
              {match.commentary.map((c) => (
                <div key={c.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  <div className="w-12 text-center shrink-0">
                    <span className="font-mono font-bold text-xs text-emerald-400 block">
                      {c.over}.{c.ball}
                    </span>
                    <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {c.isBoundary && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {c.boundaryType}
                        </span>
                      )}
                      {c.isWicket && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          WICKET
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-200">
                        {c.bowler} to {c.batsman}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {c.commentaryText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">
              Commentary feed is initializing for this match. Check back as overs progress.
            </p>
          )}
        </div>
      )}

      {/* Tab 3: Full Scorecard */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          {match.scorecards ? (
            <>
              {/* Innings 1 */}
              <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  1st Innings: {match.scorecards.innings1.teamName}
                </h3>

                {/* Batting table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#232f38] text-slate-400 font-semibold">
                        <th className="pb-2">Batter</th>
                        <th className="pb-2">Dismissal</th>
                        <th className="pb-2 text-right">R</th>
                        <th className="pb-2 text-right">B</th>
                        <th className="pb-2 text-right">4s</th>
                        <th className="pb-2 text-right">6s</th>
                        <th className="pb-2 text-right">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c2632]">
                      {match.scorecards.innings1.batting.map((p, i) => (
                        <tr key={i} className="text-slate-300">
                          <td className="py-2.5 font-medium text-white">{p.name}</td>
                          <td className="py-2.5 text-slate-400">{p.dismissal}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-white">{p.runs}</td>
                          <td className="py-2.5 text-right font-mono">{p.balls}</td>
                          <td className="py-2.5 text-right font-mono">{p.fours}</td>
                          <td className="py-2.5 text-right font-mono">{p.sixes}</td>
                          <td className="py-2.5 text-right font-mono text-emerald-400">{p.strikeRate.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bowling table */}
                <div className="overflow-x-auto pt-3 border-t border-[#1c2632]">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">Bowling</h4>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#232f38] text-slate-400 font-semibold">
                        <th className="pb-2">Bowler</th>
                        <th className="pb-2 text-right">O</th>
                        <th className="pb-2 text-right">M</th>
                        <th className="pb-2 text-right">R</th>
                        <th className="pb-2 text-right">W</th>
                        <th className="pb-2 text-right">ECON</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c2632]">
                      {match.scorecards.innings1.bowling.map((b, i) => (
                        <tr key={i} className="text-slate-300">
                          <td className="py-2 font-medium text-white">{b.name}</td>
                          <td className="py-2 text-right font-mono">{b.overs}</td>
                          <td className="py-2 text-right font-mono">{b.maidens}</td>
                          <td className="py-2 text-right font-mono">{b.runs}</td>
                          <td className="py-2 text-right font-mono font-bold text-emerald-400">{b.wickets}</td>
                          <td className="py-2 text-right font-mono">{b.economy.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Innings 2 (if present) */}
              {match.scorecards.innings2 && (
                <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    2nd Innings: {match.scorecards.innings2.teamName}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[#232f38] text-slate-400 font-semibold">
                          <th className="pb-2">Batter</th>
                          <th className="pb-2">Dismissal</th>
                          <th className="pb-2 text-right">R</th>
                          <th className="pb-2 text-right">B</th>
                          <th className="pb-2 text-right">4s</th>
                          <th className="pb-2 text-right">6s</th>
                          <th className="pb-2 text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c2632]">
                        {match.scorecards.innings2.batting.map((p, i) => (
                          <tr key={i} className="text-slate-300">
                            <td className="py-2.5 font-medium text-white">{p.name}</td>
                            <td className="py-2.5 text-slate-400">{p.dismissal}</td>
                            <td className="py-2.5 text-right font-mono font-bold text-white">{p.runs}</td>
                            <td className="py-2.5 text-right font-mono">{p.balls}</td>
                            <td className="py-2.5 text-right font-mono">{p.fours}</td>
                            <td className="py-2.5 text-right font-mono">{p.sixes}</td>
                            <td className="py-2.5 text-right font-mono text-emerald-400">{p.strikeRate.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#121820] border border-[#232f38] rounded-xl p-6 text-center text-slate-400 text-xs">
              Scorecard will become active once match play commences.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Match Info */}
      {activeTab === 'info' && (
        <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Fixture Details & Venue</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#182029]">
              <dt className="text-slate-400 mb-1">Tournament / Series</dt>
              <dd className="font-semibold text-white">{match.series}</dd>
            </div>
            <div className="p-3 rounded-lg bg-[#182029]">
              <dt className="text-slate-400 mb-1">Match Format</dt>
              <dd className="font-semibold text-white">{match.format}</dd>
            </div>
            <div className="p-3 rounded-lg bg-[#182029]">
              <dt className="text-slate-400 mb-1">Venue & City</dt>
              <dd className="font-semibold text-white">{match.venue}, {match.city}</dd>
            </div>
            <div className="p-3 rounded-lg bg-[#182029]">
              <dt className="text-slate-400 mb-1">Toss Information</dt>
              <dd className="font-semibold text-white">
                {match.tossWinner ? `${match.tossWinner} won the toss and elected to ${match.tossDecision}` : 'Toss not yet conducted'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default function MatchDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Loading Cricket Match Center...</p>
        </div>
      }
    >
      <MatchDetailPageContent />
    </Suspense>
  );
}

