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
   - Testnet: RPC `https://soroban-testnet.stellar.org`,
     Horizon `https://horizon-testnet.stellar.org`, network passphrase
     `"Test SDF Network ; September 2015"`. Pull these from env vars,
     never hardcode inline in business logic.
   - Use Freighter (or WalletConnect-for-Stellar) for real signing — never
     a hardcoded keypair in any file that isn't `scripts/` or `.env.example`.

3. EVERY CONTRACT CALL IS REAL.
   - Deploy contracts with `stellar contract deploy` / `soroban-cli`, record
     the real contract ID in a generated `contracts.json`, and read from
     that file — never inline a contract ID string in frontend/backend code.
   - Write and run actual `soroban-cli` invoke commands or SDK calls against
     deployed testnet contracts before marking any contract-integration task
     done. "It compiles" is not "it works."

4. SECRETS.
   - No private keys, API keys, or seeds in source. `.env` is gitignored;
     `.env.example` lists required vars with empty/placeholder values only.

5. VERIFY BEFORE CLAIMING DONE.
   - After implementing a feature touching the chain, run it against
     testnet and paste the actual transaction hash / explorer link
     (https://stellar.expert/explorer/testnet/tx/<hash>) into the PR
     description or commit message as proof.
   - After implementing a UI flow, it must be checked by actually running
     the dev server and exercising the flow, not just written and assumed
     correct.

6. ASK BEFORE ASSUMING.
   - If a requirement is genuinely ambiguous (jury quorum size, fee %,
     specific slashing thresholds), stop and ask rather than picking an
     arbitrary default silently. The three core design decisions below are
     already finalized — do not re-litigate them.

FINALIZED DESIGN DECISIONS (do not deviate without explicit user sign-off):

- Identity masking: HYBRID. On-chain (identity_registry) stores only a
  hash commitment of each startup/jury identity — never PII. The real KYC
  record lives off-chain (backend, encrypted at rest) keyed to that hash.
  Jury votes against the commitment only (blind review). Reveal is a
  separate contract method, callable only after a vote concludes, and
  only resolves to a compliance-scoped backend record — never exposes PII
  on-chain.

- Escrow release: LAYERED. Each funding milestone releases by default on
  jury sign-off (majority vote in jury_registry triggers escrow_contract
  release). That release is gated by a time-lock dispute window (confirm
  exact duration with user, default assumption: 72 hours) during which
  investors can raise a dispute. If disputed within the window, resolution
  falls to an investor-majority override vote before funds move. No path
  releases funds without at least jury sign-off as the base condition.

- Jury economics: REAL STAKING + SLASHING. Jurors stake a real asset
  (confirm which asset — platform token vs XLM — with user before Prompt 2)
  to be eligible to vote. A jury_registry dispute mechanism can slash a
  juror's stake if their vote is shown to contradict a decisively
  documented majority outcome under formal dispute. This is the mechanism
  that makes "jury curation" a credible claim rather than a rubber stamp.

Tech stack (fixed — do not substitute without asking):
- Contracts: Rust + Soroban SDK, workspace under /contracts
- Frontend: Next.js (App Router) + TypeScript + Stellar Wallets Kit / Freighter API
- Backend: Node.js/TypeScript (NestJS or Fastify — confirm with user) for
  off-chain indexing, jury workflow orchestration, notifications
- DB: Postgres (off-chain metadata only — never store funds-relevant state
  off-chain as source of truth; chain is source of truth for escrow/funding)
- Stellar SDK: @stellar/stellar-sdk (JS), soroban-sdk (Rust)