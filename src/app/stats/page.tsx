'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart2, Trophy, Target, TrendingUp, Medal } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

type LeaderboardTab = 'batting' | 'bowling' | 'standings';

export default function StatsPage() {
  const { matches } = useDemoBetting();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('batting');

  // Aggregate batting stats across all completed/live innings
  const battingMap = new Map<
    string,
    { name: string; team: string; runs: number; balls: number; fours: number; sixes: number; innings: number; highScore: number }
  >();

  const bowlingMap = new Map<
    string,
    { name: string; team: string; wickets: number; runs: number; overs: number; innings: number; bestWickets: number; bestRuns: number }
  >();

  const teamWins = new Map<string, { name: string; won: number; lost: number; played: number }>();

  for (const match of matches) {
    // Results for standings
    if (match.status === 'completed' && match.result) {
      const home = match.teamHome.name;
      const away = match.teamAway.name;
      if (!teamWins.has(home)) teamWins.set(home, { name: home, won: 0, lost: 0, played: 0 });
      if (!teamWins.has(away)) teamWins.set(away, { name: away, won: 0, lost: 0, played: 0 });
      const homeEntry = teamWins.get(home)!;
      const awayEntry = teamWins.get(away)!;
      homeEntry.played++;
      awayEntry.played++;
      if (match.result.winner === match.teamHome.id) {
        homeEntry.won++;
        awayEntry.lost++;
      } else if (match.result.winner === match.teamAway.id) {
        awayEntry.won++;
        homeEntry.lost++;
      }
    }

    // Batting stats from scorecards
    const processInnings = (inningsData: typeof match.scorecards?.innings1, teamName: string) => {
      if (!inningsData) return;
      for (const batter of inningsData.batting) {
        const key = batter.name;
        if (!battingMap.has(key)) {
          battingMap.set(key, { name: batter.name, team: teamName, runs: 0, balls: 0, fours: 0, sixes: 0, innings: 0, highScore: 0 });
        }
        const entry = battingMap.get(key)!;
        entry.runs += batter.runs;
        entry.balls += batter.balls;
        entry.fours += batter.fours;
        entry.sixes += batter.sixes;
        entry.innings++;
        entry.highScore = Math.max(entry.highScore, batter.runs);
      }
      for (const bowler of inningsData.bowling) {
        const key = bowler.name;
        if (!bowlingMap.has(key)) {
          bowlingMap.set(key, { name: bowler.name, team: teamName, wickets: 0, runs: 0, overs: 0, innings: 0, bestWickets: 0, bestRuns: 999 });
        }
        const entry = bowlingMap.get(key)!;
        entry.wickets += bowler.wickets;
        entry.runs += bowler.runs;
        entry.overs += bowler.overs;
        entry.innings++;
        if (bowler.wickets > entry.bestWickets || (bowler.wickets === entry.bestWickets && bowler.runs < entry.bestRuns)) {
          entry.bestWickets = bowler.wickets;
          entry.bestRuns = bowler.runs;
        }
      }
    };

    if (match.scorecards) {
      processInnings(match.scorecards.innings1, match.teamAway.name);
      processInnings(match.scorecards.innings2, match.teamHome.name);
    }
  }

  const topBatsmen = Array.from(battingMap.values())
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 10);

  const topBowlers = Array.from(bowlingMap.values())
    .sort((a, b) => b.wickets - a.wickets || (a.runs / Math.max(a.overs, 0.1)) - (b.runs / Math.max(b.overs, 0.1)))
    .slice(0, 10);

  const standings = Array.from(teamWins.values())
    .sort((a, b) => b.won - a.won || a.lost - b.lost);

  const tabs: { id: LeaderboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'batting', label: 'Top Batsmen', icon: <Trophy className="w-4 h-4" /> },
    { id: 'bowling', label: 'Top Bowlers', icon: <Target className="w-4 h-4" /> },
    { id: 'standings', label: 'Team Standings', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#232f38]">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <span className="text-white">Statistics</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-emerald-400" />
          Cricket Statistics &amp; Leaderboards
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulated performance rankings aggregated from demo match data across all formats.
        </p>
      </div>

      {/* DEMO Notice */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-300 text-xs">
        <TrendingUp className="w-4 h-4 shrink-0" />
        <span>
          <strong>DEMO DATA:</strong> All statistics are fictional and simulated for demonstration purposes only.
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#121820] border border-[#232f38]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1f2935]'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Batting Leaderboard */}
      {activeTab === 'batting' && (
        <div className="bg-[#121820] border border-[#232f38] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1c2632] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Top Run Scorers (DEMO)</span>
          </div>
          {topBatsmen.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">No batting data available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[520px]">
                <thead>
                  <tr className="bg-[#0f1720] border-b border-[#1c2632] text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5 w-8">#</th>
                    <th className="text-left px-3 py-2.5">Player</th>
                    <th className="text-center px-2 py-2.5">Inn</th>
                    <th className="text-center px-2 py-2.5 font-bold text-slate-400">Runs</th>
                    <th className="text-center px-2 py-2.5">HS</th>
                    <th className="text-center px-2 py-2.5">4s</th>
                    <th className="text-center px-2 py-2.5">6s</th>
                    <th className="text-center px-2 py-2.5">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2632]">
                  {topBatsmen.map((b, i) => {
                    const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '—';
                    return (
                      <tr key={b.name} className="hover:bg-[#182029] transition-colors">
                        <td className="px-4 py-2.5">
                          {i === 0 ? (
                            <Medal className="w-4 h-4 text-amber-400" />
                          ) : i === 1 ? (
                            <Medal className="w-4 h-4 text-slate-300" />
                          ) : i === 2 ? (
                            <Medal className="w-4 h-4 text-amber-600" />
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">{i + 1}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-slate-200">{b.name}</span>
                          <span className="ml-2 text-[10px] text-slate-500">{b.team}</span>
                        </td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-400">{b.innings}</td>
                        <td className="px-2 py-2.5 text-center font-mono font-bold text-emerald-300 text-sm">{b.runs}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.highScore}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.fours}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.sixes}</td>
                        <td className={`px-2 py-2.5 text-center font-mono font-semibold ${
                          parseFloat(sr) >= 150 ? 'text-emerald-400' : parseFloat(sr) >= 100 ? 'text-slate-300' : 'text-rose-400'
                        }`}>{sr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bowling Leaderboard */}
      {activeTab === 'bowling' && (
        <div className="bg-[#121820] border border-[#232f38] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1c2632] flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Top Wicket Takers (DEMO)</span>
          </div>
          {topBowlers.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">No bowling data available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="bg-[#0f1720] border-b border-[#1c2632] text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5 w-8">#</th>
                    <th className="text-left px-3 py-2.5">Bowler</th>
                    <th className="text-center px-2 py-2.5">Inn</th>
                    <th className="text-center px-2 py-2.5 font-bold text-slate-400">Wkts</th>
                    <th className="text-center px-2 py-2.5">Runs</th>
                    <th className="text-center px-2 py-2.5">Overs</th>
                    <th className="text-center px-2 py-2.5">Best</th>
                    <th className="text-center px-2 py-2.5">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2632]">
                  {topBowlers.map((b, i) => {
                    const avg = b.wickets > 0 ? (b.runs / b.wickets).toFixed(1) : '—';
                    return (
                      <tr key={b.name} className="hover:bg-[#182029] transition-colors">
                        <td className="px-4 py-2.5">
                          {i === 0 ? (
                            <Medal className="w-4 h-4 text-amber-400" />
                          ) : i === 1 ? (
                            <Medal className="w-4 h-4 text-slate-300" />
                          ) : i === 2 ? (
                            <Medal className="w-4 h-4 text-amber-600" />
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">{i + 1}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-slate-200">{b.name}</span>
                          <span className="ml-2 text-[10px] text-slate-500">{b.team}</span>
                        </td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-400">{b.innings}</td>
                        <td className="px-2 py-2.5 text-center font-mono font-bold text-emerald-300 text-sm">{b.wickets}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.runs}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.overs.toFixed(1)}</td>
                        <td className="px-2 py-2.5 text-center font-mono font-semibold text-sky-400">
                          {b.bestWickets}/{b.bestRuns === 999 ? '—' : b.bestRuns}
                        </td>
                        <td className={`px-2 py-2.5 text-center font-mono font-semibold ${
                          parseFloat(avg) <= 20 ? 'text-emerald-400' : parseFloat(avg) <= 35 ? 'text-slate-300' : 'text-rose-400'
                        }`}>{avg}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Team Standings */}
      {activeTab === 'standings' && (
        <div className="bg-[#121820] border border-[#232f38] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1c2632] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Team Performance (DEMO)</span>
          </div>
          {standings.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              No completed matches yet. Check back after matches are settled.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[380px]">
                <thead>
                  <tr className="bg-[#0f1720] border-b border-[#1c2632] text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5 w-8">#</th>
                    <th className="text-left px-3 py-2.5">Team</th>
                    <th className="text-center px-3 py-2.5">P</th>
                    <th className="text-center px-3 py-2.5 text-emerald-400">W</th>
                    <th className="text-center px-3 py-2.5 text-rose-400">L</th>
                    <th className="text-center px-3 py-2.5">Win %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2632]">
                  {standings.map((t, i) => {
                    const winPct = t.played > 0 ? Math.round((t.won / t.played) * 100) : 0;
                    return (
                      <tr key={t.name} className="hover:bg-[#182029] transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-500">{i + 1}</td>
                        <td className="px-3 py-3 font-bold text-slate-200">{t.name}</td>
                        <td className="px-3 py-3 text-center font-mono text-slate-400">{t.played}</td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-emerald-400">{t.won}</td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-rose-400">{t.lost}</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[#1c2632] overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${winPct}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-300 w-8 text-right">{winPct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
