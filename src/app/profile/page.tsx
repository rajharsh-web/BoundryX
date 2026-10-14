'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Trophy,
  Sliders,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, placedBets, demoBalance, logout } = useDemoBetting();
  const [dailyLimit, setDailyLimit] = useState(user.dailyStakeLimit || 5000);
  const [savedNotice, setSavedNotice] = useState(false);

  const wonBets = placedBets.filter((b) => b.status === 'WON').length;
  const settledBets = placedBets.filter((b) => b.status === 'WON' || b.status === 'LOST');
  const winRate = settledBets.length > 0 ? Math.round((wonBets / settledBets.length) * 100) : 0;

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, dailyStakeLimit: dailyLimit });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>/</span>
            <span className="text-white">Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-emerald-400" />
            User Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your simulated account settings, demo stake limits, and betting analytics.
          </p>
        </div>

        {/* Server-verified authorization badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#182029] text-slate-200 border border-[#263342] text-xs font-semibold">
          {user.role === 'admin' ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role: <strong className="text-emerald-400">ADMINISTRATOR</strong></span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Role: <strong className="text-slate-300">USER</strong></span>
            </>
          )}
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Demo preferences updated successfully!</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-900/30">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                user.role === 'admin'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">
              UID: {user.id} • Server Enforced Authorization
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#182029] border border-[#232f38] text-right self-stretch sm:self-auto">
          <span className="text-xs text-slate-400 block mb-0.5">Demo Credits Balance</span>
          <span className="font-mono text-xl font-extrabold text-white">
            {demoBalance.toLocaleString()} <span className="text-emerald-400 text-xs">PTS</span>
          </span>
        </div>
      </div>

      {/* Simulated Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121820] border border-[#232f38]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Demo Wagers</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-white">
            {placedBets.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Placed in this simulation</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121820] border border-[#232f38]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Settled Won Bets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">
            {wonBets}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">{winRate}% winning strike rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121820] border border-[#232f38]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Responsible Cap</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-white">
            {user.dailyStakeLimit.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Daily demo stake limit</p>
        </div>
      </div>

      {/* Responsible Limit Controls */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Responsible Simulation Limits
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Define daily demo stake thresholds to encourage responsible sports engagement even in virtual games.
          </p>
        </div>

        <form onSubmit={handleSaveLimits} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Daily Stake Limit (Virtual Demo Credits)
            </label>
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full sm:w-72 bg-[#182029] border border-[#263342] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Save Limit Settings
          </button>
        </form>
      </div>

      {/* Account Navigation / Admin shortcuts & Sign Out */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1c2632]">
        {user.role === 'admin' ? (
          <Link
            href="/admin"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Access Admin Management Console
          </Link>
        ) : (
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            Admin console restricted to authorized administrators
          </span>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
