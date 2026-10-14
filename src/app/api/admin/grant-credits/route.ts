import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { grantCreditsSchema } from '@/lib/validations'
import { adminGrantCredits } from '@/lib/services/walletService'

export async function POST(request: Request) {
  try {
    const adminSession = await requireAdmin()
    const body = await request.json()
    const validData = grantCreditsSchema.parse(body)

    const result = await adminGrantCredits({
      adminUserId: adminSession.userId,
      adminName: adminSession.name,
      targetUserId: validData.targetUserId,
      amount: validData.amount,
      reason: validData.reason,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    const message = err?.message || 'Failed to grant credits'
    const isUnauthorized =
      message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN')
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 403 : 400 }
    )
  }
}
