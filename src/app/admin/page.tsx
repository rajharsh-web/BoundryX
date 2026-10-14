'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Users,
  TrendingUp,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { mockAdminUsers, mockAuditLogs } from '@/mock/cricketData';

export default function AdminOverviewPage() {
  const { matches, placedBets } = useDemoBetting();

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const totalMarkets = matches.reduce((sum, m) => sum + m.markets.length, 0);
  const totalVolume = placedBets.reduce((sum, b) => sum + b.stake, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121820] border border-[#232f38] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Matches</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {liveCount} <span className="text-xs font-normal text-emerald-400">Live</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {upcomingCount} upcoming fixtures
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121820] border border-[#232f38] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Demo Wagering Vol</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {totalVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            100% Simulated Credits
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121820] border border-[#232f38] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Markets</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {totalMarkets}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {matches.length} matches
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121820] border border-[#232f38] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Simulated Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-extrabold text-white">
            {mockAdminUsers.length}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
            100% Accounts Active
          </span>
        </div>
      </div>

      {/* Quick Action Control Hub */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Quick Operations Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/settlements"
            className="p-4 rounded-xl bg-[#182029] hover:bg-[#1f2935] border border-[#263342] text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-sm text-white block group-hover:text-emerald-300">
                Settle Finished Matches
              </span>
              <span className="text-xs text-slate-400">
                Declare winners & pay demo bets
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/matches"
            className="p-4 rounded-xl bg-[#182029] hover:bg-[#1f2935] border border-[#263342] text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-sm text-white block group-hover:text-emerald-300">
                Match Scores & Status
              </span>
              <span className="text-xs text-slate-400">
                Update overs, wickets & status
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/markets"
            className="p-4 rounded-xl bg-[#182029] hover:bg-[#1f2935] border border-[#263342] text-left transition flex items-center justify-between group"
          >
            <div>
              <span className="font-bold text-sm text-white block group-hover:text-emerald-300">
                Odds & Market Controls
              </span>
              <span className="text-xs text-slate-400">
                Suspend markets & tune odds
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Admin Audit Activity Feed */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2632]">
          <h3 className="text-sm font-bold text-white">
            Recent Admin Activity Feed
          </h3>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            View All Logs
          </Link>
        </div>

        <div className="divide-y divide-[#1c2632]">
          {mockAuditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{log.target}</span>
                </div>
                <p className="text-slate-400">{log.details}</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px] shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
