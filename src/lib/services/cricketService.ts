import { prisma } from '@/lib/prisma'
import { inMemoryStore } from '@/lib/db-store'
import { CricketMatch, CricketFormat, BettingMarket } from '@/types/cricket'

export async function getAllMatches(): Promise<CricketMatch[]> {
  try {
    const matches = await prisma.cricketMatch.findMany({
      include: {
        team1: true,
        team2: true,
        markets: {
          include: {
            options: true,
          },
        },
      },
      orderBy: { matchDate: 'asc' },
    })

    if (matches.length === 0) {
      return inMemoryStore.matches
    }

    // Map Prisma models to CricketMatch interface
    return matches.map((m) => {
      const matchStatus =
        m.status === 'LIVE' ? 'live' : m.status === 'COMPLETED' ? 'completed' : 'upcoming'
      return {
        id: m.id,
        series: m.series,
        venue: m.venue,
        city: m.venue.split(',')[1]?.trim() || 'Venue',
        format: (m.format as unknown as CricketFormat) || 'T20',
        status: matchStatus,
        statusText: m.result || `${m.team1.shortName} vs ${m.team2.shortName}`,
        startTime: m.matchDate.toISOString(),
        teamHome: {
          id: m.team1.id,
          name: m.team1.name,
          shortName: m.team1.shortName,
          code: m.team1.code,
          color: '#1d4ed8',
          accentBg: '#1e3a8a',
        },
        teamAway: {
          id: m.team2.id,
          name: m.team2.name,
          shortName: m.team2.shortName,
          code: m.team2.code,
          color: '#eab308',
          accentBg: '#854d0e',
        },
        scores: {
          home: [],
          away: [],
        },
        markets: m.markets.map((mk) => ({
          id: mk.id,
          matchId: mk.matchId,
          name: mk.name,
          category: (mk.marketType as unknown as BettingMarket['category']) || 'MATCH_WINNER',
          status: (mk.status as unknown as BettingMarket['status']) || 'OPEN',
          options: mk.options.map((opt) => ({
            id: opt.id,
            label: opt.label,
            odds: opt.odds,
            isWinner: opt.status === 'WON',
          })),
        })),
      }
    })
  } catch {
    return inMemoryStore.matches
  }
}

export async function getMatchById(id: string): Promise<CricketMatch | null> {
  const matches = await getAllMatches()
  return matches.find((m) => m.id === id) || null
}
