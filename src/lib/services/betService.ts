import { prisma } from '@/lib/prisma'
import { placeBetSchema, cashOutSchema, settleMarketSchema } from '@/lib/validations'
import { inMemoryStore } from '@/lib/db-store'
import { deductCreditsForBet, creditWinnings } from '@/lib/services/walletService'

export async function placeBet(userId: string, input: unknown) {
  const data = placeBetSchema.parse(input)

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Check user status
      const user = await tx.user.findUnique({
        where: { id: userId },
      })
      if (!user || user.status !== 'ACTIVE') {
        throw new Error('Account not found or suspended')
      }

      // 2. Calculate returns
      const totalOdds =
        data.betType === 'ACCUMULATOR'
          ? data.selections.reduce((acc, s) => acc * s.odds, 1)
          : data.selections[0].odds

      const potentialReturn = Math.round(data.totalStake * totalOdds * 100) / 100

      // 3. Atomically deduct stake
      const { wallet } = await deductCreditsForBet(tx, {
        userId,
        amount: data.totalStake,
        description: `Placed demo ${data.betType.toLowerCase()} bet (${data.selections.length} selections)`,
      })

      // 4. Create DemoBet record
      const bet = await tx.demoBet.create({
        data: {
          userId,
          betType: data.betType,
          totalStake: data.totalStake,
          potentialReturn,
          status: 'PENDING',
          cashOutAvailable: true,
          cashOutValue: Math.round(data.totalStake * 0.9 * 100) / 100,
          selections: {
            create: data.selections.map((s) => ({
              marketId: s.marketId,
              marketOptionId: s.optionId,
              matchTitle: s.matchTitle,
              marketName: s.marketName,
              selectionLabel: s.selectionLabel,
              odds: s.odds,
              status: 'ACTIVE',
            })),
          },
        },
        include: {
          selections: true,
        },
      })

      return {
        success: true,
        bet,
        newBalance: wallet.balance,
      }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return inMemoryStore.placeDemoBet({
        userId,
        betType: data.betType,
        totalStake: data.totalStake,
        selections: data.selections,
      })
    }
    throw error
  }
}

export async function cashOutBet(userId: string, input: unknown) {
  const { betId } = cashOutSchema.parse(input)

  try {
    return await prisma.$transaction(async (tx) => {
      const bet = await tx.demoBet.findFirst({
        where: { id: betId, userId },
      })

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

      // Credit cashout value to wallet
      const { wallet } = await creditWinnings(tx, {
        userId,
        amount: cashOutAmount,
        description: `Cashed out demo bet #${betId.slice(-6)}`,
      })

      // Update bet status
      const updatedBet = await tx.demoBet.update({
        where: { id: betId },
        data: {
          status: 'CASHED_OUT',
          actualReturn: cashOutAmount,
          cashOutAvailable: false,
          settledAt: new Date(),
        },
      })

      return {
        success: true,
        bet: updatedBet,
        newBalance: wallet.balance,
      }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return inMemoryStore.cashOutBet(userId, betId)
    }
    throw error
  }
}

export async function settleMarket(adminUserId: string, input: unknown) {
  const data = settleMarketSchema.parse(input)

  try {
    return await prisma.$transaction(async (tx) => {
      const admin = await tx.user.findUnique({
        where: { id: adminUserId },
      })
      if (!admin || admin.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required')
      }

      // Update market status
      await tx.bettingMarket.update({
        where: { id: data.marketId },
        data: { status: 'SETTLED' },
      })

      // Update options
      await tx.marketOption.updateMany({
        where: { marketId: data.marketId, id: data.winningOptionId },
        data: { status: 'WON' },
      })
      await tx.marketOption.updateMany({
        where: { marketId: data.marketId, id: { not: data.winningOptionId } },
        data: { status: 'LOST' },
      })

      // Create settlement record
      await tx.settlement.create({
        data: {
          marketId: data.marketId,
          winningOptionId: data.winningOptionId,
          settledByAdminId: adminUserId,
          note: data.note,
        },
      })

      // Log audit
      await tx.auditLog.create({
        data: {
          adminUserId,
          action: 'SETTLEMENT',
          targetType: 'MARKET',
          targetId: data.marketId,
          details: `Settled market ${data.marketId} with winning option ${data.winningOptionId}. Note: ${data.note || 'None'}`,
        },
      })

      return { success: true }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return inMemoryStore.settleMarket({
        adminUserId,
        marketId: data.marketId,
        winningOptionId: data.winningOptionId,
        note: data.note,
      })
    }
    throw error
  }
}

function isPrismaConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string; name?: string } | undefined
  return Boolean(
    err?.code === 'P1001' ||
    err?.message?.includes("Can't reach database server") ||
    err?.message?.includes('database server') ||
    err?.name === 'PrismaClientInitializationError'
  )
}
