# Ondex — Executable Task Breakdown

> Zero hardcoding: protocol params on-chain via init/admin; network/contract IDs from env + `contracts.json`.

## Locked parameters (deploy/admin args, not source constants)

| Param | Source |
|---|---|
| Min juror stake (XLM + platform) | On-chain admin config (first init: 100 + 100 units) |
| Platform token | Deploy Ondex SAC → `contracts.json` |
| Juror assignment | Admin-only `assign` |
| Dispute window | Per-case, admin-chosen `u64` seconds |
| Slash % | On-chain admin config |
| Investor override | Capital-weighted + admin `min_vote_capital_bps` |
| Jury size / quorum | On-chain admin config |

---

## Phase 0: Config surface

- [x] **T0-1** Lock decisions + zero-hardcoding rule in `AGENTS.md`
- [x] **T0-2** Expand `.env.example` (empty values only)
- [x] **T0-3** Rewrite this task list

## Phase 1: Contracts

- [x] **T1-1** `jury_registry` — admin, configurable params, real SAC transfers, outcome, slash from storage
- [x] **T1-2** `escrow_contract` — multi-investor, capital weight, real transfers, per-case window
- [x] **T1-3** `identity_registry` — reveal on terminal jury states; no magic defaults
- [x] **T1-4** Unit tests written (host testutils may fail on some Rust/SDK combos; WASM builds)
- [x] **T1-5** Deploy scripts write `contracts.json` + platform SAC script; init from env args

## Phase 2: SDK

- [x] **T2-1** Regenerate bindings from WASM (`pnpm bindings:generate`); IDs from env/`contracts.json`
- [x] **T2-2** Remove stale hardcoded addresses (`packages/sdk/addresses.json` points to contracts.json)

## Phase 3: API

- [x] **T3-1** Config: required env only; load contract IDs from `contracts.json`
- [x] **T3-2** Strip hardcoded IDs/RPC from indexer
- [x] **T3-3a** Application create/vote/status REST for hybrid off-chain metadata
- [ ] **T3-3b** Indexer parsers + KYC + admin orchestration against **new** ABIs

## Phase 4: Web

- [x] **T4-1** Network + contract IDs from `NEXT_PUBLIC_*` (no hardcoded RPC/IDs)
- [x] **T4-2** Role flows rewired to new methods (same UI structure): identity commit, jury register/vote, escrow deposit/open/release
- [x] **T4-3** Admin assign UI at `/admin` (admin-only gate via `get_admin`)

## Phase 5: Testnet deploy + E2E

- [x] **T5-0** Redeploy + init on Testnet (2026-07-19); IDs in `contracts.json`
- [ ] **T5-A** Identity commit → multi-investor deposit
- [ ] **T5-B** Stake → admin assign → majority FOR
- [ ] **T5-C** Window end → release
- [ ] **T5-D** Dispute → capital-weighted override → refund
- [ ] **T5-E** Slash at admin % with treasury transfer

Each path requires explorer tx proof (from `EXPLORER_BASE_URL`).

### Live Testnet

| Role | Address |
|---|---|
| **Admin** | `GC7HIBRULUOEIPTINNJRPA2PBCZX3GW2U6HGEOHXG7IEEZNBVPEKE2TL` |
| **Juror (target)** | `GAOX4AFHXOVTEH7FMKUDKJ5LFGDNVEET42C7N7ISL2KONGZJMGKIAOTX` |

| Contract | ID |
|---|---|
| jury_registry | `CDUM4VCMOUEIW4WN4I4VLBIDDRE5M7UQRL4O2P5GJCWN26Y4BCN4X6SR` |
| escrow_contract | `CAZPBS452EBHV3IJGUVE3ESU6UE7SWEMHQ2RAJNRLPCO7RY6RLE4KT73` |
| identity_registry | `CDGXWRJRHE37XWOCSK4U34WCZREHHLIQESF6HFYJPPO2YZ4ZU5IX7IYL` |
| platform ONDEX SAC | `CDNXEWGBYNVDMAEGHZDDTKENF6KFAARQP3FO7VDGAWC6GB6ZX7YTNVHJ` |

**Register juror:** admin wallet on `/admin` → Sponsor-register (pays min stake), or juror self-registers on `/jury` after ONDEX trustline + mint.
