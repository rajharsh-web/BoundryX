import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { placeBet } from '@/lib/services/betService'

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const result = await placeBet(session.userId, body)
    return NextResponse.json(result, { status: 201 })
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    const message = err?.message || 'Failed to place demo bet'
    const isUnauthorized =
      message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN')
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 401 : 400 }
    )
  }
}
