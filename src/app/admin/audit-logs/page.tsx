'use client';

import React, { useState } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { mockAuditLogs } from '@/mock/cricketData';

export default function AdminAuditLogsPage() {
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch =
      searchTerm.trim() === '' ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminUser.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-emerald-400" />
            System & Admin Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable trace of odds updates, market settlements, and simulated credits dispatch.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit details or admin user..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121820] border border-[#263342] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#121820] border border-[#263342] text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
        >
          <option value="ALL">All Actions</option>
          <option value="ODDS_UPDATE">ODDS_UPDATE</option>
          <option value="SETTLEMENT">SETTLEMENT</option>
          <option value="FAUCET_DISPATCH">FAUCET_DISPATCH</option>
          <option value="MARKET_SUSPEND">MARKET_SUSPEND</option>
          <option value="USER_CREDIT_TOPUP">USER_CREDIT_TOPUP</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#232f38] bg-[#182029] text-slate-400 font-semibold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2632]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="text-slate-300 hover:bg-[#182029]/50 transition">
                  <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white whitespace-nowrap">
                    {log.adminUser}
                  </td>
                  <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                    {log.target}
                  </td>
                  <td className="p-4 text-slate-300 max-w-sm">
                    {log.details}
                  </td>
                  <td className="p-4 font-mono text-slate-500 text-right whitespace-nowrap">
                    {log.ipAddress}
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
