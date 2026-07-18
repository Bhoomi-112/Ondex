# jury_registry

Soroban smart contract for decentralized jury management on the Stellar network.

## Overview

Manages juror registration, case assignment, voting, disputes, and stake slashing for the Ondex three-sided marketplace.

## Public Methods

| Method | Auth | Description |
|---|---|---|
| `initialize(admin, dispute_window_secs)` | - | Sets admin and dispute window (72h = 259200s). Admin auto-registered. |
| `set_identity_registry(identity_registry)` | - | Links to the identity_registry contract. |
| `register(juror, xlm_stake, platform_stake)` | `juror` | Registers a juror with dual staking (XLM + platform token). |
| `assign(case_id, jurors)` | - | Assigns exactly 5 registered jurors to a case. |
| `vote(case_id, juror, vote)` | `juror` | Casts For/Against vote. Resolves at quorum (3/5). |
| `dispute(case_id, disputer)` | `disputer` | Opens dispute within window after resolution. |
| `slash(case_id, juror)` | - | Slashes 50% of dissenting juror's stake after dispute. |
| `get_case(case_id) -> CaseResult` | - | Returns case status, vote tallies, and resolution timestamp. |
| `juror_stake(juror) -> JurorStakes` | - | Returns XLM/platform stakes and registration time. |
| `is_reg(juror) -> bool` | - | Checks if juror is registered. |
| `disp_win() -> u64` | - | Returns dispute window in seconds. |
| `get_vote(case_id, juror) -> VoteRecord` | - | Returns a juror's vote and timestamp for a case. |

## Preconditions / Postconditions

- `register`: Panics if juror already registered. Stores stake and marks registered.
- `assign`: Panics if not exactly 5 jurors or any juror not registered. Initializes case as Voting.
- `vote`: Panics if case not in Voting state, juror not assigned, or juror already voted. At quorum (3 votes), auto-resolves.
- `dispute`: Panics if case not Resolved or dispute window elapsed. Sets status to Disputed.
- `slash`: Panics if case not Disputed or juror's vote aligns with majority. Cuts stakes by 50%.

## Events

| Topic | Data |
|---|---|
| `INIT` | (admin, dispute_window_secs) |
| `REG` | (juror, xlm_stake, platform_stake) |
| `ASSIGN` | (case_id, jurors_vec) |
| `VOTE` | (case_id, juror, vote) |
| `RESOLVE` | (case_id, status, for_votes, against_votes) |
| `DISPUTE` | (case_id, disputer) |
| `SLASH` | (case_id, juror, remaining_xlm, remaining_platform) |

## Tests

Run `cargo test` from the contracts workspace. Tests cover: registration, duplicate rejection, quorum resolution, double vote prevention, unassigned juror rejection, dispute within/after window, slashing dissenting vs non-dissenting jurors, and full lifecycle.
