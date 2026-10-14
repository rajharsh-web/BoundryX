'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Edit3, Check, ExternalLink } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { MatchStatusBadge } from '@/components/cricket/MatchStatusBadge';
import { CricketMatch, MatchStatus } from '@/types/cricket';

export default function AdminMatchesPage() {
  const { matches, updateMatch } = useDemoBetting();
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('live');
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const startEdit = (m: CricketMatch) => {
    setEditingMatchId(m.id);
    setStatusText(m.statusText);
    setMatchStatus(m.status);
  };

  const handleSave = (matchId: string) => {
    updateMatch(matchId, {
      statusText,
      status: matchStatus,
    });
    setEditingMatchId(null);
    setSaveAlert(`Match updated: set status to ${matchStatus.toUpperCase()}!`);
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Cricket Match Control Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Change in-play states, adjust live over scores, and sync match situations in real-time.
          </p>
        </div>
      </div>

      {saveAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Match Control Cards */}
      <div className="space-y-4">
        {matches.map((m) => {
          const isEditing = editingMatchId === m.id;

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#121820] border border-[#232f38] space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2632]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1c2632] text-slate-300 uppercase">
                    {m.format}
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {m.teamHome.name} vs {m.teamAway.name}
                  </span>
                  <span className="text-xs text-slate-500">({m.series})</span>
                </div>

                <div className="flex items-center gap-3">
                  <MatchStatusBadge status={m.status} />
                  <Link
                    href={`/match/${m.id}`}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                  >
                    <span>View Match</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {isEditing ? (
                <div className="p-4 rounded-xl bg-[#182029] border border-[#263342] space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Edit Match Status & Commentary Headline
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Match Status
                      </label>
                      <select
                        value={matchStatus}
                        onChange={(e) => setMatchStatus(e.target.value as MatchStatus)}
                        className="w-full bg-[#121820] border border-[#263342] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      >
                        <option value="live">LIVE (In-Play)</option>
                        <option value="upcoming">UPCOMING (Scheduled)</option>
                        <option value="completed">COMPLETED (Result Settled)</option>
                        <option value="innings-break">INNINGS BREAK</option>
                        <option value="delayed">DELAYED (Rain / Weather)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Status Description Text
                      </label>
                      <input
                        type="text"
                        value={statusText}
                        onChange={(e) => setStatusText(e.target.value)}
                        className="w-full bg-[#121820] border border-[#263342] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingMatchId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(m.id)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Match Status
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-300">
                      Current Description:{' '}
                      <strong className="text-emerald-400">{m.statusText}</strong>
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      Venue: {m.venue}, {m.city} • Markets Active: {m.markets.length}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(m)}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#182029] hover:bg-[#1f2935] text-slate-200 border border-[#263342] text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    Edit Situation
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
