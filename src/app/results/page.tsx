'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchCard } from '@/components/cricket/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ResultsArchivePage() {
  const { matches } = useDemoBetting();
  const [formatFilter, setFormatFilter] = useState('ALL');

  const completedMatches = matches.filter((m) => {
    const isCompleted = m.status === 'completed';
    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    return isCompleted && matchesFormat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Results</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Match Results & Final Scores
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official match outcomes, margin of victory, and settled demo markets archive.
          </p>
        </div>

        {/* Format tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'T20', 'ODI', 'TEST'].map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormatFilter(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                formatFilter === fmt
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#121820] text-slate-300 hover:bg-[#182029] border border-[#232f38]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {completedMatches.length === 0 ? (
        <EmptyState
          title="No completed match records found"
          description="There are currently no finished matches matching your filter."
          icon={<CheckCircle2 className="w-7 h-7 text-emerald-400" />}
          actionText="View Live Matches"
          actionHref="/live"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {completedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
