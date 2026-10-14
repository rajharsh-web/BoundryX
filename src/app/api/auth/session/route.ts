import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { inMemoryStore } from '@/lib/db-store'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  let balance = 0.0

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.userId },
    })
    if (wallet) {
      balance = wallet.balance
    } else {
      const memWallet = inMemoryStore.getWalletByUserId(session.userId)
      balance = memWallet.balance
    }
  } catch {
    const memWallet = inMemoryStore.getWalletByUserId(session.userId)
    balance = memWallet.balance
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      username: session.username,
      name: session.name,
      role: session.role,
      status: session.status,
      balance,
    },
  })
}
