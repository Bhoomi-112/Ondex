# Ondex — Task Breakdown

> Ordered by dependency. Each task is tagged with the package it touches.
> Design decisions are finalized (see AGENTS.md): hybrid identity masking,
> layered escrow release, real staking + slashing for jurors.

---

## Phase 0: Scaffold Cleanup

- [x] **T0-1** `contracts` — Replace `hello()` stub in `escrow_contract` with real contract skeleton (storage keys, admin, events). Tracked explicitly so it doesn't survive into production. `[contracts/escrow_contract]`
- [x] **T0-2** `contracts` — Replace `hello()` stub in `jury_registry` with real contract skeleton. `[contracts/jury_registry]`
- [x] **T0-3** `contracts` — Replace `hello()` stub in `identity_registry` with real contract skeleton. `[contracts/identity_registry]`

---

## Phase 1: Identity Registry (no cross-contract dependencies)

- [x] **T1-1** `contracts` — Implement `commit_identity(hash)` — stores a SHA-256 commitment of a startup/jury identity on-chain. No PII ever touches the contract. Emits `IdentityCommitted` event. `[contracts/identity_registry]`
- [x] **T1-2** `contracts` — Implement `reveal_identity(preimage)` — hashes `preimage`, verifies it matches a stored commitment, stores the revealed status. Callable only after a vote concludes (time-gated or flag-gated). Emits `IdentityRevealed` event. `[contracts/identity_registry]`
- [x] **T1-3** `contracts` — Implement `verify_identity(commitment)` — read-only, returns whether a commitment has been revealed. Used by other contracts for authorization checks. `[contracts/identity_registry]`
- [x] **T1-4** `contracts` — Implement nullifier tracking — prevent the same identity from being committed twice. `[contracts/identity_registry]`
- [x] **T1-5** `contracts` — Unit tests for full commit-reveal flow, double-commit rejection, reveal-without-commit rejection. `[contracts/identity_registry]`
- [ ] **T1-6** `api` — Backend KYC service: encrypts PII at rest, stores the encrypted record keyed to the commitment hash. Never exposes PII to the chain. `[apps/api]`

---

## Phase 2: Jury Registry (independent of escrow)

- [x] **T2-1** `contracts` — Implement juror onboarding: `register_juror(stake_amount_xlm, stake_amount_token)`. Juror must transfer both XLM and platform token (SAC) to the contract as stake. Validates minimum stake thresholds. Emits `JurorRegistered` event. `[contracts/jury_registry]`
- [x] **T2-2** `contracts` — Implement `remove_juror()` — unstake and deregister. Enforces a cooldown period before unstaking. Emits `JurorRemoved` event. `[contracts/jury_registry]`
- [x] **T2-3** `contracts` — Implement `assign_jurors(case_id)` — randomly select 5 jurors from the pool for a given case. Uses PRNG seeded by block hash for fairness. Emits `JurorsAssigned` event. `[contracts/jury_registry]`
- [x] **T2-4** `contracts` — Implement `cast_vote(case_id, vote)` — juror votes FOR/AGAINST. Validates caller is an assigned juror for the case, hasn't already voted. Emits `VoteCast` event. `[contracts/jury_registry]`
- [x] **T2-5** `contracts` — Implement `resolve_vote(case_id)` — tallies votes. Requires 3-of-5 quorum (majority). If quorum met, marks case as RESOLVED with outcome. Emits `VoteResolved` event. `[contracts/jury_registry]`
- [x] **T2-6** `contracts` — Implement dispute + slashing: `dispute_vote(case_id, evidence)` — allows investors to dispute a vote. If the dispute is upheld (investor-majority override), the dissenting juror's stake is slashed. Emits `JurorSlashed` event. `[contracts/jury_registry]`
- [x] **T2-7** `contracts` — Implement 72-hour dispute window: after `resolve_vote`, a 72-hour time-lock begins during which investors can raise disputes. After the window closes, the resolution is final. `[contracts/jury_registry]`
- [x] **T2-8** `contracts` — Unit tests for onboarding, voting, quorum, dispute, slashing, time-lock expiry. `[contracts/jury_registry]`
- [x] **T2-9** `contracts` — Implement event emission for all state changes — events are consumed by the API indexer. `[contracts/jury_registry]`

---

## Phase 3: Escrow Contract (depends on Jury Registry)

