'use client';

import React, { useState } from 'react';
import { X, Trash2, ReceiptText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDemoBetting } from '@/context/DemoBettingContext';

export const DemoBetSlip: React.FC = () => {
  const {
    betSlip,
    isSlipOpen,
    setIsSlipOpen,
    removeBetFromSlip,
    updateStake,
    clearSlip,
    placeBets,
    demoBalance,
  } = useDemoBetting();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const totalStake = betSlip.reduce((sum, item) => sum + (item.stake || 0), 0);
  const totalPotentialPayout = betSlip.reduce(
    (sum, item) => sum + Math.round((item.stake || 0) * item.odds),
    0
  );

  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceBets = async () => {
    setIsPlacing(true);
    try {
      const res = await placeBets();
      if (res.success) {
        setNotification({ type: 'success', text: res.message });
      } else {
        setNotification({ type: 'error', text: res.message });
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to place bet. Please try again.' });
    } finally {
      setIsPlacing(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const setQuickStake = (id: string, amount: number) => {
    updateStake(id, amount);
  };

  return (
    <>
      {/* Floating Trigger Button (when slip is closed or minimised) */}
      {!isSlipOpen && betSlip.length > 0 && (
        <button
          type="button"
          onClick={() => setIsSlipOpen(true)}
          aria-label={`Open demo bet slip with ${betSlip.length} selections`}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 border border-emerald-400/40"
        >
          <ReceiptText className="w-5 h-5" />
          <span>Demo Slip</span>
          <span className="w-5 h-5 rounded-full bg-black/40 text-white text-xs flex items-center justify-center font-bold">
            {betSlip.length}
          </span>
          <span className="font-mono text-xs opacity-90 pl-1">
            ({totalStake.toLocaleString()} pts)
          </span>
        </button>
      )}

      {/* Slide-out Drawer / Overlay */}
      {isSlipOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#121820] border-l border-[#263342] w-full max-w-md h-full flex flex-col justify-between shadow-2xl text-left">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#1c2632] flex items-center justify-between bg-[#182029]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">Demo Bet Slip</h3>
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/25">
                      Simulated
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {betSlip.length} {betSlip.length === 1 ? 'Selection' : 'Selections'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {betSlip.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSlip}
                    title="Clear all selections"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#1f2935] rounded-lg transition text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSlipOpen(false)}
                  aria-label="Close demo bet slip"
                  className="p-2 text-slate-400 hover:text-white hover:bg-[#1f2935] rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification alert banner */}
            {notification && (
              <div
                className={`p-3.5 mx-4 mt-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${
                  notification.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p>{notification.text}</p>
                </div>
              </div>
            )}

            {/* Selections List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {betSlip.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ReceiptText className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-300 text-sm">Your demo slip is empty</p>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Click on any simulated cricket odds from matches to build your demo accumulator.
                  </p>
                </div>
              ) : (
                betSlip.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#182029] border border-[#263342] relative group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 pr-6">
                        <span className="text-[11px] text-slate-400 block truncate font-medium">
                          {item.matchTitle}
                        </span>
                        <span className="text-xs text-slate-400 block truncate">
                          {item.marketName}
                        </span>
                        <span className="text-sm font-bold text-white mt-0.5 block truncate">
                          {item.optionLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBetFromSlip(item.id)}
                        aria-label={`Remove ${item.optionLabel} from slip`}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded-md hover:bg-[#121820] transition absolute top-3 right-3"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#232f38]">
                      <span className="text-slate-400 font-medium">Simulated Odds:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {item.odds.toFixed(2)}
                      </span>
                    </div>

                    {/* Stake Input */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor={`stake-${item.id}`}
                          className="text-xs font-semibold text-slate-300"
                        >
                          Demo Stake:
                        </label>
                        <span className="text-xs text-slate-400 font-mono">
                          Est. Return:{' '}
                          <strong className="text-white">
                            {Math.round((item.stake || 0) * item.odds).toLocaleString()} pts
                          </strong>
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          id={`stake-${item.id}`}
                          type="number"
                          min="10"
                          step="10"
                          value={item.stake || ''}
                          onChange={(e) => updateStake(item.id, Number(e.target.value))}
                          className="w-full bg-[#121820] border border-[#263342] focus:border-emerald-500 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-hidden"
                          placeholder="Stake in demo pts"
                        />
                        <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">
                          DEMO PTS
                        </span>
                      </div>

                      {/* Quick stake buttons */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {[100, 500, 1000, 2500].map((quick) => (
                          <button
                            key={quick}
                            type="button"
                            onClick={() => setQuickStake(item.id, quick)}
                            className="flex-1 py-1 rounded bg-[#121820] hover:bg-[#1c2632] text-[11px] font-mono text-slate-300 border border-[#263342] transition"
                          >
                            +{quick}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions & Summary */}
            {betSlip.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#1c2632] bg-[#182029] space-y-3.5">
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Available Demo Balance:</span>
                    <span className="font-mono font-semibold text-white">
                      {demoBalance.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Demo Stake:</span>
                    <span className="font-mono font-bold text-white">
                      {totalStake.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-[#263342]">
                    <span className="font-semibold text-white">Potential Demo Return:</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      {totalPotentialPayout.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceBets}
                  disabled={betSlip.length === 0 || totalStake <= 0 || isPlacing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2"
                >
                  <ReceiptText className="w-4 h-4" />
                  {isPlacing ? 'Placing Bet...' : 'Place Simulated Demo Wager'}
                </button>

                <p className="text-[11px] text-center text-slate-500 leading-tight">
                  100% Risk-Free Simulation. No real money deposits or real payouts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
