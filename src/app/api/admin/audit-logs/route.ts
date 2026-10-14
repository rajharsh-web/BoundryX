import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAuditLogs } from '@/lib/services/adminService'

export async function GET() {
  try {
    await requireAdmin()
    const logs = await getAuditLogs()
    return NextResponse.json({ logs })
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
