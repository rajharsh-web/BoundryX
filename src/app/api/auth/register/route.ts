import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/services/authService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await registerUser(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    return NextResponse.json(
      { error: err?.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
