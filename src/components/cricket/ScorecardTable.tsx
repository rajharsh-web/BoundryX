'use client';

import React from 'react';
import { PlayerScorecard, BowlerScorecard } from '@/types/cricket';

interface BattingTableProps {
  teamName: string;
  batting: PlayerScorecard[];
  totalRuns?: number;
  totalWickets?: number;
  totalOvers?: number;
}

export const BattingTable: React.FC<BattingTableProps> = ({
  teamName,
  batting,
  totalRuns,
  totalWickets,
  totalOvers,
}) => (
  <div className="overflow-x-auto rounded-xl border border-[#1c2632]">
    <table className="w-full text-xs min-w-[480px]">
      <thead>
        <tr className="bg-[#182029] border-b border-[#1c2632]">
          <th
            colSpan={7}
            className="text-left px-3 py-2.5 text-slate-300 font-bold text-[11px] uppercase tracking-wider"
          >
            🏏 {teamName} Batting
          </th>
        </tr>
        <tr className="bg-[#121820] border-b border-[#1c2632] text-[10px] text-slate-500 uppercase tracking-wider">
          <th className="text-left px-3 py-2 font-semibold">Batter</th>
          <th className="text-center px-2 py-2 font-semibold">Dismissal</th>
          <th className="text-center px-2 py-2 font-semibold">R</th>
          <th className="text-center px-2 py-2 font-semibold">B</th>
          <th className="text-center px-2 py-2 font-semibold">4s</th>
          <th className="text-center px-2 py-2 font-semibold">6s</th>
          <th className="text-center px-2 py-2 font-semibold">SR</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1c2632]">
        {batting.map((b, i) => (
          <tr
            key={i}
            className={`transition-colors ${
              b.isNotOut ? 'bg-emerald-950/10 hover:bg-emerald-950/20' : 'hover:bg-[#182029]'
            }`}
          >
            <td className="px-3 py-2.5">
              <span
                className={`font-semibold ${b.isNotOut ? 'text-emerald-300' : 'text-slate-200'}`}
              >
                {b.name}
              </span>
              {b.isNotOut && (
                <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                  NOT OUT
                </span>
              )}
            </td>
            <td className="px-2 py-2.5 text-slate-400 text-center text-[10px] max-w-[120px] truncate">
              {b.dismissal}
            </td>
            <td className="px-2 py-2.5 text-center font-mono font-bold text-white">{b.runs}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.balls}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.fours}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.sixes}</td>
            <td
              className={`px-2 py-2.5 text-center font-mono font-semibold ${
                b.strikeRate >= 150
                  ? 'text-emerald-400'
                  : b.strikeRate >= 100
                  ? 'text-slate-300'
                  : 'text-rose-400'
              }`}
            >
              {b.strikeRate.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      {(totalRuns !== undefined) && (
        <tfoot>
          <tr className="bg-[#182029] border-t border-[#1c2632]">
            <td colSpan={2} className="px-3 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              Total
            </td>
            <td colSpan={5} className="px-2 py-2 font-mono font-bold text-white text-sm">
              {totalRuns}/{totalWickets}{' '}
              <span className="text-xs text-slate-400 font-normal">({totalOvers} ov)</span>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  </div>
);

interface BowlingTableProps {
  bowlers: BowlerScorecard[];
  label?: string;
}

export const BowlingTable: React.FC<BowlingTableProps> = ({ bowlers, label = 'Bowling' }) => (
  <div className="overflow-x-auto rounded-xl border border-[#1c2632]">
    <table className="w-full text-xs min-w-[400px]">
      <thead>
        <tr className="bg-[#182029] border-b border-[#1c2632]">
          <th
            colSpan={6}
            className="text-left px-3 py-2.5 text-slate-300 font-bold text-[11px] uppercase tracking-wider"
          >
            🎯 {label}
          </th>
        </tr>
        <tr className="bg-[#121820] border-b border-[#1c2632] text-[10px] text-slate-500 uppercase tracking-wider">
          <th className="text-left px-3 py-2 font-semibold">Bowler</th>
          <th className="text-center px-2 py-2 font-semibold">O</th>
          <th className="text-center px-2 py-2 font-semibold">M</th>
          <th className="text-center px-2 py-2 font-semibold">R</th>
          <th className="text-center px-2 py-2 font-semibold">W</th>
          <th className="text-center px-2 py-2 font-semibold">Econ</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1c2632]">
        {bowlers.map((b, i) => (
          <tr key={i} className="hover:bg-[#182029] transition-colors">
            <td className="px-3 py-2.5 font-semibold text-slate-200">{b.name}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.overs}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.maidens}</td>
            <td className="px-2 py-2.5 text-center font-mono text-slate-300">{b.runs}</td>
            <td
              className={`px-2 py-2.5 text-center font-mono font-bold ${
                b.wickets >= 3 ? 'text-emerald-400' : b.wickets > 0 ? 'text-slate-200' : 'text-slate-500'
              }`}
            >
              {b.wickets}
            </td>
            <td
              className={`px-2 py-2.5 text-center font-mono font-semibold ${
                b.economy <= 7 ? 'text-emerald-400' : b.economy <= 10 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {b.economy.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
