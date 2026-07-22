# escrow_contract

Milestone escrow for Ondex. **No hardcoded dispute windows, vote weights, or participation thresholds.**

## Initialize

```
initialize(admin, jury_registry, min_vote_capital_bps)
```

`min_vote_capital_bps` is basis points of total deposited capital required to participate in override (e.g. 5000 = 50%).

## Admin

| Method | Description |
|---|---|
| `set_min_vote_capital_bps` | Participation threshold |
| `set_jury_registry` | Update jury contract address |

## Core methods

| Method | Auth | Description |
|---|---|---|
| `open_campaign(id, startup, asset, dispute_window_secs)` | admin | Create campaign; window set per campaign |
| `deposit(campaign_id, investor, amount)` | investor | Multi-investor; **real SAC transfer** into contract |
| `jury_approved(campaign_id)` | — | Requires jury `Resolved` **and** `approved`; starts window |
| `dispute(campaign_id, disputer)` | investor | Only depositors; within campaign window |
| `investor_vote(campaign_id, investor, approve)` | investor | **Capital-weighted** by deposit amount |
| `release(campaign_id)` | — | After window, or capital-majority FOR + participation |
| `refund(campaign_id)` | startup (Active) / anyone (DisputeOpen w/ majority AGAINST) | Pro-rata refunds via SAC |

## Tests

```bash
cargo test --manifest-path contracts/Cargo.toml -p escrow_contract
```
