'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Search } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchCard } from '@/components/cricket/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CricketHubPage() {
  const { matches } = useDemoBetting();
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredMatches = matches.filter((m) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      m.teamHome.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.teamAway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesFormat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Cricket</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-emerald-400" />
            Cricket Tournaments & Fixtures
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse international cricket tours, domestic T20 franchises, and test series.
          </p>
        </div>

        {/* Quick format filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'T20', 'ODI', 'TEST'].map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormatFilter(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                formatFilter === fmt
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#121820] text-slate-300 hover:bg-[#182029] border border-[#232f38]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams, tournament, venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121820] border border-[#263342] focus:border-emerald-500 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#121820] border border-[#263342] text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">All Match States</option>
            <option value="live">In-Play (Live)</option>
            <option value="upcoming">Upcoming Fixtures</option>
            <option value="completed">Completed Results</option>
          </select>

          {(searchTerm || formatFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFormatFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-3 py-2.5 rounded-xl bg-[#182029] text-xs text-slate-300 hover:text-white border border-[#263342]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <EmptyState
          title="No cricket matches match your search"
          description="Try clearing your search term or selecting another format filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setFormatFilter('ALL');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
