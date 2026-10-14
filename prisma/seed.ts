import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { mockMatches } from '../src/mock/cricketData'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Seeding BoundaryX Database ---')

  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@boundaryx.demo'
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'BoundaryX@Admin2026!'
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)

  // 1. Create or upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      email: adminEmail,
      username: 'admin',
      name: 'Super Administrator',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      wallet: {
        create: {
          balance: 10000.0, // Admin virtual testing balance
        },
      },
    },
    include: { wallet: true },
  })
  console.log(`Created admin user: ${admin.email} (Role: ${admin.role})`)

  // 2. Create demo regular user (MUST START WITH STRICTLY 0 CREDITS)
  const demoEmail = 'user@boundaryx.demo'
  const demoPasswordHash = await bcrypt.hash('CricketFan@2026', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      username: 'cricketfan',
      name: 'Demo Cricket Fan',
      passwordHash: demoPasswordHash,
      role: 'USER',
      status: 'ACTIVE',
      wallet: {
        create: {
          balance: 0.0, // Strictly 0 virtual credits
        },
      },
    },
    include: { wallet: true },
  })
  console.log(`Created demo user: ${demoUser.email} with strictly ${demoUser.wallet?.balance} credits`)

  // 3. Seed Teams and Matches
  for (const match of mockMatches) {
    const t1 = await prisma.team.upsert({
      where: { code: match.teamHome.code },
      update: {},
      create: {
        name: match.teamHome.name,
        shortName: match.teamHome.shortName,
        code: match.teamHome.code,
      },
    })

    const t2 = await prisma.team.upsert({
      where: { code: match.teamAway.code },
      update: {},
      create: {
        name: match.teamAway.name,
        shortName: match.teamAway.shortName,
        code: match.teamAway.code,
      },
    })

    const existingMatch = await prisma.cricketMatch.findUnique({
      where: { id: match.id },
    })

    if (!existingMatch) {
      const matchFormat =
        match.format === 'ODI' ? 'ODI' : match.format === 'TEST' ? 'TEST' : 'T20'
      const matchStatus =
        match.status === 'live'
          ? 'LIVE'
          : match.status === 'completed'
            ? 'COMPLETED'
            : 'UPCOMING'

      await prisma.cricketMatch.create({
        data: {
          id: match.id,
          matchNumber: match.id,
          series: match.series,
          venue: match.venue,
          format: matchFormat,
          status: matchStatus,
          team1Id: t1.id,
          team2Id: t2.id,
          matchDate: new Date(match.startTime),
          result: match.statusText,
          markets: {
            create: match.markets.map((mk) => ({
              id: mk.id,
              name: mk.name,
              marketType: mk.category || 'MATCH_WINNER',
              status: mk.status === 'SETTLED' ? 'SETTLED' : 'OPEN',
              options: {
                create: mk.options.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  odds: opt.odds,
                  status: opt.isWinner ? 'WON' : 'ACTIVE',
                })),
              },
            })),
          },
        },
      })
      console.log(`Seeded match: ${match.id} (${match.teamHome.shortName} vs ${match.teamAway.shortName})`)
    }
  }

  // 4. Create bootstrap audit log
  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      action: 'SYSTEM_BOOTSTRAP',
      targetType: 'SYSTEM',
      targetId: 'SEED_01',
      details: 'Initial database bootstrap completed with verified zero-credit user policy.',
    },
  })

  console.log('--- BoundaryX Seeding Complete ---')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
