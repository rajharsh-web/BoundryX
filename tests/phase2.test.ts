import { describe, it, expect, beforeEach } from 'vitest'
import { inMemoryStore } from '@/lib/db-store'
import { registerSchema, grantCreditsSchema, placeBetSchema } from '@/lib/validations'
import { signSessionToken, verifySessionToken } from '@/lib/auth'

describe('BoundaryX Phase 2 - Virtual Credits, Auth & Settlement Test Suite', () => {
  let adminId: string
  let regularUserId: string

  beforeEach(() => {
    // Re-seed demo users
    const admin = inMemoryStore.getUserByEmailOrUsername('admin')
    expect(admin).toBeDefined()
    expect(admin?.role).toBe('ADMIN')
    adminId = admin!.id

    const demoUser = inMemoryStore.getUserByEmailOrUsername('user@boundaryx.demo')
    expect(demoUser).toBeDefined()
    expect(demoUser?.role).toBe('USER')
    regularUserId = demoUser!.id
  })

  // 1. User registration succeeds and initializes balance to exactly 0 credits
  it('1. User registration succeeds and initializes balance to strictly 0 demo credits', () => {
    const validRegistrationData = {
      email: `fan_${Date.now()}@boundaryx.demo`,
      username: `cricketfan_${Date.now().toString().slice(-4)}`,
      name: 'Test Cricket Fan',
      password: 'SecurePassword123!',
    }

    // Validate with Zod
    const parsed = registerSchema.parse(validRegistrationData)
    expect(parsed.email).toBe(validRegistrationData.email)

    // Register user
    const { user, wallet } = inMemoryStore.registerUser({
      email: parsed.email,
      username: parsed.username,
      name: parsed.name,
      passwordHash: 'hashed_password_mock',
    })

    expect(user.id).toBeDefined()
    expect(user.role).toBe('USER')
    // STRICT CHECK: Exactly 0 virtual credits
    expect(wallet.balance).toBe(0.0)

    const fetchedWallet = inMemoryStore.getWalletByUserId(user.id)
    expect(fetchedWallet.balance).toBe(0.0)
  })

  // 2. User cannot grant themselves credits or modify balance directly
  it('2. Regular user cannot grant themselves credits (rejected with authorization error)', () => {
    expect(() => {
      inMemoryStore.adminGrantCredits({
        adminUserId: regularUserId, // Regular user attempting admin grant
        targetUserId: regularUserId,
        amount: 500,
        reason: 'Attempting to self grant credits',
      })
    }).toThrow(/Only active administrators can grant demo credits/)

    // Wallet balance remains 0
    const wallet = inMemoryStore.getWalletByUserId(regularUserId)
    expect(wallet.balance).toBe(0.0)
  })

  // 3. Admin can grant credits with a valid audit reason, balance updates correctly, and audit log is recorded
  it('3. Admin can grant credits with valid audit reason; updates balance and logs audit trail', () => {
    const initialBalance = inMemoryStore.getWalletByUserId(regularUserId).balance
    const grantAmount = 250
    const auditReason = 'Admin testing grant for boundary validation'

    // Validate grant schema
    const validData = grantCreditsSchema.parse({
      targetUserId: regularUserId,
      amount: grantAmount,
      reason: auditReason,
    })

    const result = inMemoryStore.adminGrantCredits({
      adminUserId: adminId,
      adminName: 'Super Administrator',
      targetUserId: validData.targetUserId,
      amount: validData.amount,
      reason: validData.reason,
    })

    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(initialBalance + grantAmount)
    expect(result.transaction.type).toBe('ADMIN_GRANT')
    expect(result.transaction.adminAuditReason).toBe(auditReason)
    expect(result.auditLog.action).toBe('CREDIT_GRANT')
    expect(result.auditLog.details).toContain(auditReason)

    const finalWallet = inMemoryStore.getWalletByUserId(regularUserId)
    expect(finalWallet.balance).toBe(initialBalance + grantAmount)
  })

  // 4. Credit grant fails without admin authentication or without required audit reason
  it('4. Credit grant fails when audit reason is missing or too short', () => {
    expect(() => {
      grantCreditsSchema.parse({
        targetUserId: regularUserId,
        amount: 100,
        reason: 'bad', // Too short (minimum 5 chars)
      })
    }).toThrow()

    expect(() => {
      inMemoryStore.adminGrantCredits({
        adminUserId: adminId,
        targetUserId: regularUserId,
        amount: 100,
        reason: '   ', // Empty/whitespace
      })
    }).toThrow(/Mandatory audit reason must be at least 5 characters/)
  })

  // 5. Non-admin user cannot access admin session or verify as admin
  it('5. Non-admin session verification fails admin role check', async () => {
    const regularUser = inMemoryStore.getUserById(regularUserId)!
    const userToken = await signSessionToken({
      userId: regularUser.id,
      email: regularUser.email,
      username: regularUser.username,
      name: regularUser.name,
      role: regularUser.role, // 'USER'
      status: regularUser.status,
    })

    const verified = await verifySessionToken(userToken)
    expect(verified).not.toBeNull()
    expect(verified?.role).toBe('USER')
    expect(verified?.role === 'ADMIN').toBe(false)
  })

  // 6. Demo bet placement deducts stake from user balance atomically
  it('6. Demo bet placement deducts stake immediately from user balance', () => {
    // First grant credits to allow betting
    inMemoryStore.adminGrantCredits({
      adminUserId: adminId,
      targetUserId: regularUserId,
      amount: 1000,
      reason: 'Funding user for bet deduction test',
    })

    const initialBalance = inMemoryStore.getWalletByUserId(regularUserId).balance
    const stake = 200

    const betInput = {
      betType: 'SINGLE' as const,
      totalStake: stake,
      selections: [
        {
          matchId: 'match-01',
          marketId: 'mkt-01',
          optionId: 'opt-01',
          matchTitle: 'India vs Australia',
          marketName: 'Match Winner',
          selectionLabel: 'India',
          odds: 1.85,
        },
      ],
    }

    placeBetSchema.parse(betInput)

    const result = inMemoryStore.placeDemoBet({
      userId: regularUserId,
      ...betInput,
    })

    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(initialBalance - stake)
    expect(result.bet.status).toBe('PENDING')
    expect(result.bet.potentialReturn).toBe(370)

    const currentWallet = inMemoryStore.getWalletByUserId(regularUserId)
    expect(currentWallet.balance).toBe(initialBalance - stake)
  })

  // 7. Demo bet placement fails when balance is insufficient
  it('7. Demo bet placement fails when balance is insufficient', () => {
    const wallet = inMemoryStore.getWalletByUserId(regularUserId)
    const excessiveStake = wallet.balance + 50000

    expect(() => {
      inMemoryStore.placeDemoBet({
        userId: regularUserId,
        betType: 'SINGLE',
        totalStake: excessiveStake,
        selections: [
          {
            matchId: 'match-01',
            marketId: 'mkt-01',
            optionId: 'opt-01',
            matchTitle: 'India vs Australia',
            marketName: 'Match Winner',
            selectionLabel: 'India',
            odds: 1.85,
          },
        ],
      })
    }).toThrow(/Insufficient demo credits/)
  })

  // 8. Market settlement credits winnings correctly to winning bettor balances and creates transaction records
  it('8. Market settlement credits winnings correctly to winning bettor balances and creates transaction records', () => {
    // Create new dedicated user for clean accounting
    const { user: winner } = inMemoryStore.registerUser({
      email: `winner_${Date.now()}@boundaryx.demo`,
      username: `winner_${Date.now().toString().slice(-4)}`,
      name: 'Winning Punter',
      passwordHash: 'dummy_hash',
    })

    // Grant 500 credits
    inMemoryStore.adminGrantCredits({
      adminUserId: adminId,
      targetUserId: winner.id,
      amount: 500,
      reason: 'Seeding balance for winning bettor settlement test',
    })

    // Place bet of 200 at 2.50 odds
    const betResult = inMemoryStore.placeDemoBet({
      userId: winner.id,
      betType: 'SINGLE',
      totalStake: 200,
      selections: [
        {
          matchId: 'match-ind-eng',
          marketId: 'mkt-settle-test',
          optionId: 'opt-ind-win',
          matchTitle: 'India vs England',
          marketName: 'Match Winner',
          selectionLabel: 'India',
          odds: 2.5,
        },
      ],
    })

    expect(betResult.newBalance).toBe(300) // 500 - 200 = 300
    expect(betResult.bet.potentialReturn).toBe(500) // 200 * 2.5 = 500

    // Admin settles market in favor of India
    const settlementResult = inMemoryStore.settleMarket({
      adminUserId: adminId,
      marketId: 'mkt-settle-test',
      winningOptionId: 'opt-ind-win',
      note: 'Match ended with India winning by 5 wickets',
    })

    expect(settlementResult.success).toBe(true)
    expect(settlementResult.affectedBetsCount).toBe(1)

    // Verify bet status is WON
    const betInStore = inMemoryStore.bets.find((b) => b.id === betResult.bet.id)
    expect(betInStore?.status).toBe('WON')
    expect(betInStore?.actualReturn).toBe(500)

    // Verify wallet balance received payout: 300 + 500 = 800
    const winnerWallet = inMemoryStore.getWalletByUserId(winner.id)
    expect(winnerWallet.balance).toBe(800)

    // Verify transaction record
    const winTx = inMemoryStore.transactions.find((tx) => tx.type === 'BET_WON' && tx.walletId === winnerWallet.id)
    expect(winTx).toBeDefined()
    expect(winTx?.amount).toBe(500)
    expect(winTx?.balanceAfter).toBe(800)
  })
})
