'use client';

import React from 'react';
import { useDemoBetting } from '@/context/DemoBettingContext';
import { LiveTicker } from './LiveTicker';

export const TickerWrapper: React.FC = () => {
  const { matches } = useDemoBetting();
  return <LiveTicker matches={matches} />;
};
