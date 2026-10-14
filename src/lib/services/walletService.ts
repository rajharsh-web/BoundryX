import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export interface GrantCreditParams {
  adminUserId: string
  adminName: string
  targetUserId: string
  amount: number
  reason: string
}

export interface DeductStakeParams {
  userId: string
  amount: number
  description: string
}

export interface CreditWinningsParams {
  userId: string
  amount: number
  description: string
}

/**
 * Admin manually grants virtual demo credits to a target user.
 * Enforces:
 * - Admin authorization
 * - Mandatory audit reason
 * - Atomic database transaction
 * - Audit log creation
 * - CreditTransaction logging
 */
export async function adminGrantCredits(params: GrantCreditParams) {
  const { adminUserId, adminName, targetUserId, amount, reason } = params

  if (amount <= 0) {
    throw new Error('Grant amount must be strictly greater than 0')
  }
  if (!reason || reason.trim().length < 5) {
    throw new Error('Mandatory audit reason must be at least 5 characters')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify admin exists and is ACTIVE with ADMIN role
      const admin = await tx.user.findUnique({
        where: { id: adminUserId },
      })
      if (!admin || admin.role !== 'ADMIN' || admin.status !== 'ACTIVE') {
        throw new Error('Unauthorized: Only active administrators can grant demo credits')
      }

      // 2. Verify target user exists
      const targetUser = await tx.user.findUnique({
        where: { id: targetUserId },
        include: { wallet: true },
      })
      if (!targetUser) {
        throw new Error('Target user not found')
      }

      let wallet = targetUser.wallet
      if (!wallet) {
        // Create wallet if absent (starts at 0)
        wallet = await tx.wallet.create({
          data: {
            userId: targetUserId,
            balance: 0.0,
          },
        })
      }

      // 3. Increment wallet balance
      const newBalance = wallet.balance + amount
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      })

      // 4. Create CreditTransaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          balanceAfter: newBalance,
          type: 'ADMIN_GRANT',
          description: `Admin manual grant of ${amount} virtual demo credits by ${adminName || admin.name}`,
          adminAuditReason: reason.trim(),
          adminUserId,
        },
      })

      // 5. Create AuditLog entry
      const auditLog = await tx.auditLog.create({
        data: {
          adminUserId,
          action: 'CREDIT_GRANT',
          targetType: 'USER_WALLET',
          targetId: targetUserId,
          details: `Admin ${adminName || admin.name} granted ${amount} demo credits to user "${targetUser.username}" (${targetUser.email}). Reason: "${reason.trim()}"`,
        },
      })

      return {
        success: true,
        newBalance: updatedWallet.balance,
        transaction,
        auditLog,
      }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return fallbackAdminGrant(params)
    }
    throw error
  }
}

/**
 * Deduct credits from user wallet when placing a demo bet.
 * Runs atomically in transaction.
 */
export async function deductCreditsForBet(txOrPrisma: Prisma.TransactionClient | typeof prisma, params: DeductStakeParams) {
  const { userId, amount, description } = params

  const wallet = await txOrPrisma.wallet.findUnique({
    where: { userId },
  })

  if (!wallet) {
    throw new Error('User wallet not found')
  }

  if (wallet.balance < amount) {
    throw new Error(`Insufficient demo credits. Balance is ${wallet.balance}, required ${amount}`)
  }

  const newBalance = wallet.balance - amount
  const updatedWallet = await txOrPrisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: newBalance },
  })

  const transaction = await txOrPrisma.creditTransaction.create({
    data: {
      walletId: wallet.id,
      amount: -amount,
      balanceAfter: newBalance,
      type: 'BET_PLACED',
      description,
    },
  })

  return { wallet: updatedWallet, transaction }
}

/**
 * Credit winnings or refunds to user wallet.
 */
export async function creditWinnings(
  txOrPrisma: Prisma.TransactionClient | typeof prisma,
  params: CreditWinningsParams
) {
  const { userId, amount, description } = params

  const wallet = await txOrPrisma.wallet.findUnique({
    where: { userId },
  })

  if (!wallet) {
    throw new Error('User wallet not found')
  }

  const newBalance = wallet.balance + amount
  const updatedWallet = await txOrPrisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: newBalance },
  })

  const transaction = await txOrPrisma.creditTransaction.create({
    data: {
      walletId: wallet.id,
      amount,
      balanceAfter: newBalance,
      type: 'BET_WON',
      description,
    },
  })

  return { wallet: updatedWallet, transaction }
}

// In-memory fallback cache for development/testing when PostgreSQL is offline
import { inMemoryStore } from '@/lib/db-store'

function isPrismaConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string; name?: string } | undefined
  return Boolean(
    err?.code === 'P1001' ||
    err?.message?.includes("Can't reach database server") ||
    err?.message?.includes('database server') ||
    err?.name === 'PrismaClientInitializationError'
  )
}

function fallbackAdminGrant(params: GrantCreditParams) {
  return inMemoryStore.adminGrantCredits(params)
}
