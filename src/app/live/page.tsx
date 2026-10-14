'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Clock } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchCard } from '@/components/cricket/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function LiveMatchesPage() {
  const { matches } = useDemoBetting();
  const liveMatches = matches.filter((m) => m.status === 'live');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Live</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-emerald-400 animate-live-dot" />
            In-Play Live Cricket Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulated real-time ball-by-ball updates, live odds fluctuations, and in-play markets.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-dot" />
            {liveMatches.length} Active In-Play
          </span>
        </div>
      </div>

      {/* Live matches listing */}
      {liveMatches.length === 0 ? (
        <EmptyState
          title="No in-play matches right now"
          description="There are currently no live matches in progress. Check upcoming matches or review completed results."
          icon={<Clock className="w-7 h-7 text-emerald-400" />}
          actionText="View Upcoming Fixtures"
          actionHref="/upcoming"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
