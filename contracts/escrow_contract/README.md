# escrow_contract

Soroban smart contract for milestone-based escrow on the Stellar network.

## Overview

Holds investor funds in escrow for startup funding milestones. Release requires jury sign-off followed by a 72-hour dispute window. If disputed, investor-majority vote decides release or refund.

## Public Methods

| Method | Auth | Description |
|---|---|---|
| `initialize(jury_registry, dispute_window_secs)` | - | Sets jury_registry and dispute window (default 259200s). |
| `deposit(campaign_id, startup, investor, amount, asset) -> u32` | `investor` | Deposits funds into escrow for a campaign. |
| `jury_approved(campaign_id)` | - | Checks jury_registry for case resolution; sets JuryApproved state with deadline. |
| `dispute(campaign_id, disputer)` | `disputer` | Opens dispute within window after jury approval. |
| `investor_vote(campaign_id, investor, approve)` | `investor` | Casts investor vote during DisputeOpen state. |
| `release(campaign_id)` | - | Releases funds: after window (JuryApproved) or by investor majority (DisputeOpen). |
| `refund(campaign_id)` | `startup` | Refunds investor if campaign is still Active (threshold miss). |
| `get_campaign(campaign_id) -> Campaign` | - | Returns full campaign state. |
| `get_dispute_window() -> u64` | - | Returns dispute window in seconds. |
| `get_jury_registry() -> Address` | - | Returns linked jury_registry address. |
| `get_investor_vote(campaign_id, investor) -> bool` | - | Returns an investor's vote for a disputed campaign. |
| `get_investor_vote_count(campaign_id) -> InvestorVoteCount` | - | Returns for/against vote tallies for investor override. |

## Preconditions / Postconditions

- `deposit`: Panics if amount <= 0. Creates Active campaign.
- `jury_approved`: Cross-contract calls `jury_registry.get_case(case_id)`. Panics if case not Resolved or campaign not Active. Sets state to JuryApproved with deadline = now + dispute_window.
- `dispute`: Panics if not JuryApproved or window elapsed. Sets state to DisputeOpen.
- `investor_vote`: Panics if not DisputeOpen or investor already voted. Tallies vote.
- `release`: From JuryApproved: panics if window still open. From DisputeOpen: requires majority of total investor votes. Sets state to Released.
- `refund`: Panics if not Active. Requires startup auth. Sets state to Refunded.

## Events

| Topic | Data |
|---|---|
| `INIT` | (jury_registry, dispute_window_secs) |
| `DEPOSIT` | (campaign_id, investor, startup, amount, asset) |
| `APPROVED` | (campaign_id, approved_at, dispute_deadline) |
| `DISPUTE` | (campaign_id, disputer) |
| `INV_VOTE` | (campaign_id, investor, approve) |
| `RELEASE` | (campaign_id, investor, startup, amount) |
| `REFUND` | (campaign_id, investor, amount) |

## Tests

Run `cargo test` from the contracts workspace. Uses a mock JuryRegistry contract. Covers: initialization, deposit (valid, zero, negative), jury approval (resolved, voting state, double), dispute (within window, wrong state), release (after window, during window, investor majority for/against, no votes), investor voting (counts, double vote, outside dispute), refund (by startup, after approval, after release), and full lifecycle (deposit → jury approve → dispute → investor vote → release).