- [x] **T3-1** `contracts` — Implement `create_escrow(case_id, amount, startup_address)` — investor deposits funds into escrow for a specific case. Validates amount > 0, stores escrow record. Emits `EscrowCreated` event. `[contracts/escrow_contract]`
- [x] **T3-2** `contracts` — Implement `release_funds(case_id)` — releases funds to startup. Gated by jury sign-off: only callable if `jury_registry.resolve_vote(case_id)` returned a FOR outcome. Enforces 72-hour dispute time-lock before executing release. Emits `FundsReleased` event. `[contracts/escrow_contract]`
- [x] **T3-3** `contracts` — Implement dispute time-lock: after jury sign-off, funds are locked for 72 hours. During this window, investors can call `raise_dispute(case_id)` which pauses the release. `[contracts/escrow_contract]`
- [x] **T3-4** `contracts` — Implement investor-majority override: if a dispute is raised, investors vote. If majority votes to refund, funds return to investors. Emits `FundsRefunded` event. `[contracts/escrow_contract]`
- [x] **T3-5** `contracts` — Implement `refund_on_threshold_miss(case_id)` — if the case milestone is not met within the deadline, funds auto-refund to investors. Uses ledger time for deadline enforcement. `[contracts/escrow_contract]`
- [x] **T3-6** `contracts` — Unit tests for create, release, dispute, override, refund flows. Cross-contract integration tests with jury_registry. `[contracts/escrow_contract]`
- [x] **T3-7** `contracts` — Implement event emission for all escrow state changes. `[contracts/escrow_contract]`

---

## Phase 4: SDK (depends on all contracts)

- [ ] **T4-1** `sdk` — After each contract is deployed, regenerate TypeScript bindings from WASM using `BindingGenerator.fromWasm()`. Verify generated `Client` classes have typed methods for all contract functions. `[packages/sdk]`
- [ ] **T4-2** `sdk` — Export typed helpers for common operations: create escrow, cast vote, commit identity. These are convenience wrappers, not hand-written contract logic. `[packages/sdk]`

---

## Phase 5: API Backend (depends on SDK)

- [x] **T5-1** `api` — Event indexer: subscribe to Soroban contract events via RPC, parse and store them in Postgres. Tables for: escrows, votes, identity commitments, disputes. `[apps/api]`
- [x] **T5-2** `api` — REST endpoints for frontend consumption: GET /escrows, GET /cases/:id, GET /juries/:id, POST /disputes. `[apps/api]`
- [x] **T5-3** `api` — Notification service: email/webhook notifications for juror assignment, vote deadlines, dispute alerts. `[apps/api]`
- [x] **T5-4** `api` — SEP-10 authentication: Stellar-based web authentication for API routes. No passwords, wallet-based auth only. `[apps/api]`
- [x] **T5-5** `api` — Unit tests: vitest + mock repositories for all 6 services (59 tests). `[apps/api]`
- [x] **T5-6** `api` — Full layered architecture: routes → services → repositories → Prisma ORM with 10 models. `[apps/api]`
- [x] **T5-7** `api` — Middleware: error-handler, request-id, rate-limiter, auth, validate. `[apps/api]`

---

## Phase 6: Web Frontend (depends on SDK + API)

- [ ] **T6-1** `web` — Wallet connect: Freighter + WalletConnect integration via Stellar Wallets Kit. `[apps/web]`
- [ ] **T6-2** `web` — Identity setup flow: guide users through commit-reveal identity masking. `[apps/web]`
- [ ] **T6-3** `web` — Escrow dashboard: display active escrows, status, deadlines. `[apps/web]`
- [ ] **T6-4** `web` — Jury dashboard: assigned cases, voting interface, stake management. `[apps/web]`
- [ ] **T6-5** `web` — Dispute UI: raise disputes, investor voting, resolution display. `[apps/web]`
- [ ] **T6-6** `web` — Case detail page: full timeline, events, outcome. `[apps/web]`

---

## Open Design Questions

- [ ] **Q1** — Confirm juror stake minimums: minimum XLM and platform token amounts for juror registration. `[contracts/jury_registry]`
- [ ] **Q2** — Confirm platform token (SAC) deployment: deploy a Stellar Asset Contract for the platform token, or use an existing testnet token. `[contracts/jury_registry, scripts]`
- [ ] **Q3** — Confirm dispute window override: can the 72-hour window be shortened by mutual agreement, or is it fixed? `[contracts/escrow_contract, contracts/jury_registry]`
- [ ] **Q4** — Confirm slashing threshold: what percentage of stake is slashed for a dissenting juror? `[contracts/jury_registry]`
- [ ] **Q5** — Confirm investor-majority quorum: is it token-weighted (by investment amount) or 1-investor-1-vote? `[contracts/escrow_contract]`
