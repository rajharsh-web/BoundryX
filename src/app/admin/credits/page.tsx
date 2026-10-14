'use client';

import React, { useState } from 'react';
import { Coins, Send, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export default function AdminCreditsPage() {
  const { adminUsers, adminGrantCredits, user } = useDemoBetting();
  const [targetUserId, setTargetUserId] = useState('');
  const [grantAmount, setGrantAmount] = useState(1000);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGrant = async () => {
    if (!targetUserId) {
      setFeedback({ type: 'error', text: 'Please select a target user.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    if (reason.trim().length < 5) {
      setFeedback({ type: 'error', text: 'Mandatory audit reason must be at least 5 characters long.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await adminGrantCredits({
        targetUserId,
        amount: grantAmount,
        reason: reason.trim(),
      });

      setFeedback({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) {
        setReason('');
      }
    } catch {
      setFeedback({ type: 'error', text: 'Failed to communicate with authorization server.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232f38]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-emerald-400" />
            Admin Credit Allocation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manually grant virtual demo credits to specific users. All grants are recorded in the audit ledger.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Authorization Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 block">Admin-Only Credit Allocation</span>
          <p>
            Credits are only allocated via this admin console. There are no automated faucets, welcome bonuses, or self-service refills.
            All grants require a mandatory audit justification reason.
          </p>
          <p className="text-amber-300/70">
            Currently logged in as: <strong>{user.username}</strong> ({user.role})
          </p>
        </div>
      </div>

      {/* Grant Credits Form */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Manual Credit Grant
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Target User
            </label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full bg-[#182029] border border-[#263342] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">— Select a user —</option>
              {adminUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.id}) — Bal: {u.demoBalance.toLocaleString()} pts
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Amount (positive integer)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={grantAmount}
              onChange={(e) => setGrantAmount(Number(e.target.value))}
              className="w-full bg-[#182029] border border-[#263342] rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Audit Justification Reason <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Initial allocation for testing, Refill for QA session..."
            className="w-full bg-[#182029] border border-[#263342] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 resize-none"
          />
          <p className="text-[11px] text-slate-500 mt-1">Minimum 5 characters required for audit compliance.</p>
        </div>

        <button
          type="button"
          onClick={handleGrant}
          disabled={!targetUserId || grantAmount <= 0 || reason.trim().length < 5 || isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Authorizing & Granting...' : `Grant +${grantAmount.toLocaleString()} DEMO Credits`}
        </button>
      </div>

      {/* Quick Grant Presets */}
      <div className="bg-[#121820] border border-[#232f38] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Quick Grant Presets
        </h3>
        <p className="text-xs text-slate-400">
          Select a preset and target user above, then click the grant button. All presets still require a justification reason.
        </p>
        <div className="flex flex-wrap gap-2">
          {[500, 1000, 2500, 5000, 10000, 25000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setGrantAmount(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                grantAmount === preset
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-[#182029] text-slate-300 border-[#263342] hover:bg-[#1f2935]'
              }`}
            >
              +{preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
