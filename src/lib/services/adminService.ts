import { prisma } from '@/lib/prisma'
import { inMemoryStore } from '@/lib/db-store'
import { toggleUserStatusSchema } from '@/lib/validations'

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      include: { wallet: true },
      orderBy: { createdAt: 'desc' },
    })
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      name: u.name,
      role: u.role,
      status: u.status,
      balance: u.wallet?.balance ?? 0.0,
      createdAt: u.createdAt.toISOString(),
    }))
  } catch {
    return inMemoryStore.getAllUsers()
  }
}

export async function getAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { adminUser: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return logs.map((l) => ({
      id: l.id,
      adminUserId: l.adminUserId,
      adminName: l.adminUser?.name || 'Administrator',
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      details: l.details,
      ipAddress: l.ipAddress || '127.0.0.1',
      timestamp: l.createdAt.toISOString(),
    }))
  } catch {
    return inMemoryStore.auditLogs.map((l) => ({
      id: l.id,
      adminUserId: l.adminUserId,
      adminName: l.adminName,
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      details: l.details,
      ipAddress: l.ipAddress || '127.0.0.1',
      timestamp: l.createdAt,
    }))
  }
}

export async function updateUserStatus(adminUserId: string, input: unknown) {
  const data = toggleUserStatusSchema.parse(input)

  try {
    return await prisma.$transaction(async (tx) => {
      const admin = await tx.user.findUnique({
        where: { id: adminUserId },
      })
      if (!admin || admin.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required')
      }

      if (adminUserId === data.userId) {
        throw new Error('Administrators cannot modify their own status')
      }

      const updatedUser = await tx.user.update({
        where: { id: data.userId },
        data: { status: data.status },
      })

      await tx.auditLog.create({
        data: {
          adminUserId,
          action: 'USER_UPDATE',
          targetType: 'USER',
          targetId: data.userId,
          details: `Changed status to ${data.status}. Reason: "${data.reason}"`,
        },
      })

      return { success: true, user: updatedUser }
    })
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return inMemoryStore.toggleUserStatus(adminUserId, data.userId, data.status, data.reason)
    }
    throw error
  }
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
