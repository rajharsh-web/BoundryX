import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, signSessionToken, setSessionCookie, clearSessionCookie, SessionPayload } from '@/lib/auth'
import { registerSchema, loginSchema } from '@/lib/validations'
import { inMemoryStore } from '@/lib/db-store'

export async function registerUser(input: unknown) {
  const data = registerSchema.parse(input)
  const passwordHash = await hashPassword(data.password)

  try {
    // Try Prisma transactional insert
    return await prisma.$transaction(async (tx) => {
      const existingEmail = await tx.user.findUnique({
        where: { email: data.email },
      })
      if (existingEmail) {
        throw new Error('Email is already registered')
      }

      const existingUsername = await tx.user.findUnique({
        where: { username: data.username },
      })
      if (existingUsername) {
        throw new Error('Username is already taken')
      }

      const user = await tx.user.create({
        data: {
          email: data.email,
          username: data.username,
          name: data.name,
          passwordHash,
          role: 'USER',
          status: 'ACTIVE',
        },
      })

      // MANDATORY PRODUCT RULE: Every new user starts with exactly 0 virtual credits.
      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 0.0,
        },
      })

      const sessionPayload: SessionPayload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        status: user.status,
      }

      const token = await signSessionToken(sessionPayload)
      await setSessionCookie(token)

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          balance: wallet.balance,
        },
        token,
      }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      // Fallback in-memory
      const { user, wallet } = inMemoryStore.registerUser({
        email: data.email,
        username: data.username,
        name: data.name,
        passwordHash,
      })

      const sessionPayload: SessionPayload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        status: user.status,
      }

      const token = await signSessionToken(sessionPayload)
      await setSessionCookie(token)

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          balance: wallet.balance,
        },
        token,
      }
    }
    throw error
  }
}

export async function loginUser(input: unknown) {
  const data = loginSchema.parse(input)

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.identifier.toLowerCase() },
          { username: data.identifier },
        ],
      },
      include: { wallet: true },
    })

    if (!user) {
      throw new Error('Invalid email/username or password')
    }

    const isValid = await verifyPassword(data.password, user.passwordHash)
    if (!isValid) {
      throw new Error('Invalid email/username or password')
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account is suspended. Please contact support.')
    }

    const sessionPayload: SessionPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      status: user.status,
    }

    const token = await signSessionToken(sessionPayload)
    await setSessionCookie(token)

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        balance: user.wallet?.balance ?? 0.0,
      },
      token,
    }
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      // Fallback in-memory
      const user = inMemoryStore.getUserByEmailOrUsername(data.identifier)
      if (!user) {
        throw new Error('Invalid email/username or password')
      }

      const isValid = await verifyPassword(data.password, user.passwordHash)
      if (!isValid) {
        throw new Error('Invalid email/username or password')
      }

      if (user.status === 'SUSPENDED') {
        throw new Error('Your account is suspended. Please contact support.')
      }

      const wallet = inMemoryStore.getWalletByUserId(user.id)
      const sessionPayload: SessionPayload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        status: user.status,
      }

      const token = await signSessionToken(sessionPayload)
      await setSessionCookie(token)

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          balance: wallet.balance,
        },
        token,
      }
    }
    throw error
  }
}

export async function logoutUser() {
  await clearSessionCookie()
  return { success: true }
}

function isPrismaConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string; name?: string } | undefined
  return Boolean(
    err?.code === 'P1001' ||
    err?.message?.includes("Can't reach database server") ||
    err?.message?.includes('database server') ||
    err?.name === 'PrismaClientInitializationError'
  )
}
