import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_COOKIE_NAME = 'boundaryx_session'
const DEFAULT_SECRET = 'boundaryx_super_secure_demo_secret_key_minimum_32_chars_long_2026'
const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes server-side
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('error', 'login_required')
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { payload } = await jwtVerify(token, secretKey)
      if (payload.role !== 'ADMIN') {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('error', 'admin_required')
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      // Invalid or expired token
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect user-only pages
  if (pathname.startsWith('/wallet') || pathname.startsWith('/profile') || pathname.startsWith('/demo-bets')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      await jwtVerify(token, secretKey)
    } catch {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/wallet/:path*', '/profile/:path*', '/demo-bets/:path*'],
}
