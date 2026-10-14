'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Radio, ReceiptText, User } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { placedBets } = useDemoBetting();

  const activeBetsCount = placedBets.filter((b) => b.status === 'PENDING').length;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Cricket', href: '/cricket', icon: Trophy },
    { name: 'Live', href: '/live', icon: Radio, hasPulse: true },
    {
      name: 'My Bets',
      href: '/demo-bets',
      icon: ReceiptText,
      badgeCount: activeBetsCount > 0 ? activeBetsCount : undefined,
    },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e141a]/95 backdrop-blur-lg border-t border-[#232f38] px-2 py-1 safe-area-bottom"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[58px] min-h-[48px] rounded-lg transition relative ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.hasPulse && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-live-dot" />
                )}
                {item.badgeCount !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
