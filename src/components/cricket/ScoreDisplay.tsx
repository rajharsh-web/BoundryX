import React from 'react';
import { InningsScore } from '@/types/cricket';

interface ScoreDisplayProps {
  scores?: InningsScore[];
  isCurrentBatting?: boolean;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scores,
  isCurrentBatting = false,
  className = '',
}) => {
  if (!scores || scores.length === 0) {
    return <span className="text-slate-500 text-xs sm:text-sm font-medium">Yet to bat</span>;
  }

  return (
    <div className={`flex flex-col items-end ${className}`}>
      {scores.map((score, idx) => (
        <div key={idx} className="flex items-baseline gap-1.5">
          <span className={`font-mono text-sm sm:text-base font-semibold ${isCurrentBatting ? 'text-white' : 'text-slate-300'}`}>
            {score.runs}
            <span className="text-slate-400">/{score.wickets}</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({score.overs} ov)
          </span>
        </div>
      ))}
    </div>
  );
};
