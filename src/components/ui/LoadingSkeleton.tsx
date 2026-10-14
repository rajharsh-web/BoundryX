import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = 'h-6 w-full',
  count = 1,
}) => {
  return (
    <div className="space-y-3 w-full" aria-label="Loading content..." role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-[#1c2632] animate-pulse rounded-lg ${className}`}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const MatchCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#121820] border border-[#263342] rounded-xl p-4 sm:p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-[#1c2632] rounded" />
        <div className="h-5 w-16 bg-[#1c2632] rounded-full" />
      </div>
      <div className="space-y-3 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1c2632]" />
            <div className="h-4 w-28 bg-[#1c2632] rounded" />
          </div>
          <div className="h-5 w-20 bg-[#1c2632] rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1c2632]" />
            <div className="h-4 w-28 bg-[#1c2632] rounded" />
          </div>
          <div className="h-5 w-20 bg-[#1c2632] rounded" />
        </div>
      </div>
      <div className="pt-3 border-t border-[#1c2632] flex justify-between items-center">
        <div className="h-3 w-40 bg-[#1c2632] rounded" />
        <div className="h-8 w-24 bg-[#1c2632] rounded-lg" />
      </div>
    </div>
  );
};
