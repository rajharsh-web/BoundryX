import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { settleMarket } from '@/lib/services/betService'

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const result = await settleMarket(admin.userId, body)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    const message = err?.message || 'Settlement failed'
    const isUnauthorized =
      message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN')
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 403 : 400 }
    )
  }
}
