'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';
import { CricketMatch } from '@/types/cricket';

interface LiveTickerProps {
  matches: CricketMatch[];
}

function getTickerItems(matches: CricketMatch[]) {
  return matches.flatMap((m) => {
    const homeScore = m.scores.home[m.scores.home.length - 1];
    const awayScore = m.scores.away[m.scores.away.length - 1];
    const scoreStr =
      m.status === 'upcoming'
        ? `${m.teamHome.shortName} vs ${m.teamAway.shortName} • ${new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : [
            awayScore
              ? `${m.teamAway.shortName} ${awayScore.runs}/${awayScore.wickets} (${awayScore.overs})`
              : m.teamAway.shortName,
            homeScore
              ? `${m.teamHome.shortName} ${homeScore.runs}/${homeScore.wickets} (${homeScore.overs})`
              : m.teamHome.shortName,
          ].join(' vs ');

    return {
      id: m.id,
      label: scoreStr,
      status: m.status,
      statusText: m.statusText,
    };
  });
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ matches }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = getTickerItems(matches);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;
    let pos = 0;
    const step = () => {
      pos += 0.5;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
    };
    const id = setInterval(step, 16);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  // Duplicate items for seamless looping
  const doubled = [...items, ...items];

  return (
    <div className="sticky top-16 z-30 bg-[#0b0f14]/95 backdrop-blur border-b border-[#1c2632] overflow-hidden">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 border-r border-emerald-500/30 shrink-0">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-live-dot" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 whitespace-nowrap">
            LIVE
          </span>
        </div>

        {/* Scrolling content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden flex items-center"
          style={{ scrollBehavior: 'auto' }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-0 whitespace-nowrap">
            {doubled.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={`/match/${item.id}`}
                tabIndex={i < items.length ? 0 : -1}
                className="inline-flex items-center gap-3 px-4 py-2 text-xs hover:bg-[#182029] transition-colors group"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.status === 'live'
                      ? 'bg-emerald-400 animate-live-dot'
                      : item.status === 'upcoming'
                      ? 'bg-amber-400'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="font-mono font-semibold text-slate-200 group-hover:text-white">
                  {item.label}
                </span>
                {item.status === 'live' && (
                  <span className="text-[10px] text-emerald-400/80 truncate max-w-[160px]">
                    {item.statusText}
                  </span>
                )}
                <span className="text-slate-600 px-2">|</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
