import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAdminUsers, updateUserStatus } from '@/lib/services/adminService'

export async function GET() {
  try {
    await requireAdmin()
    const users = await getAdminUsers()
    return NextResponse.json({ users })
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    const message = err?.message || 'Access denied'
    const isUnauthorized =
      message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN')
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const result = await updateUserStatus(admin.userId, body)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined
    const message = err?.message || 'Failed to update user status'
    const isUnauthorized =
      message.includes('UNAUTHORIZED') || message.includes('FORBIDDEN')
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 403 : 400 }
    )
  }
}
