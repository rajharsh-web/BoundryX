import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { inMemoryStore } from '@/lib/db-store'

export async function GET() {
  try {
    const session = await requireAuth()

    try {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: session.userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!wallet) {
        return NextResponse.json({
          balance: 0.0,
          transactions: [],
        })
      }

      return NextResponse.json({
        balance: wallet.balance,
        transactions: wallet.transactions.map((tx) => ({
          id: tx.id,
          amount: tx.amount,
          balanceAfter: tx.balanceAfter,
          type: tx.type,
          description: tx.description,
          adminAuditReason: tx.adminAuditReason,
          timestamp: tx.createdAt.toISOString(),
        })),
      })
    } catch {
      const wallet = inMemoryStore.getWalletByUserId(session.userId)
      const txs = inMemoryStore.transactions.filter((t) => t.walletId === wallet.id)
      return NextResponse.json({
        balance: wallet.balance,
        transactions: txs.map((tx) => ({
          id: tx.id,
          amount: tx.amount,
          balanceAfter: tx.balanceAfter,
          type: tx.type,
          description: tx.description,
          adminAuditReason: tx.adminAuditReason,
          timestamp: tx.createdAt,
        })),
      })
    }
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    return NextResponse.json(
      { error: err?.message || 'Unauthorized' },
      { status: 401 }
    )
  }
}
