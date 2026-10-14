import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function bootstrapAdmin() {
  const email = process.argv[2] || process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@boundaryx.demo'
  const password = process.argv[3] || process.env.ADMIN_BOOTSTRAP_PASSWORD || 'BoundaryX@Admin2026!'
  const name = process.argv[4] || 'System Administrator'
  const username = email.split('@')[0]

  console.log(`\n========================================`)
  console.log(`  BoundaryX Admin Bootstrap CLI`)
  console.log(`========================================`)
  console.log(`Target Email:    ${email}`)
  console.log(`Target Username: ${username}`)

  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash,
    },
    create: {
      email,
      username,
      name,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      wallet: {
        create: {
          balance: 10000.0,
        },
      },
    },
    include: { wallet: true },
  })

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      action: 'BOOTSTRAP_ADMIN',
      targetType: 'USER',
      targetId: admin.id,
      details: `Admin account bootstrapped or elevated via CLI for ${email}`,
    },
  })

  console.log(`\n[SUCCESS] Administrator account ready:`)
  console.log(`  ID:    ${admin.id}`)
  console.log(`  Email: ${admin.email}`)
  console.log(`  Role:  ${admin.role}`)
  console.log(`========================================\n`)
}

bootstrapAdmin()
  .catch((err) => {
    console.error('[ERROR] Bootstrap failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
