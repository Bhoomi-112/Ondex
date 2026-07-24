# jury_registry

Soroban smart contract for jury management on Stellar. **All protocol params are admin-configured on-chain — nothing is hardcoded in contract logic.**

## Initialize (required)

```
initialize(
  admin,
  xlm_token,
  platform_token,
  treasury,
  min_xlm_stake,
  min_platform_stake,
  jury_size,
  quorum,
  slash_pct
)
```

First Testnet deploy intended args (passed at deploy time, not in source):  
`min_xlm_stake=10`, `min_platform_stake=100`, `jury_size=5`, `quorum=3`, `slash_pct` as admin chooses.

## Admin setters

| Method | Description |
|---|---|
| `set_identity_registry` | Link identity_registry |
| `set_min_stakes` | Update min XLM + platform stakes |
| `set_jury_params` | Update jury_size + quorum |
| `set_slash_pct` | Update slash percentage 0–100 |
| `set_treasury` | Treasury for slashed funds |

## Core methods

| Method | Auth | Description |
|---|---|---|
| `register(juror, xlm_stake, platform_stake)` | juror | Enforces mins; **transfers** XLM + platform SAC into contract |
| `assign(case_id, jurors, dispute_window_secs)` | admin | Assigns `jury_size` registered jurors; per-case window |
| `vote(case_id, juror, vote)` | juror | Tallies; at quorum resolves with `approved = for > against` |
| `dispute(case_id, disputer)` | disputer | Within **case** dispute window after resolve |
| `slash(case_id, juror)` | admin | Slashes dissenting juror by admin `slash_pct`; transfers to treasury |

## CaseResult fields

`status`, `for_votes`, `against_votes`, `total_votes`, `resolved_at`, **`approved`**, **`dispute_window_secs`**

## Tests

```bash
cargo test --manifest-path contracts/Cargo.toml -p jury_registry
```

Note: host testutils may fail on some Rust/SDK combinations; WASM release build is the CI gate.
