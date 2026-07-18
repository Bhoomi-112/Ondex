# identity_registry

Soroban smart contract for hybrid identity masking on the Stellar network.

## Overview

Stores only commitment hashes on-chain — never PII. Real KYC records live off-chain (backend, encrypted at rest) keyed to the hash. Jury votes against the commitment (blind review). Reveal is gated on jury vote conclusion.

## Public Methods

| Method | Auth | Description |
|---|---|---|
| `initialize(jury_registry)` | - | Sets the linked jury_registry contract address. |
| `commit(identity_id, commitment_hash)` | - | Stores a commitment hash for an identity. One-time per identity. |
| `link_case(identity_id, case_id)` | - | Links a committed identity to a jury case ID. |
| `reveal(identity_id, case_id, backend_ref)` | - | Reveals identity after linked case is Resolved by jury. |
| `verify(identity_id) -> bool` | - | Returns whether an identity has been revealed. |
| `get_commitment(identity_id) -> Bytes` | - | Returns the stored commitment hash. |
| `is_committed(identity_id) -> bool` | - | Returns whether an identity has a commitment. |
| `get_linked_case(identity_id) -> u32` | - | Returns the case ID linked to an identity. |
| `get_jury_registry() -> Address` | - | Returns the linked jury_registry address. |

## Preconditions / Postconditions

- `commit`: Panics if identity already committed. Stores hash and marks committed.
- `link_case`: Panics if identity not committed. Stores case_id association.
- `reveal`: Panics if not committed, already revealed, not linked, wrong case_id, or linked case not Resolved in jury_registry. Sets revealed=true and nullifier=true.
- `verify`: Returns false for unrevealed or uncommitted identities.

## Events

| Topic | Data |
|---|---|
| `INIT` | (jury_registry_address) |
| `COMMIT` | (identity_id, commitment_hash) |
| `LNK_CASE` | (identity_id, case_id) |
| `REVEAL` | (identity_id, case_id, backend_ref) |

## Tests

Run `cargo test` from the contracts workspace. Uses a mock JuryRegistry contract in tests. Covers: commit, double-commit rejection, is_committed check, link_case, link without commit, reveal after resolution, reveal while voting (panics), reveal without commit (panics), reveal without link (panics), reveal with wrong case_id (panics), double reveal (panics), and initialization.
