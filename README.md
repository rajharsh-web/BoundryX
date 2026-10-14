# BoundaryX — Cricket Information & Virtual-Credit Simulation Platform

BoundaryX is a modern cricket information platform and virtual-credit simulation website built with Next.js 16 App Router, TypeScript (strict mode), Tailwind CSS v4, PostgreSQL, Prisma ORM, and secure server-enforced authentication.

> **CRITICAL COMPLIANCE NOTICE**: BoundaryX is strictly an informational and educational virtual-credit simulation platform. There is **NO real-money wagering, NO cash deposits, NO withdrawals, NO payment gateway integrations, and NO monetary prizes**. All odds and credits are strictly simulated for entertainment and demonstration purposes.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.4.0 (App Router, Turbopack, Partial Prerendering, Cache Components)
- **Language**: TypeScript 5 (Strict Mode enabled)
- **Styling**: Tailwind CSS v4 (Dark charcoal `#0e141a` aesthetic with emerald `#10b981` accents)
- **Database & ORM**: PostgreSQL with Prisma ORM 6.19
- **Authentication**: Cryptographically signed JWT session cookies (`jose`), password hashing (`bcryptjs`), Next.js 16 Proxy (`src/proxy.ts`)
- **Server Validation**: Zod schema validation on all inputs and sensitive operations
- **Testing**: Vitest with unit and integration test suite

---

## 🔒 Virtual Credit Policy & Governance Rules

BoundaryX enforces strict virtual credit rules:

1. **Zero Welcome Credits**: Every registered user starts with **strictly 0 virtual demo credits**.
2. **No Faucets or Automatic Refills**: Automatic bonuses, daily claim buttons, and faucet refills are completely prohibited and eliminated.
3. **Admin-Only Manual Allocation**: Only an authenticated user with the `ADMIN` role can manually grant virtual demo credits to a specific user.
4. **Mandatory Audit Justification**: Every credit grant requires a mandatory audit explanation reason (minimum 5 characters) that is permanently recorded in the audit log.
5. **Atomic Balance Transactions**: All credit movements (admin grants, bet placement deductions, early cashouts, and winning settlements) execute inside database transactions.
6. **Server-Enforced Authorization**: All administrative endpoints (`/admin/*` and `/api/admin/*`) strictly verify administrator privileges both via Next.js Proxy (`src/proxy.ts`) and on server API handlers (`requireAdmin()`). Non-admin users are rejected with `401 Unauthorized` or `403 Forbidden`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20.9+ or higher
- PostgreSQL database instance (or use local/cloud PostgreSQL connection)

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Review the values in `.env`:
```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boundaryx?schema=public"

# Authentication & Session Security (minimum 32 characters)
AUTH_SECRET="boundaryx_super_secure_demo_secret_key_minimum_32_chars_long_2026"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Initial Admin Bootstrap Credentials
ADMIN_BOOTSTRAP_EMAIL="admin@boundaryx.demo"
ADMIN_BOOTSTRAP_PASSWORD="BoundaryX@Admin2026!"
ADMIN_BOOTSTRAP_SECRET="boundaryx_bootstrap_admin_secret_key_2026"
```

### 3. Generate Prisma Client & Migrate Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations on your PostgreSQL database
npx prisma migrate dev --name init
```

### 4. Seed Database

Populate initial fictional cricket matches, betting markets, and verified admin/demo users:

```bash
npm run prisma:seed
```

### 5. (Optional) Bootstrap / Elevate Admin User via CLI

Create or elevate an administrator account directly via CLI:

```bash
npm run bootstrap:admin -- admin@boundaryx.demo "BoundaryX@Admin2026!" "Super Admin"
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated test suite covering registration, credit policies, authorization, and settlements:

```bash
npm run test
```

### Test Scenarios Covered (`tests/phase2.test.ts`):
1. **User Registration Zero Balance**: Verified new user registers with strictly 0 credits.
2. **Self-Grant Prevention**: Verified regular users cannot grant themselves credits (rejected with authorization error).
3. **Admin Credit Grant**: Verified admin can grant credits with an audit reason, updating balance and recording audit log.
4. **Audit Reason Validation**: Verified credit grant fails when reason is missing or fewer than 5 characters.
5. **Authorization Verification**: Verified regular user sessions fail admin role verification.
6. **Atomic Bet Deduction**: Verified bet placement immediately and atomically deducts stake from user balance.
7. **Insufficient Balance Enforcement**: Verified bet placement fails when balance is insufficient.
8. **Market Settlement & Payout**: Verified market settlement credits payouts to winning bettors and records transaction ledger entries.

---

## 📂 Key Architecture & File Structure

```
├── prisma/
│   ├── schema.prisma          # PostgreSQL models (User, Wallet, CreditTransaction, CricketMatch, etc.)
│   └── seed.ts                # Database seed script
├── scripts/
│   └── bootstrap-admin.ts     # CLI script to bootstrap an administrator
├── src/
│   ├── proxy.ts               # Next.js 16 route protection proxy for /admin routes
│   ├── lib/
│   │   ├── prisma.ts          # Singleton PrismaClient instance
│   │   ├── auth.ts            # JWT session cookies, password hashing & requireAdmin()
│   │   ├── db-store.ts        # Resilient in-memory fallback store with transactional semantics
│   │   ├── validations/       # Zod schemas for auth, credits, bets, settlements
│   │   └── services/          # Server services (walletService, authService, betService, adminService)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # /register, /login, /logout, /session
│   │   │   ├── admin/         # /grant-credits, /users, /audit-logs, /settle
│   │   │   ├── bets/          # /place, /cashout, /my-bets
│   │   │   └── wallet/        # /wallet balance and transaction history
│   │   ├── admin/             # Server-protected admin console routes
│   │   ├── login/             # Credentials authentication with quick demo test presets
│   │   ├── register/          # User registration enforcing 0 initial credits
│   │   ├── wallet/            # User demo credit balance & transaction ledger
│   │   └── ...                # Cricket fixtures, live match center & demo bet slip
│   └── context/
│       └── DemoBettingContext.tsx # Client-side slip state synchronized with server auth/wallet
└── tests/
    └── phase2.test.ts         # Automated Vitest test suite
```

---

## 🔑 Default Demo Accounts

For local demonstration and evaluation:

| Account | Email | Password | Role | Starting Balance |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@boundaryx.demo` | `BoundaryX@Admin2026!` | `ADMIN` | 10,000 PTS (Testing) |
| **Standard User** | `user@boundaryx.demo` | `CricketFan@2026` | `USER` | **0 PTS** (Strict policy) |

---

## 📜 Verification Checklist

- [x] `npm run lint` passes cleanly with zero errors or warnings
- [x] `npm run test` passes all 8 integration/unit test scenarios
- [x] `npm run build` compiles production Turbopack bundle with all 33 routes
- [x] Strict zero-credit policy for all newly registered users
- [x] Server-side authorization verification on all admin routes and APIs
- [x] Mandatory audit justification logged for every manual credit grant
