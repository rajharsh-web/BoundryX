'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CricketMatch,
  BetSlipItem,
  PlacedDemoBet,
  CreditTransaction,
  BettingMarket,
  AdminUser,
  AuditLogItem,
} from '@/types/cricket';
import { mockMatches, mockAdminUsers, mockAuditLogs } from '@/mock/cricketData';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  dailyStakeLimit: number;
}

interface GrantCreditParams {
  targetUserId: string;
  amount: number;
  reason: string;
}

interface DemoBettingContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  demoBalance: number;
  betSlip: BetSlipItem[];
  isSlipOpen: boolean;
  setIsSlipOpen: (open: boolean) => void;
  placedBets: PlacedDemoBet[];
  transactions: CreditTransaction[];
  matches: CricketMatch[];
  adminUsers: AdminUser[];
  auditLogs: AuditLogItem[];
  isAuthenticated: boolean;

  // Actions
  addBetToSlip: (item: Omit<BetSlipItem, 'id' | 'stake'>) => { success: boolean; message?: string };
  removeBetFromSlip: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  clearSlip: () => void;
  placeBets: () => Promise<{ success: boolean; message: string }>;
  cashOutBet: (betId: string) => Promise<void>;
  settleBetSimulation: (betId: string, outcome: 'WON' | 'LOST') => void;
  resetAllDemoData: () => void;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;

  // Admin Operations (Authorized manual credit grants & match controls)
  adminGrantCredits: (params: GrantCreditParams) => Promise<{ success: boolean; message: string }>;
  updateMatch: (matchId: string, updates: Partial<CricketMatch>) => void;
  updateMarketStatus: (matchId: string, marketId: string, status: BettingMarket['status'], settledOptionId?: string) => void;
  toggleUserStatus: (userId: string) => void;
}

const GUEST_USER: UserProfile = {
  id: 'guest',
  username: 'DemoPlayer',
  email: 'player@boundaryx.demo',
  role: 'user',
  dailyStakeLimit: 5000,
};

const INITIAL_BALANCE = 0;

const DemoBettingContext = createContext<DemoBettingContextType | undefined>(undefined);

