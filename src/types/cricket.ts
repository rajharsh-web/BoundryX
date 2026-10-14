export type MatchStatus = 'live' | 'upcoming' | 'completed' | 'delayed' | 'innings-break';

export type CricketFormat = 'T20' | 'ODI' | 'TEST' | 'THE_HUNDRED';

export interface CricketTeam {
  id: string;
  name: string;
  shortName: string;
  code: string;
  color: string;
  flagEmoji?: string;
  accentBg: string;
}

export interface InningsScore {
  teamId: string;
  inningsNumber: number;
  runs: number;
  wickets: number;
  overs: number;
  isCompleted?: boolean;
  isDeclared?: boolean;
}

export interface BallCommentary {
  id: string;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  isWicket: boolean;
  wicketType?: string;
  isBoundary: boolean;
  boundaryType?: 'FOUR' | 'SIX';
  commentaryText: string;
  timestamp: string;
}

export interface PlayerScorecard {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
  isNotOut?: boolean;
}

export interface BowlerScorecard {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface MarketOption {
  id: string;
  label: string;
  odds: number;
  isSuspended?: boolean;
  isWinner?: boolean;
}

export interface BettingMarket {
  id: string;
  matchId: string;
  name: string;
  category: 'MATCH_WINNER' | 'TOTAL_RUNS' | 'TOP_BATSMAN' | 'NEXT_OVER' | 'PLAYER_PERFORMANCE';
  description?: string;
  status: 'OPEN' | 'SUSPENDED' | 'SETTLED' | 'VOID';
  options: MarketOption[];
  settledOptionId?: string;
}

export interface CricketMatch {
  id: string;
  series: string;
  format: CricketFormat;
  status: MatchStatus;
  statusText: string;
  startTime: string;
  venue: string;
  city: string;
  tossWinner?: string;
  tossDecision?: 'bat' | 'bowl';
  teamHome: CricketTeam;
  teamAway: CricketTeam;
  scores: {
    home: InningsScore[];
    away: InningsScore[];
  };
  currentRunRate?: number;
  requiredRunRate?: number;
  target?: number;
  winProbability?: {
    home: number;
    away: number;
  };
  recentBalls?: string[]; // e.g. ["1", "4", "W", "0", "6", "1"]
  commentary?: BallCommentary[];
  batsmenAtCrease?: Array<{
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    onStrike: boolean;
  }>;
  currentBowler?: {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
  };
  scorecards?: {
    innings1: {
      teamName: string;
      batting: PlayerScorecard[];
      bowling: BowlerScorecard[];
    };
    innings2?: {
      teamName: string;
      batting: PlayerScorecard[];
      bowling: BowlerScorecard[];
    };
  };
  markets: BettingMarket[];
  result?: {
    winner?: string; // team id of winner
    margin?: string; // e.g. "5 wickets" or "24 runs"
    description?: string;
  };
}

export interface BetSlipItem {
  id: string; // generated unique slip item id
  matchId: string;
  matchTitle: string;
  marketId: string;
  marketName: string;
  optionId: string;
  optionLabel: string;
  odds: number;
  stake: number;
}

export interface PlacedDemoBet {
  id: string;
  placedAt: string;
  matchId: string;
  matchTitle: string;
  marketName: string;
  selection: string;
  odds: number;
  stake: number;
  potentialPayout: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'VOID' | 'CASHED_OUT';
  settledAt?: string;
  payoutAmount?: number;
}

export interface CreditTransaction {
  id: string;
  timestamp: string;
  type: 'ADMIN_GRANT' | 'BET_PLACED' | 'BET_WON' | 'BET_CASHOUT';
  amount: number;
  balanceAfter: number;
  description: string;
  actor?: string;
  targetUser?: string;
  reason?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  demoBalance: number;
  totalBets: number;
  status: 'active' | 'suspended';
  joinedDate: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  target: string;
  targetUser?: string;
  amount?: number;
  reason?: string;
  details: string;
  ipAddress: string;
}
