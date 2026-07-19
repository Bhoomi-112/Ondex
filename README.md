# Ondex

A three-sided Web3 startup-funding marketplace on [Stellar](https://stellar.org) powered by Soroban smart contracts. Startups raise capital through milestone-based escrow, a jury of staked validators provides blind review, and investors co-decide fund release — all enforced on-chain.

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  @ondex/web  │─────▶│  @ondex/api  │─────▶│   Soroban    │
│  Next.js 15  │      │  Express 5   │      │  Contracts   │
│  Frontend    │      │  Backend     │      │  (Rust)      │
└──────────────┘      └──────┬───────┘      └──────┬───────┘
                             │                     │
                      ┌──────▼───────┐      ┌──────▼───────┐
                      │  PostgreSQL  │      │  Stellar     │
                      │  (off-chain) │      │  Testnet     │
                      └──────────────┘      └──────────────┘
```

### Monorepo Layout

```
ondex/
├── contracts/              # Soroban smart contracts (Rust workspace)
│   ├── jury_registry/      # Juror staking, blind voting, slashing
│   ├── identity_registry/  # Hybrid identity masking (hash commits)
│   └── escrow_contract/    # Milestone escrow + dispute resolution
├── packages/sdk/           # Auto-generated TypeScript contract bindings
├── apps/
│   ├── web/                # Next.js 15 App Router frontend
│   └── api/                # Express 5 backend + event indexer
└── scripts/                # Deployment & testnet funding scripts
```

## Smart Contracts

### jury_registry

Manages juror registration with real staking, blind case assignment, and majority voting.

- **Staking:** Jurors stake both XLM and platform tokens to be eligible
- **Assignment:** 5 jurors randomly assigned per case
- **Quorum:** 3-of-5 majority required to resolve
- **Slashing:** 50% stake slashed if vote contradicts documented majority under formal dispute

Key methods: `initialize`, `register`, `assign`, `vote`, `dispute`, `slash`, `get_case`, `juror_stake`

### identity_registry

Hybrid identity masking — on-chain stores only hash commitments, never PII.

- **Commit:** Store hash commitment for startup/jury identity
- **Reveal:** Resolves commitment to off-chain KYC record (only after case resolution)
- **Verify:** Confirms identity commitment is linked to a case

Key methods: `initialize`, `commit`, `link_case`, `reveal`, `verify`, `get_commitment`

### escrow_contract

Milestone-based escrow with layered release conditions.

- **Deposit:** Investors fund a campaign
- **Jury approval:** Jury majority vote triggers release eligibility
- **Dispute window:** 72-hour time-lock after jury approval
- **Investor override:** Investor-majority vote during dispute window to unblock release
- **Refund:** Startup can request refund if campaign fails

Key methods: `initialize`, `deposit`, `jury_approved`, `dispute`, `investor_vote`, `release`, `refund`, `get_campaign`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Rust + Soroban SDK 26.1 |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Express 5, TypeScript, Zod, Pino |
| Database | PostgreSQL via Prisma 7 |
| Stellar SDK | `@stellar/stellar-sdk` (JS: v16, API: v13) |
| Wallet | `@creit.tech/stellar-wallets-kit` v2.5 |
| Auth | SEP-10 Stellar authentication |
| Testing | Vitest, Playwright, Testing Library |
| Build | pnpm workspaces, TSX, Cargo |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Rust](https://rustup.rs/) with `wasm32v1-none` target
- [Stellar CLI](https://soroban.stellar.org/docs/getting-started/setup) (`stellar`)
- [Docker](https://www.docker.com/) or a running PostgreSQL instance

### Install

```bash
git clone https://github.com/Bhoomi-112/Ondex.git
cd Ondex
pnpm install
```

### Environment

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
DEPLOYER_SECRET=              # Stellar secret key for testnet deployment
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
HORIZON_URL=https://horizon-testnet.stellar.org
```

### Build Contracts

```bash
# Build WASM targets
pnpm build:contracts

# Deploy to testnet and record contract IDs
pnpm deploy
```

### Run Backend

```bash
# Set up database
cd apps/api
npx prisma generate
npx prisma db push

# Start development server
pnpm dev
```

The API runs at `http://localhost:3000` by default.

### Run Frontend

```bash
cd apps/web
pnpm dev
```

The frontend runs at `http://localhost:3001` by default.

## API Routes

All routes are prefixed with `/api/v1`.

| Route | Description |
|-------|------------|
| `/health` | Liveness check |
| `/ready` | Readiness check (DB + RPC) |
| `/auth/challenge` | Generate SEP-10 authentication challenge |
| `/auth/verify` | Verify signed SEP-10 challenge, create session |
| `/auth/session` | Get current session |
| `/auth/logout` | Destroy session |
| `/campaigns` | Campaign CRUD + funding operations |
| `/cases` | Jury case management |
| `/jurors` | Juror registration, staking, voting |
| `/identities` | Identity commit/reveal operations |
| `/notifications` | User notification management |

## Frontend Routes

| Route | Description |
|-------|------------|
| `/` | Landing page (marketing) |
| `/login` | Wallet connect sign-in |
| `/app/dashboard` | Role-redirect to appropriate dashboard |
| `/app/startup` | Startup dashboard — create campaign, view cases |
| `/app/jury` | Jury dashboard — view assigned cases, vote |
| `/app/investor` | Investor dashboard — browse campaigns, deposit |
| `/app/cases/[id]` | Case detail with vote tally, dispute actions |

## Testing

### Unit Tests

```bash
# Backend (59 tests)
cd apps/api && pnpm test

# Frontend component tests (45 tests)
cd apps/web && pnpm test

# Contracts
cargo test --workspace   # requires wasm32v1-none target
```

### E2E Tests

```bash
cd apps/web
pnpm test:e2e           # headless Playwright
pnpm test:e2e:ui        # interactive Playwright UI
```

## Design Decisions

- **Identity masking (hybrid):** On-chain stores only hash commitments — never PII. Real KYC records live off-chain, encrypted at rest, keyed to the commitment hash.
- **Escrow release (layered):** Jury sign-off is the base condition. A 72-hour dispute window follows. If disputed, investor-majority override resolves before funds move.
- **Jury economics (real staking + slashing):** Jurors stake real assets. Formal disputes can slash 50% of stake for votes contradicting documented majority outcomes.
- **Chain is source of truth:** Off-chain systems (backend DB) index and cache for querying, but never store funds-relevant state as authoritative.

## Vercel Deployment

### 1. Connect Repository

Go to [vercel.com/new](https://vercel.com/new), import your GitHub repo, and select `Ondex`.

### 2. Configure Project

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/web` |
| **Framework** | Next.js (auto-detected) |
| **Build Command** | `cd ../.. && pnpm --filter @ondex/web build` |
| **Install Command** | `cd ../.. && pnpm install` |
| **Output Directory** | `.next` |

### 3. Environment Variables

Set these in the Vercel dashboard under **Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `SOROBAN_RPC_URL` | `https://soroban-testnet.stellar.org` |
| `SOROBAN_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` |
| `HORIZON_URL` | `https://horizon-testnet.stellar.org` |
| `NEXT_PUBLIC_JURY_REGISTRY_CONTRACT` | (optional) Jury registry contract ID for self-registration |

These must also be declared in `turbo.json` under the `build` task's `env` array (already configured).

### 4. Deploy

Push to `main` (or the branch you connected). Vercel will auto-deploy. The `vercel.json` at the repo root configures the build pipeline — only changes to `apps/web/`, `packages/`, or config files trigger a new deployment.

## License

Private — All rights reserved.
