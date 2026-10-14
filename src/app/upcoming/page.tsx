'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchCard } from '@/components/cricket/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function UpcomingMatchesPage() {
  const { matches } = useDemoBetting();
  const [formatFilter, setFormatFilter] = useState('ALL');

  const upcomingMatches = matches.filter((m) => {
    const isUpcoming = m.status === 'upcoming';
    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    return isUpcoming && matchesFormat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Upcoming</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-400" />
            Upcoming Cricket Fixtures
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scheduled matches, venue locations, and early simulated odds.
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

      {upcomingMatches.length === 0 ? (
        <EmptyState
          title="No upcoming matches found"
          description="There are currently no upcoming matches matching your filter."
          icon={<Clock className="w-7 h-7 text-emerald-400" />}
          actionText="Show All Cricket Matches"
          actionHref="/cricket"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
