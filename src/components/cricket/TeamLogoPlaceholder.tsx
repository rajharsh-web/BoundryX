import React from 'react';
import { CricketTeam } from '@/types/cricket';

interface TeamLogoPlaceholderProps {
  team: CricketTeam;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamLogoPlaceholder: React.FC<TeamLogoPlaceholderProps> = ({
  team,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs font-bold',
    lg: 'w-12 h-12 text-sm font-bold',
  };

  return (
    <div
      aria-label={`${team.name} emblem`}
      className={`rounded-full flex items-center justify-center font-bold tracking-tight text-white border border-white/10 shadow-inner shrink-0 ${sizeMap[size]} ${className}`}
      style={{
        backgroundColor: team.color || '#334155',
      }}
    >
      <span>{team.code || team.shortName.substring(0, 3)}</span>
    </div>
  );
};
