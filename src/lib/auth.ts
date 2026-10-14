import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'boundaryx_session'

const DEFAULT_SECRET = 'boundaryx_super_secure_demo_secret_key_minimum_32_chars_long_2026'
const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET)

export interface SessionPayload {
  userId: string
  email: string
  username: string
  name: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
}

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a plain text password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a cryptographically signed JWT session token
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      username: payload.username as string,
      name: payload.name as string,
      role: payload.role as 'USER' | 'ADMIN',
      status: payload.status as 'ACTIVE' | 'SUSPENDED',
    }
  } catch {
    return null
  }
}

/**
 * Set the session cookie in response (for route handlers or server actions)
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Clear the session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

/**
 * Retrieve current session from incoming request cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) return null
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

/**
 * Enforce authenticated user access
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('UNAUTHORIZED: Authentication required')
  }
  if (session.status === 'SUSPENDED') {
    throw new Error('FORBIDDEN: Account is suspended')
  }
  return session
}

/**
 * Enforce administrator access
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth()
  if (session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN: Admin privileges required')
  }
  return session
}
