import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { inMemoryStore } from '@/lib/db-store'

export async function GET() {
  try {
    const session = await requireAuth()

    try {
      const bets = await prisma.demoBet.findMany({
        where: { userId: session.userId },
        include: { selections: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ bets })
    } catch {
      const bets = inMemoryStore.bets.filter((b) => b.userId === session.userId)
      return NextResponse.json({ bets })
    }
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    return NextResponse.json(
      { error: err?.message || 'Unauthorized' },
      { status: 401 }
    )
  }
}
