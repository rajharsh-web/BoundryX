export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logo: {
    text: string;
    badge: string;
    icon: string;
  };
  currency: {
    symbol: string;
    code: string;
    isDemoOnly: boolean;
  };
  navigation: {
    main: Array<{ name: string; href: string; icon?: string }>;
    mobile: Array<{ name: string; href: string; icon: string }>;
    admin: Array<{ name: string; href: string; icon: string }>;
  };
  footer: {
    quickLinks: Array<{ name: string; href: string }>;
    legalLinks: Array<{ name: string; href: string }>;
    demoNotice: string;
  };
  theme: {
    primaryColor: string;
    accentGreen: string;
    bgDark: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "BoundaryX",
  shortName: "BX",
  tagline: "Live Cricket Center & Simulated Demo Wagering Platform",
  description:
    "Real-time cricket scores, comprehensive ball-by-ball commentary, and risk-free simulated demo wagering experience.",
  logo: {
    text: "BoundaryX",
    badge: "DEMO",
    icon: "ShieldAlert",
  },
  currency: {
    symbol: "pts",
    code: "DEMO",
    isDemoOnly: true,
  },
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Cricket", href: "/cricket" },
      { name: "Live", href: "/live" },
      { name: "Upcoming", href: "/upcoming" },
      { name: "Results", href: "/results" },
    ],
    mobile: [
      { name: "Home", href: "/", icon: "Home" },
      { name: "Cricket", href: "/cricket", icon: "Trophy" },
      { name: "Live", href: "/live", icon: "Radio" },
      { name: "My Demo Bets", href: "/demo-bets", icon: "ReceiptText" },
      { name: "Profile", href: "/profile", icon: "User" },
    ],
    admin: [
      { name: "Overview", href: "/admin", icon: "LayoutDashboard" },
      { name: "Matches", href: "/admin/matches", icon: "Activity" },
      { name: "Markets", href: "/admin/markets", icon: "TrendingUp" },
      { name: "Users", href: "/admin/users", icon: "Users" },
      { name: "Settlements", href: "/admin/settlements", icon: "CheckCircle2" },
      { name: "Demo Credits", href: "/admin/credits", icon: "Coins" },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: "ScrollText" },
    ],
  },
  footer: {
    quickLinks: [
      { name: "All Matches", href: "/cricket" },
      { name: "Live Scorecards", href: "/live" },
      { name: "Upcoming Fixtures", href: "/upcoming" },
      { name: "Match Archive", href: "/results" },
      { name: "Demo Bet Slip", href: "/demo-bets" },
      { name: "Demo Wallet", href: "/wallet" },
      { name: "Admin Portal", href: "/admin" },
    ],
    legalLinks: [
      { name: "About BoundaryX", href: "/#about" },
      { name: "Demo Disclaimer", href: "/wallet#disclaimer" },
      { name: "Responsible Simulation", href: "/profile#limits" },
      { name: "Terms of Use", href: "/#terms" },
      { name: "Privacy Policy", href: "/#privacy" },
    ],
    demoNotice:
      "STRICT DEMO DISCLAIMER: BoundaryX is purely an educational cricket statistics and simulated prediction entertainment platform. All points, credits, odds, and balances on this website are 100% simulated DEMO credits with ZERO monetary value. This platform does NOT accept real deposits, does NOT process withdrawals, and does NOT offer real-money gambling.",
  },
  theme: {
    primaryColor: "#10b981",
    accentGreen: "#10b981",
    bgDark: "#0b0f14",
  },
};
