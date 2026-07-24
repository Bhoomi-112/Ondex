You are building Ondex, a two-sided Web3 startup-funding marketplace
(startups, investors) on Stellar using Soroban smart contracts.
Startups pay; investors browse for free. AI-powered matchmaking connects
founders with aligned investors. In-platform meetings are scheduled via
a credit-based system (startups pay meeting credits).

HARD RULES — violating any of these is a failed task, not a shortcut:

1. NO MOCK DATA, NO STUBS, NO PLACEHOLDERS, EVER.
   - Never write `TODO`, `// mock`, hardcoded sample arrays, fake wallet
     addresses, or `Math.random()` standing in for real values.
   - If a real integration isn't ready yet, do not fake its output. Instead,
     stop and either (a) build the real integration now, or (b) leave the
     call site unimplemented with a clear compile-time error (e.g. throw
     `NotImplementedError`), never a silently-succeeding fake.
   - "Demo mode" or "seed data" is only acceptable if explicitly requested,
     lives in a clearly separate `seed/` script, and is never imported by
     production code paths.

2. REAL NETWORK ONLY.
   - All Stellar/Soroban calls go through actual RPC/Horizon endpoints
     (Testnet during development, config-swappable to Mainnet). Never
     simulate contract responses in application code.
   - Network endpoints and passphrases come ONLY from environment variables.
     Never hardcode RPC/Horizon URLs or network passphrases in business logic.
   - Use Freighter (or WalletConnect-for-Stellar) for real signing — never
     a hardcoded keypair in any file that isn't `scripts/` or `.env.example`.

3. EVERY CONTRACT CALL IS REAL.
   - Deploy contracts with `stellar contract deploy` / `soroban-cli`, record
     the real contract ID in a generated `contracts.json`, and read from
     that file — never inline a contract ID string in frontend/backend code.
   - Write and run actual `soroban-cli` invoke commands or SDK calls against
     deployed testnet contracts before marking any contract-integration task
     done. "It compiles" is not "it works."

4. NO HARDCODED PROTOCOL OR NETWORK VALUES.
   - Protocol params (min stakes, dispute windows, fees, treasury, admin)
     live in on-chain storage. Set via `initialize` and admin setters —
     never as magic numbers in contract bodies.
   - Contract IDs: only from generated `contracts.json`.
   - App network config: only from env; fail boot if required vars missing.
   - Allowed fixed values: error messages, event names, math identities
     (`amount > 0`, percentage range validation), enum variants.

5. SECRETS.
   - No private keys, API keys, or seeds in source. `.env` is gitignored;
     `.env.example` lists required vars with empty/placeholder values only.

6. VERIFY BEFORE CLAIMING DONE.
   - After implementing a feature touching the chain, run it against
     testnet and paste the actual transaction hash / explorer link
     (https://stellar.expert/explorer/testnet/tx/<hash>) into the PR
     description or commit message as proof.
   - After implementing a UI flow, it must be checked by actually running
     the dev server and exercising the flow, not just written and assumed
     correct.

7. ASK BEFORE ASSUMING.
   - If a requirement is genuinely ambiguous and not covered by the
     finalized decisions below, stop and ask rather than picking an
     arbitrary default silently.

FINALIZED DESIGN DECISIONS (do not deviate without explicit user sign-off):

- Identity: On-chain (identity_registry) stores startup profiles (name,
  industry tags, description, funding ask) and investor profiles
  (preferences, KYC status). No PII on-chain — KYC records are off-chain
  in backend, encrypted at rest, keyed to wallet address hash.

- Escrow: MILESTONE-BASED with investor-approve + timelock fallback.
  Startup creates milestones. Investor deposits into escrow. Startup
  requests release → investor has a dispute window (admin-set) to reject.
  If investor doesn't act within the window, funds auto-release to
  startup. No jury involvement at any step.

- AI matchmaking: Off-chain in backend. OpenAI embeddings of startup
  profiles (industry tags + description + funding stage + location) vs
  investor preferences (industries + ticket size + stage). Cosine
  similarity → match score 0-100 displayed in both dashboards.

- Meetings: Startups buy meeting credits (XLM or platform tokens). One
  credit = one meeting request to an investor. Investor accepts →
  Whereby room generated. Investors never pay.

- Credits: Platform treasury collects credit fees. Admin-configurable
  credit price stored on-chain.

Tech stack (fixed — do not substitute without asking):
- Contracts: Rust + Soroban SDK, workspace under /contracts
- Frontend: Next.js (App Router) + TypeScript + Stellar Wallets Kit / Freighter API
- Backend: Node.js/TypeScript (Express/Fastify) for off-chain indexing, AI
  matchmaking, meeting orchestration, notifications
- DB: Postgres (off-chain metadata only — never store funds-relevant state
  off-chain as source of truth; chain is source of truth for escrow/funding)
- Stellar SDK: @stellar/stellar-sdk (JS), soroban-sdk (Rust)