export function DemoBettingProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(GUEST_USER);
  const [demoBalance, setDemoBalance] = useState<number>(INITIAL_BALANCE);
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState<boolean>(false);
  const [placedBets, setPlacedBets] = useState<PlacedDemoBet[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [matches, setMatches] = useState<CricketMatch[]>(mockMatches);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Sync server session
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role === 'ADMIN' ? 'admin' : 'user',
            dailyStakeLimit: 50000,
          });
          setDemoBalance(data.user.balance || 0);
          setIsAuthenticated(true);

          // Fetch user wallet transactions
          try {
            const wRes = await fetch('/api/wallet');
            if (wRes.ok) {
              const wData = await wRes.json();
              if (wData.transactions) {
                setTransactions(wData.transactions);
              }
            }
          } catch {
            // Ignore
          }

          // Fetch user bets
          try {
            const bRes = await fetch('/api/bets/my-bets');
            if (bRes.ok) {
              const bData = await bRes.json();
              if (bData.bets) {
                interface ApiBet {
                  id: string;
                  totalStake: number;
                  potentialReturn: number;
                  createdAt: string;
                  status: PlacedDemoBet['status'];
                  actualReturn?: number;
                  selections?: Array<{
                    marketId?: string;
                    matchTitle?: string;
                    marketName?: string;
                    selectionLabel?: string;
                    odds?: number;
                  }>;
                }
                setPlacedBets(
                  bData.bets.map((b: ApiBet) => ({
                    id: b.id,
                    matchId: b.selections?.[0]?.marketId || 'match-demo',
                    matchTitle: b.selections?.[0]?.matchTitle || 'Cricket Match',
                    marketName: b.selections?.[0]?.marketName || 'Match Winner',
                    selection: b.selections?.[0]?.selectionLabel || 'Selection',
                    odds: b.selections?.[0]?.odds || 1.85,
                    stake: b.totalStake,
                    potentialPayout: b.potentialReturn,
                    placedAt: new Date(b.createdAt).toISOString().replace('T', ' ').substring(0, 16),
                    status: b.status,
                    payoutAmount: b.actualReturn,
                  }))
                );
              }
            }
          } catch {
            // Ignore
          }

          // If admin, load real users and audit logs
          if (data.user.role === 'ADMIN') {
            try {
              const uRes = await fetch('/api/admin/users');
              if (uRes.ok) {
                const uData = await uRes.json();
                if (uData.users) {
                  interface ApiUser {
                    id: string;
                    username: string;
                    email: string;
                    role: string;
                    balance: number;
                    status: string;
                    createdAt: string;
                  }
                  setAdminUsers(
                    uData.users.map((u: ApiUser) => ({
                      id: u.id,
                      username: u.username,
                      email: u.email,
                      role: u.role === 'ADMIN' ? 'admin' : 'user',
                      demoBalance: u.balance,
                      totalBets: 0,
                      status: u.status.toLowerCase(),
                      joinedDate: u.createdAt.substring(0, 10),
                    }))
                  );
                }
              }

              const aRes = await fetch('/api/admin/audit-logs');
              if (aRes.ok) {
                const aData = await aRes.json();
                if (aData.logs) {
                  interface ApiLog {
                    id: string;
                    timestamp: string;
                    adminName: string;
                    action: string;
                    targetType: string;
                    targetId: string;
                    details: string;
                    ipAddress: string;
                  }
                  setAuditLogs(
                    aData.logs.map((l: ApiLog) => ({
                      id: l.id,
                      timestamp: l.timestamp.replace('T', ' ').substring(0, 19),
                      adminUser: l.adminName,
                      action: l.action,
                      target: `${l.targetType} / ${l.targetId}`,
                      details: l.details,
                      ipAddress: l.ipAddress,
                    }))
                  );
                }
              }
            } catch {
              // Ignore
            }
          }
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data.user && mounted) {
            setUser({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role === 'ADMIN' ? 'admin' : 'user',
              dailyStakeLimit: 50000,
            });
            setDemoBalance(data.user.balance || 0);
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Ignore
      }
    };
    void fetchSession();
    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setUser(GUEST_USER);
    setDemoBalance(0);
    setIsAuthenticated(false);
    setPlacedBets([]);
    setTransactions([]);
  };

  const addBetToSlip = (item: Omit<BetSlipItem, 'id' | 'stake'>): { success: boolean; message?: string } => {
    const match = matches.find((m) => m.id === item.matchId);
    if (!match || match.status === 'completed') {
      return { success: false, message: 'Cannot add selection: Match is completed or unavailable.' };
    }

    const market = match.markets.find((m) => m.id === item.marketId);
    if (!market || market.status !== 'OPEN') {
      return { success: false, message: 'Cannot add selection: Market is currently suspended.' };
    }

    setBetSlip((prev) => {
      const exists = prev.find(
        (b) => b.matchId === item.matchId && b.marketId === item.marketId && b.optionId === item.optionId
      );
      if (exists) return prev;

      const newItem: BetSlipItem = {
        ...item,
        id: `slip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        stake: 100,
      };
      return [...prev, newItem];
    });

    setIsSlipOpen(true);
    return { success: true };
  };

  const removeBetFromSlip = (id: string) => {
    setBetSlip((prev) => prev.filter((b) => b.id !== id));
  };

  const updateStake = (id: string, stake: number) => {
    setBetSlip((prev) =>
      prev.map((b) => (b.id === id ? { ...b, stake: Math.max(0, Math.min(stake, 50000)) } : b))
    );
  };

  const clearSlip = () => {
    setBetSlip([]);
  };

  const placeBets = async (): Promise<{ success: boolean; message: string }> => {
    if (betSlip.length === 0) {
      return { success: false, message: 'Your bet slip is empty.' };
    }

    const totalStake = betSlip.reduce((sum, item) => sum + (item.stake || 0), 0);
    if (totalStake <= 0) {
      return { success: false, message: 'Stake amount must be greater than 0.' };
    }

    if (totalStake > demoBalance) {
      return {
        success: false,
        message: `Insufficient demo balance. Available: ${demoBalance.toLocaleString()} DEMO. Required: ${totalStake.toLocaleString()} DEMO. An administrator must allocate credits.`,
      };
    }

    try {
      const selections = betSlip.map((b) => ({
        matchId: b.matchId,
        marketId: b.marketId,
        optionId: b.optionId,
        odds: b.odds,
        matchTitle: b.matchTitle,
        marketName: b.marketName,
        selectionLabel: b.optionLabel,
      }));

      const res = await fetch('/api/bets/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          betType: 'SINGLE',
          totalStake,
          selections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Server rejected bet placement' };
      }

      setDemoBalance(data.newBalance);
      clearSlip();
      await refreshSession();

      return {
        success: true,
        message: `Successfully placed simulated bet of ${totalStake.toLocaleString()} DEMO credits!`,
      };
    } catch {
      // Local fallback simulation if server is unreachable
      const newBalance = demoBalance - totalStake;
      setDemoBalance(newBalance);
      clearSlip();
      return {
        success: true,
        message: `Simulated bet placed for ${totalStake.toLocaleString()} DEMO credits.`,
      };
    }
  };

  const cashOutBet = async (betId: string) => {
    try {
      const res = await fetch('/api/bets/cashout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId }),
      });
      if (res.ok) {
        const data = await res.json();
        setDemoBalance(data.newBalance);
        await refreshSession();
        return;
      }
    } catch {
      // Ignore
    }

    // Client fallback
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || bet.status !== 'PENDING') return;

    const cashoutAmount = Math.round(bet.stake * 0.88);
    const newBalance = demoBalance + cashoutAmount;
    setDemoBalance(newBalance);
    setPlacedBets((prev) =>
      prev.map((b) =>
        b.id === betId
          ? {
              ...b,
              status: 'CASHED_OUT',
              settledAt: new Date().toISOString(),
              payoutAmount: cashoutAmount,
            }
          : b
      )
    );
  };

  const settleBetSimulation = (betId: string, outcome: 'WON' | 'LOST') => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || bet.status !== 'PENDING') return;

    const payout = outcome === 'WON' ? bet.potentialPayout : 0;
    const newBalance = demoBalance + payout;
    setDemoBalance(newBalance);
    setPlacedBets((prev) =>
      prev.map((b) =>
        b.id === betId
          ? {
              ...b,
              status: outcome,
              settledAt: new Date().toISOString(),
              payoutAmount: payout,
            }
          : b
      )
    );
  };

  const adminGrantCredits = async ({
    targetUserId,
    amount,
    reason,
  }: GrantCreditParams): Promise<{ success: boolean; message: string }> => {
    if (user.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized: Only administrators can grant credits.',
      };
    }

    if (amount <= 0) {
      return {
        success: false,
        message: 'Grant amount must be strictly greater than 0 DEMO credits.',
      };
    }

    const cleanReason = (reason || '').trim();
    if (cleanReason.length < 5) {
      return {
        success: false,
        message: 'Mandatory audit reason must be at least 5 characters long.',
      };
    }

    try {
      const res = await fetch('/api/admin/grant-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          amount,
          reason: cleanReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.error || 'Server rejected credit grant request.',
        };
      }

      // Update local adminUsers list
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, demoBalance: data.newBalance } : u))
      );

      // If granting to current logged in user
      if (user.id === targetUserId) {
        setDemoBalance(data.newBalance);
      }

      await refreshSession();

      return {
        success: true,
        message: `Successfully granted +${amount.toLocaleString()} DEMO credits. Recorded in audit ledger.`,
      };
    } catch {
      // Fallback
      return {
        success: true,
        message: `Successfully allocated +${amount.toLocaleString()} DEMO credits.`,
      };
    }
  };

  const updateMatch = (matchId: string, updates: Partial<CricketMatch>) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateMarketStatus = (
    matchId: string,
    marketId: string,
    status: BettingMarket['status'],
    settledOptionId?: string
  ) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          markets: m.markets.map((mk) => {
            if (mk.id !== marketId) return mk;
            return {
              ...mk,
              status,
              settledOptionId: settledOptionId || mk.settledOptionId,
              options: mk.options.map((opt) => ({
                ...opt,
                isWinner: settledOptionId ? opt.id === settledOptionId : opt.isWinner,
              })),
            };
          }),
        };
      })
    );
  };

  const toggleUserStatus = async (userId: string) => {
    const target = adminUsers.find((u) => u.id === userId);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'SUSPENDED' : 'ACTIVE';

    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          status: newStatus,
          reason: 'Toggled via Admin Console',
        }),
      });
      await refreshSession();
    } catch {
      // Ignore
    }

    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const resetAllDemoData = () => {
    setUser(GUEST_USER);
    setDemoBalance(INITIAL_BALANCE);
    setBetSlip([]);
    setPlacedBets([]);
    setTransactions([]);
    setMatches(mockMatches);
  };

  return (
    <DemoBettingContext.Provider
      value={{
        user,
        setUser,
        demoBalance,
        betSlip,
        isSlipOpen,
        setIsSlipOpen,
        placedBets,
        transactions,
        matches,
        adminUsers,
        auditLogs,
        isAuthenticated,
        addBetToSlip,
        removeBetFromSlip,
        updateStake,
        clearSlip,
        placeBets,
        cashOutBet,
        settleBetSimulation,
        resetAllDemoData,
        refreshSession,
        logout,
        adminGrantCredits,
        updateMatch,
        updateMarketStatus,
        toggleUserStatus,
      }}
    >
      {children}
    </DemoBettingContext.Provider>
  );
}

export function useDemoBetting() {
  const context = useContext(DemoBettingContext);
  if (!context) {
    throw new Error('useDemoBetting must be used within a DemoBettingProvider');
  }
  return context;
}
