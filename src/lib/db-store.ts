import { mockMatches, mockAuditLogs } from '@/mock/cricketData'
import bcrypt from 'bcryptjs'

export interface StoreUser {
  id: string
  email: string
  username: string
  name: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
}

export interface StoreWallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface StoreCreditTransaction {
  id: string
  walletId: string
  amount: number
  balanceAfter: number
  type: 'ADMIN_GRANT' | 'BET_PLACED' | 'BET_WON' | 'BET_REFUND' | 'CASHOUT'
  description: string
  adminAuditReason?: string
  adminUserId?: string
  createdAt: string
}

export interface StoreAuditLog {
  id: string
  adminUserId: string
  adminName: string
  action: string
  targetType: string
  targetId: string
  details: string
  ipAddress?: string
  createdAt: string
}

export interface StoreDemoBet {
  id: string
  userId: string
  betType: 'SINGLE' | 'ACCUMULATOR'
  totalStake: number
  potentialReturn: number
  actualReturn?: number
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT' | 'VOID'
  cashOutAvailable: boolean
  cashOutValue?: number
  settledAt?: string
  createdAt: string
  selections: {
    id: string
    matchId: string
    marketId: string
    optionId: string
    matchTitle: string
    marketName: string
    selectionLabel: string
    odds: number
    status: 'ACTIVE' | 'WON' | 'LOST' | 'VOID'
  }[]
}

class InMemoryStore {
  public users: Map<string, StoreUser> = new Map()
  public wallets: Map<string, StoreWallet> = new Map()
  public transactions: StoreCreditTransaction[] = []
  public auditLogs: StoreAuditLog[] = []
  public bets: StoreDemoBet[] = []
  public matches = [...mockMatches]

  private initialized = false

  constructor() {
    this.seedDefaultUsers()
  }

