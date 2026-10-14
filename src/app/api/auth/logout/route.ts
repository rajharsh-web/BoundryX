import { NextResponse } from 'next/server'
import { logoutUser } from '@/lib/services/authService'

export async function POST() {
  await logoutUser()
  return NextResponse.json({ success: true })
}
