You are building Ondex, a three-sided Web3 startup-funding marketplace
(startups, jury, investors) on Stellar using Soroban smart contracts.

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
   - Protocol params (min stakes, slash %, jury size, quorum, capital
     participation threshold, token addresses, treasury, admin) live in
     on-chain storage. They are set via `initialize` and admin setters —
     never as magic numbers in contract bodies (`unwrap_or(259200)`,
     `slash_pct = 50`, fixed jury size 5, etc. are forbidden).
   - Per-case params (dispute window, assigned jurors) are set by admin at
     assign/create time and stored on-chain per case.
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

- Identity masking: HYBRID. On-chain (identity_registry) stores only a
  hash commitment of each startup/jury identity — never PII. The real KYC
  record lives off-chain (backend, encrypted at rest) keyed to that hash.
  Jury votes against the commitment only (blind review). Reveal is a
  separate contract method, callable only after a vote concludes, and
  only resolves to a compliance-scoped backend record — never exposes PII
  on-chain.

- Escrow release: LAYERED. Each funding milestone releases by default on
  jury sign-off (majority FOR in jury_registry). Release is gated by a
  per-case dispute window (admin-set at case assign/create; any duration
  admin chooses) during which investors can raise a dispute. If disputed
  within the window, resolution falls to a capital-weighted investor
  override vote before funds move. No path releases funds without at least
  jury majority-FOR as the base condition.

- Jury economics: REAL STAKING + SLASHING. Jurors stake real assets
  (native XLM SAC + platform SAC token). Minimum stakes are admin-set on
  chain (first Testnet init intended: 10 XLM + 100 platform units as
  deploy-time args, not source constants). Jurors are admin-assigned (not
  random). Slash percentage is admin-configured on chain (not hardcoded).
  Slashed funds transfer to the on-chain treasury address.

- Investor override: CAPITAL-WEIGHTED. Vote weight equals each investor's
  deposited amount. Majority is by weighted capital among votes cast, with
  a minimum participation threshold (admin-set `min_vote_capital_bps` of
  total deposited capital).

Tech stack (fixed — do not substitute without asking):
- Contracts: Rust + Soroban SDK, workspace under /contracts
- Frontend: Next.js (App Router) + TypeScript + Stellar Wallets Kit / Freighter API
- Backend: Node.js/TypeScript (Fastify) for off-chain indexing, jury
  workflow orchestration, notifications
- DB: Postgres (off-chain metadata only — never store funds-relevant state
  off-chain as source of truth; chain is source of truth for escrow/funding)
- Stellar SDK: @stellar/stellar-sdk (JS), soroban-sdk (Rust)