  private seedDefaultUsers() {
    if (this.initialized) return

    // Pre-seed admin user with hashed password
    const adminPasswordHash = bcrypt.hashSync('BoundaryX@Admin2026!', 10)
    const adminUser: StoreUser = {
      id: 'admin-super-01',
      email: 'admin@boundaryx.demo',
      username: 'admin',
      name: 'Super Administrator',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.set(adminUser.id, adminUser)
    this.wallets.set(adminUser.id, {
      id: 'wallet-admin-01',
      userId: adminUser.id,
      balance: 10000.0, // Admin virtual testing balance
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Pre-seed regular demo user (MUST START AT EXACTLY 0 CREDITS)
    const demoUserPasswordHash = bcrypt.hashSync('CricketFan@2026', 10)
    const demoUser: StoreUser = {
      id: 'user-demo-01',
      email: 'user@boundaryx.demo',
      username: 'cricketfan',
      name: 'Demo Cricket Fan',
      passwordHash: demoUserPasswordHash,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.set(demoUser.id, demoUser)
    this.wallets.set(demoUser.id, {
      id: 'wallet-user-01',
      userId: demoUser.id,
      balance: 0.0, // Strictly 0 virtual credits
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Seed mock audit logs
    mockAuditLogs.forEach((log) => {
      this.auditLogs.push({
        id: log.id,
        adminUserId: 'admin-super-01',
        adminName: log.adminUser,
        action: log.action,
        targetType: log.target.split(' ')[0] || 'GENERAL',
        targetId: log.target,
        details: log.details,
        ipAddress: log.ipAddress,
        createdAt: log.timestamp,
      })
    })

    this.initialized = true
  }

  public registerUser(params: { email: string; username: string; name: string; passwordHash: string }) {
    // Check duplicates
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === params.email.toLowerCase()) {
        throw new Error('Email is already registered')
      }
      if (u.username.toLowerCase() === params.username.toLowerCase()) {
        throw new Error('Username is already taken')
      }
    }

    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    const newUser: StoreUser = {
      id: userId,
      email: params.email.toLowerCase(),
      username: params.username,
      name: params.name,
      passwordHash: params.passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // MANDATORY PRODUCT RULE: New user starts with exactly 0 credits.
    const newWallet: StoreWallet = {
      id: `wallet-${userId}`,
      userId,
      balance: 0.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.users.set(userId, newUser)
    this.wallets.set(userId, newWallet)

    return { user: newUser, wallet: newWallet }
  }

  public getUserByEmailOrUsername(identifier: string): StoreUser | null {
    const term = identifier.toLowerCase()
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === term || u.username.toLowerCase() === term) {
        return u
      }
    }
    return null
  }

  public getUserById(id: string): StoreUser | null {
    return this.users.get(id) || null
  }

  public getWalletByUserId(userId: string): StoreWallet {
    let wallet = this.wallets.get(userId)
    if (!wallet) {
      wallet = {
        id: `wallet-${userId}`,
        userId,
        balance: 0.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.wallets.set(userId, wallet)
    }
    return wallet
  }

  public adminGrantCredits(params: {
    adminUserId: string
    adminName?: string
    targetUserId: string
    amount: number
    reason: string
  }) {
    const admin = this.users.get(params.adminUserId)
    if (!admin || admin.role !== 'ADMIN' || admin.status !== 'ACTIVE') {
      throw new Error('Unauthorized: Only active administrators can grant demo credits')
    }

    const targetUser = this.users.get(params.targetUserId)
    if (!targetUser) {
      throw new Error('Target user not found')
    }

    if (params.amount <= 0) {
      throw new Error('Grant amount must be strictly greater than 0')
    }

    if (!params.reason || params.reason.trim().length < 5) {
      throw new Error('Mandatory audit reason must be at least 5 characters')
    }

    const wallet = this.getWalletByUserId(params.targetUserId)
    wallet.balance += params.amount
    wallet.updatedAt = new Date().toISOString()

    const txId = `tx-grant-${Date.now()}`
    const tx: StoreCreditTransaction = {
      id: txId,
      walletId: wallet.id,
      amount: params.amount,
      balanceAfter: wallet.balance,
      type: 'ADMIN_GRANT',
      description: `Admin manual grant of ${params.amount} virtual demo credits`,
      adminAuditReason: params.reason.trim(),
      adminUserId: params.adminUserId,
      createdAt: new Date().toISOString(),
    }
    this.transactions.unshift(tx)

    const auditId = `audit-${Date.now()}`
    const audit: StoreAuditLog = {
      id: auditId,
      adminUserId: params.adminUserId,
      adminName: params.adminName || admin.name,
      action: 'CREDIT_GRANT',
      targetType: 'USER_WALLET',
      targetId: params.targetUserId,
      details: `Granted ${params.amount} demo credits to user "${targetUser.username}" (${targetUser.email}). Reason: "${params.reason.trim()}"`,
      createdAt: new Date().toISOString(),
    }
    this.auditLogs.unshift(audit)

    return {
      success: true,
      newBalance: wallet.balance,
      transaction: tx,
      auditLog: audit,
    }
  }

  public placeDemoBet(params: {
    userId: string
    betType: 'SINGLE' | 'ACCUMULATOR'
    totalStake: number
    selections: {
      matchId: string
      marketId: string
      optionId: string
      matchTitle: string
      marketName: string
      selectionLabel: string
      odds: number
    }[]
  }) {
    const user = this.users.get(params.userId)
    if (!user || user.status !== 'ACTIVE') {
      throw new Error('User not found or account is suspended')
    }

    if (params.totalStake <= 0) {
      throw new Error('Stake must be greater than 0')
    }

    const wallet = this.getWalletByUserId(params.userId)
    if (wallet.balance < params.totalStake) {
      throw new Error(`Insufficient demo credits. Balance: ${wallet.balance}, required: ${params.totalStake}`)
    }

    // Deduct stake
    wallet.balance -= params.totalStake
    wallet.updatedAt = new Date().toISOString()

    // Compute multiplier
    const totalOdds =
      params.betType === 'ACCUMULATOR'
        ? params.selections.reduce((acc, sel) => acc * sel.odds, 1)
        : params.selections[0]?.odds || 1.0

    const potentialReturn = Math.round(params.totalStake * totalOdds * 100) / 100

    const betId = `bet-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const bet: StoreDemoBet = {
      id: betId,
      userId: params.userId,
      betType: params.betType,
      totalStake: params.totalStake,
      potentialReturn,
      status: 'PENDING',
      cashOutAvailable: true,
      cashOutValue: Math.round(params.totalStake * 0.9 * 100) / 100,
      createdAt: new Date().toISOString(),
      selections: params.selections.map((s, idx) => ({
        id: `sel-${betId}-${idx}`,
        ...s,
        status: 'ACTIVE',
      })),
    }

    this.bets.unshift(bet)

    // Transaction
    const tx: StoreCreditTransaction = {
      id: `tx-bet-${betId}`,
      walletId: wallet.id,
      amount: -params.totalStake,
      balanceAfter: wallet.balance,
      type: 'BET_PLACED',
      description: `Placed demo ${params.betType.toLowerCase()} bet (${params.selections.length} selections)`,
      createdAt: new Date().toISOString(),
    }
    this.transactions.unshift(tx)

    return {
      success: true,
      bet,
      newBalance: wallet.balance,
    }
  }

  public cashOutBet(userId: string, betId: string) {
    const bet = this.bets.find((b) => b.id === betId && b.userId === userId)
    if (!bet) {
      throw new Error('Bet not found')
    }
    if (bet.status !== 'PENDING') {
      throw new Error('Only pending bets can be cashed out')
    }
    if (!bet.cashOutAvailable || !bet.cashOutValue) {
      throw new Error('Cash out is not available for this bet')
    }

    const cashOutAmount = bet.cashOutValue
    bet.status = 'CASHED_OUT'
    bet.actualReturn = cashOutAmount
    bet.cashOutAvailable = false
    bet.settledAt = new Date().toISOString()

    const wallet = this.getWalletByUserId(userId)
    wallet.balance += cashOutAmount
    wallet.updatedAt = new Date().toISOString()

    const tx: StoreCreditTransaction = {
      id: `tx-cashout-${betId}`,
      walletId: wallet.id,
      amount: cashOutAmount,
      balanceAfter: wallet.balance,
      type: 'CASHOUT',
      description: `Cashed out demo bet #${betId.slice(-6)}`,
      createdAt: new Date().toISOString(),
    }
    this.transactions.unshift(tx)

    return {
      success: true,
      bet,
      newBalance: wallet.balance,
    }
  }

  public settleMarket(params: {
    adminUserId: string
    marketId: string
    winningOptionId: string
    note?: string
  }) {
    const admin = this.users.get(params.adminUserId)
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required')
    }

    let affectedBetsCount = 0

    // Settle bets matching this market
    for (const bet of this.bets) {
      if (bet.status !== 'PENDING') continue

      const matchSel = bet.selections.find((s) => s.marketId === params.marketId)
      if (matchSel) {
        if (matchSel.optionId === params.winningOptionId) {
          matchSel.status = 'WON'
        } else {
          matchSel.status = 'LOST'
        }

        // Check if all selections settled
        const allWon = bet.selections.every((s) => s.status === 'WON')
        const anyLost = bet.selections.some((s) => s.status === 'LOST')

        if (allWon) {
          bet.status = 'WON'
          bet.actualReturn = bet.potentialReturn
          bet.settledAt = new Date().toISOString()
          bet.cashOutAvailable = false

          // Credit winnings
          const wallet = this.getWalletByUserId(bet.userId)
          wallet.balance += bet.potentialReturn
          wallet.updatedAt = new Date().toISOString()

          this.transactions.unshift({
            id: `tx-win-${bet.id}`,
            walletId: wallet.id,
            amount: bet.potentialReturn,
            balanceAfter: wallet.balance,
            type: 'BET_WON',
            description: `Won demo bet payout for bet #${bet.id.slice(-6)}`,
            createdAt: new Date().toISOString(),
          })
          affectedBetsCount++
        } else if (anyLost) {
          bet.status = 'LOST'
          bet.actualReturn = 0
          bet.settledAt = new Date().toISOString()
          bet.cashOutAvailable = false
          affectedBetsCount++
        }
      }
    }

    // Log admin audit
    this.auditLogs.unshift({
      id: `audit-settle-${Date.now()}`,
      adminUserId: params.adminUserId,
      adminName: admin.name,
      action: 'SETTLEMENT',
      targetType: 'MARKET',
      targetId: params.marketId,
      details: `Settled market "${params.marketId}". Winning option: "${params.winningOptionId}". Note: "${params.note || 'None'}"`,
      createdAt: new Date().toISOString(),
    })

    return {
      success: true,
      affectedBetsCount,
    }
  }

  public getAllUsers() {
    return Array.from(this.users.values()).map((u) => {
      const wallet = this.getWalletByUserId(u.id)
      return {
        id: u.id,
        email: u.email,
        username: u.username,
        name: u.name,
        role: u.role,
        status: u.status,
        balance: wallet.balance,
        createdAt: u.createdAt,
      }
    })
  }

  public toggleUserStatus(adminUserId: string, targetUserId: string, newStatus: 'ACTIVE' | 'SUSPENDED', reason: string) {
    const admin = this.users.get(adminUserId)
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required')
    }

    const targetUser = this.users.get(targetUserId)
    if (!targetUser) throw new Error('Target user not found')
    if (targetUser.id === adminUserId) throw new Error('Cannot change own status')

    targetUser.status = newStatus
    targetUser.updatedAt = new Date().toISOString()

    this.auditLogs.unshift({
      id: `audit-status-${Date.now()}`,
      adminUserId,
      adminName: admin.name,
      action: 'USER_UPDATE',
      targetType: 'USER',
      targetId: targetUserId,
      details: `Updated user status to ${newStatus}. Reason: "${reason}"`,
      createdAt: new Date().toISOString(),
    })

    return { success: true, user: targetUser }
  }
}

export const inMemoryStore = new InMemoryStore()
