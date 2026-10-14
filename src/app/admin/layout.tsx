'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Users,
  CheckCircle2,
  Coins,
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

function AdminNavTabs() {
  const pathname = usePathname();

  const adminNav = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Matches', href: '/admin/matches', icon: Activity },
    { name: 'Markets & Odds', href: '/admin/markets', icon: TrendingUp },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settlements', href: '/admin/settlements', icon: CheckCircle2 },
    { name: 'Demo Credits', href: '/admin/credits', icon: Coins },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#232f38]">
      {adminNav.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#121820] text-slate-400 hover:text-white hover:bg-[#182029] border border-[#232f38]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useDemoBetting();

  if (user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-[#121820] border border-rose-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 mx-auto flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          The Admin Console is strictly restricted to authenticated administrators. You are currently logged in as <strong>{user.username}</strong> ({user.role}).
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/login?error=admin_required"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Sign In as Admin
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#182029] hover:bg-[#1f2935] text-slate-300 border border-[#263342] text-xs font-semibold transition"
          >
            Return to Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Control Bar */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                BoundaryX Admin Console
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ACTIVE ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Authenticated Administrator: <strong>{user.username}</strong> ({user.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182029] hover:bg-[#1f2935] text-slate-300 hover:text-white border border-[#263342] text-xs font-semibold transition"
          >
            <span>Exit to Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Admin Subnav Tabs wrapped in Suspense */}
      <Suspense fallback={<div className="h-10 bg-[#121820] rounded-xl animate-pulse" />}>
        <AdminNavTabs />
      </Suspense>

      {/* Admin Content View */}
      <div>{children}</div>
    </div>
  );
}
