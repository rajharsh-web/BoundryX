import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/services/authService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await loginUser(body)
    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    return NextResponse.json(
      { error: err?.message || 'Login failed' },
      { status: 401 }
    )
  }
}
