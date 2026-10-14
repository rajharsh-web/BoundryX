'use client';

import React, { useState } from 'react';
import { Users, Search, CheckCircle2 } from 'lucide-react';
import { mockAdminUsers } from '@/mock/cricketData';
import { AdminUser } from '@/types/cricket';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGrantCredits = (userId: string, amount: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, demoBalance: u.demoBalance + amount } : u
      )
    );
    setFeedback(`Granted +${amount.toLocaleString()} DEMO credits to user.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      })
    );
    setFeedback('User status updated successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Simulated User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit mock user balances, grant simulated demo credits, and manage account statuses.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121820] border border-[#263342] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#232f38] bg-[#182029] text-slate-400 font-semibold">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Demo Balance</th>
                <th className="p-4">Total Bets</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2632]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="text-slate-300 hover:bg-[#182029]/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{u.username}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{u.email}</div>
                  </td>
                  <td className="p-4 uppercase font-semibold text-slate-400">
                    {u.role}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {u.demoBalance.toLocaleString()}{' '}
                    <span className="text-[10px] text-emerald-400 uppercase">pts</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {u.totalBets}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleGrantCredits(u.id, 2500)}
                        className="px-2.5 py-1 rounded bg-[#182029] hover:bg-[#1f2935] text-emerald-400 border border-[#263342] font-semibold text-xs transition"
                        title="Grant +2,500 Demo Credits"
                      >
                        +2.5K PTS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className="px-2.5 py-1 rounded bg-[#182029] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-[#263342] text-xs transition"
                        title="Toggle user active/suspended"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
