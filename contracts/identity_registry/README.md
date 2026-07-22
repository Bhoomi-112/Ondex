# identity_registry

Hybrid identity masking: on-chain hash commitments only; PII stays off-chain.

## Initialize

```
initialize(jury_registry)
```

Must be called once; no default jury address.

## Methods

| Method | Description |
|---|---|
| `commit(identity_id, commitment_hash)` | Store commitment (no PII) |
| `link_case(identity_id, case_id)` | Bind identity to case |
| `reveal(identity_id, case_id, backend_ref)` | Only after jury case is terminal (Resolved/Disputed/Slashed); stores backend ref only |
| `verify` / `is_committed` / `get_commitment` / `get_linked_case` / `get_jury_registry` | Reads |

## Tests

```bash
cargo test --manifest-path contracts/Cargo.toml -p identity_registry
```
