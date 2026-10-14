import React from 'react';
import { MatchStatus } from '@/types/cricket';

interface MatchStatusBadgeProps {
  status: MatchStatus;
  statusText?: string;
  size?: 'sm' | 'md';
}

export const MatchStatusBadge: React.FC<MatchStatusBadgeProps> = ({
  status,
  statusText,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (status) {
    case 'live':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-dot" />
          LIVE
        </span>
      );
    case 'upcoming':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 ${sizeClasses}`}
        >
          {statusText || 'UPCOMING'}
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-500/15 text-slate-400 border border-slate-600/30 ${sizeClasses}`}
        >
          RESULT
        </span>
      );
    case 'delayed':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses}`}
        >
          DELAYED
        </span>
      );
    case 'innings-break':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 ${sizeClasses}`}
        >
          INNINGS BREAK
        </span>
      );
    default:
      return null;
  }
};
