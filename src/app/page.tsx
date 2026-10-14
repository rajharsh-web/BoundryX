'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  CheckCircle2,
  Trophy,
  Coins,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchCard } from '@/components/cricket/MatchCard';
import { MatchStatusBadge } from '@/components/cricket/MatchStatusBadge';
import { TeamLogoPlaceholder } from '@/components/cricket/TeamLogoPlaceholder';
import { EmptyState } from '@/components/ui/EmptyState';

export default function HomePage() {
  const { matches, demoBalance, addBetToSlip } = useDemoBetting();
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    const matchesTab = activeTab === 'all' || m.status === activeTab;
    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    return matchesTab && matchesFormat;
  });

  const liveMatches = matches.filter((m) => m.status === 'live');
  const featuredLiveMatch = liveMatches[0] || matches[0];

  return (
    <div className="space-y-8">
      {/* Top Banner / Ticker Announcement */}
      <div className="bg-gradient-to-r from-[#121820] via-[#16202a] to-[#121820] border border-[#232f38] rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                SIMULATED CRICKET HUB
              </span>
              <span className="text-xs text-slate-400">
                Risk-Free Demo Wagering &amp; Live Analytics
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Cricket Scores &amp; Simulated Demo Markets
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track in-play ball-by-ball matches, review live win probabilities, and test your cricket predictions with free DEMO credits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Coins className="w-4 h-4" />
              View Demo Wallet
            </Link>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182029] hover:bg-[#1f2935] text-slate-200 border border-[#263342] font-semibold text-xs sm:text-sm transition"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-live-dot" />
              In-Play Center
            </Link>
          </div>
        </div>
      </div>

      {/* Featured In-Play Hero Showcase */}
      {featuredLiveMatch && (
        <section aria-labelledby="featured-match-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="featured-match-heading" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Featured In-Play Match
            </h2>
            <Link
              href={`/match/${featuredLiveMatch.id}`}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
            >
              Full Match Center
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#121820] border border-[#263342] rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              {/* Teams & Scores */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">{featuredLiveMatch.series}</span>
                  <span>•</span>
                  <span>{featuredLiveMatch.venue}, {featuredLiveMatch.city}</span>
                  <MatchStatusBadge status={featuredLiveMatch.status} size="sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Away Team */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#182029] border border-[#232f38]">
                    <div className="flex items-center gap-3">
                      <TeamLogoPlaceholder team={featuredLiveMatch.teamAway} size="md" />
                      <div>
                        <div className="font-bold text-white text-base">
                          {featuredLiveMatch.teamAway.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {featuredLiveMatch.teamAway.shortName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {featuredLiveMatch.scores.away[0] ? (
                        <div className="font-mono font-bold text-lg text-white">
                          {featuredLiveMatch.scores.away[0].runs}/{featuredLiveMatch.scores.away[0].wickets}
                          <span className="text-xs text-slate-400 block font-normal">
                            ({featuredLiveMatch.scores.away[0].overs} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Yet to bat</span>
                      )}
                    </div>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#182029] border border-[#232f38]">
                    <div className="flex items-center gap-3">
                      <TeamLogoPlaceholder team={featuredLiveMatch.teamHome} size="md" />
                      <div>
                        <div className="font-bold text-white text-base">
                          {featuredLiveMatch.teamHome.name}
                        </div>
                        <div className="text-xs text-emerald-400 font-semibold">
                          Batting Now
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {featuredLiveMatch.scores.home[0] ? (
                        <div className="font-mono font-bold text-lg text-white">
                          {featuredLiveMatch.scores.home[0].runs}/{featuredLiveMatch.scores.home[0].wickets}
                          <span className="text-xs text-slate-400 block font-normal">
                            ({featuredLiveMatch.scores.home[0].overs} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Yet to bat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Over summary & Recent balls */}
                {featuredLiveMatch.recentBalls && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0b0f14] border border-[#1c2632] text-xs">
                    <span className="text-emerald-400 font-semibold">
                      {featuredLiveMatch.statusText}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px] uppercase mr-1">This Over:</span>
                      {featuredLiveMatch.recentBalls.map((ball, idx) => (
                        <span
                          key={idx}
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                            ball === '4'
                              ? 'bg-blue-600 text-white'
                              : ball === '6'
                              ? 'bg-purple-600 text-white'
                              : ball === 'W'
                              ? 'bg-rose-600 text-white'
                              : 'bg-[#1e2935] text-slate-300'
                          }`}
                        >
                          {ball}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Win Probability & Quick Match Winner odds */}
              <div className="lg:w-72 bg-[#182029] p-4 rounded-xl border border-[#232f38] flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-300">Simulated Win Probability</span>
                    <span className="text-emerald-400 text-[10px] uppercase font-bold">DEMO AI</span>
                  </div>
                  {featuredLiveMatch.winProbability && (
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-full bg-[#121820] rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${featuredLiveMatch.winProbability.home}%` }}
                        />
                        <div
                          className="bg-amber-500 h-full transition-all duration-500"
                          style={{ width: `${featuredLiveMatch.winProbability.away}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>{featuredLiveMatch.teamHome.shortName} {featuredLiveMatch.winProbability.home}%</span>
                        <span>{featuredLiveMatch.teamAway.shortName} {featuredLiveMatch.winProbability.away}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Winner quick options */}
                {featuredLiveMatch.markets[0] && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      Quick Demo Wager (1X2)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {featuredLiveMatch.markets[0].options.slice(0, 2).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            addBetToSlip({
                              matchId: featuredLiveMatch.id,
                              matchTitle: `${featuredLiveMatch.teamHome.name} vs ${featuredLiveMatch.teamAway.name}`,
                              marketId: featuredLiveMatch.markets[0].id,
                              marketName: featuredLiveMatch.markets[0].name,
                              optionId: opt.id,
                              optionLabel: opt.label,
                              odds: opt.odds,
                            })
                          }
                          className="p-2 rounded-lg bg-[#121820] hover:bg-[#1f2935] border border-[#263342] text-center transition"
                        >
                          <span className="block text-xs font-medium text-slate-300 truncate">
                            {opt.label}
                          </span>
                          <span className="block text-sm font-mono font-bold text-emerald-400 mt-0.5">
                            {opt.odds.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Column & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Matches Column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs & Format Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#232f38]">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Matches' },
                { id: 'live', label: 'Live In-Play', count: liveMatches.length },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'completed', label: 'Results' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'all' | 'live' | 'upcoming' | 'completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#121820] text-slate-400 hover:text-white hover:bg-[#182029] border border-[#232f38]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-emerald-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Format:</span>
              {['ALL', 'T20', 'ODI', 'TEST'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    formatFilter === fmt
                      ? 'bg-[#1f2935] text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length === 0 ? (
            <EmptyState
              title="No matches found"
              description="No cricket matches match your selected filter. Switch tabs to see live or upcoming fixtures."
              actionText="Show All Matches"
              onAction={() => {
                setActiveTab('all');
                setFormatFilter('ALL');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column (1 col) */}
        <aside className="space-y-6">
          {/* Demo Credits Card */}
          <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1c2632]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Demo Credits Balance
              </span>
              <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Simulated
              </span>
            </div>

            <div className="my-2">
              <div className="font-mono text-2xl font-extrabold text-white">
                {demoBalance.toLocaleString()}
                <span className="text-xs font-sans text-emerald-400 ml-1.5 uppercase font-bold">
                  pts
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {demoBalance === 0
                  ? 'Your balance is 0. Contact an admin to receive a demo credit allocation.'
                  : 'Risk-free simulated credits for testing your cricket market calls.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1c2632] flex items-center gap-2">
              <Link
                href="/wallet"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center shadow-xs"
              >
                View Wallet
              </Link>
              <Link
                href="/demo-bets"
                className="py-2 px-3 rounded-lg bg-[#182029] hover:bg-[#1f2935] text-slate-300 border border-[#263342] font-semibold text-xs transition text-center"
              >
                My Bets
              </Link>
            </div>
          </div>

          {/* Quick Platform Highlights */}
          <div className="bg-[#121820] border border-[#232f38] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Platform Guarantees
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">100% Risk Free</strong>
                  <span className="text-slate-400">Zero monetary deposits or real-money payouts.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Simulated Dynamic Odds</strong>
                  <span className="text-slate-400">Odds calculate and adjust with live match swings.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Comprehensive Coverage</strong>
                  <span className="text-slate-400">T20 leagues, ODI series, and Test championships.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
