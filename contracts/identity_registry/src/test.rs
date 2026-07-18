#![cfg(test)]

extern crate std;

use soroban_sdk::{symbol_short, Bytes, Env, Vec};

use crate::{CaseResult, CaseStatus, DataKey, IdentityRegistry};

#[derive(Clone)]
#[soroban_sdk::contracttype]
pub enum MockCaseStatus {
    Voting,
    Resolved,
    Disputed,
    Slashed,
}

#[derive(Clone)]
#[soroban_sdk::contracttype]
pub struct MockCaseResult {
    pub status: MockCaseStatus,
    pub for_votes: u32,
    pub against_votes: u32,
    pub total_votes: u32,
    pub resolved_at: u64,
}

#[soroban_sdk::contract]
pub struct MockJuryRegistry;

#[soroban_sdk::contractimpl]
impl MockJuryRegistry {
    pub fn init_mock(env: Env, case_id: u32, resolved: bool) {
        let status = if resolved {
            MockCaseStatus::Resolved
        } else {
            MockCaseStatus::Voting
        };
        let result = MockCaseResult {
            status,
            for_votes: if resolved { 3 } else { 0 },
            against_votes: if resolved { 2 } else { 0 },
            total_votes: if resolved { 5 } else { 0 },
            resolved_at: if resolved {
                env.ledger().timestamp()
            } else {
                0
            },
        };
        env.storage()
            .persistent()
            .set(&MockDataKey::Case(case_id), &result);
    }

    pub fn get_case(env: Env, case_id: u32) -> MockCaseResult {
        env.storage()
            .persistent()
            .get(&MockDataKey::Case(case_id))
            .expect("case not found")
    }
}

#[derive(Clone)]
#[soroban_sdk::contracttype]
enum MockDataKey {
    Case(u32),
}

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let identity_addr = Address::generate(&env);
    let jury_addr = Address::generate(&env);

    env.register(&identity_addr, IdentityRegistry);
    env.register(&jury_addr, MockJuryRegistry);

    env.as_contract(&identity_addr, || {
        env.storage()
            .persistent()
            .set(&DataKey::JuryRegistry, &jury_addr);
    });

    (env, identity_addr, jury_addr)
}

fn setup_with_resolved_case(case_id: u32) -> (Env, Address, Address) {
    let (env, identity_addr, jury_addr) = setup();
    env.as_contract(&jury_addr, || {
        MockJuryRegistry::init_mock(&env, case_id, true);
    });
    (env, identity_addr, jury_addr)
}

fn setup_with_voting_case(case_id: u32) -> (Env, Address, Address) {
    let (env, identity_addr, jury_addr) = setup();
    env.as_contract(&jury_addr, || {
        MockJuryRegistry::init_mock(&env, case_id, false);
    });
    (env, identity_addr, jury_addr)
}

#[test]
fn test_commit_identity() {
    let (env, identity_addr, _) = setup();

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30, 40, 50, 60, 70, 80]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash.clone());
    });

    let is_committed: bool = env.as_contract(&identity_addr, || {
        IdentityRegistry::is_committed(&env, identity_id.clone())
    });
    assert!(is_committed);

    let stored_hash: Bytes = env.as_contract(&identity_addr, || {
        IdentityRegistry::get_commitment(&env, identity_id)
    });
    assert_eq!(stored_hash, commitment_hash);
}

#[test]
#[should_panic(expected = "identity already committed")]
fn test_double_commit() {
    let (env, identity_addr, _) = setup();

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let hash1 = Bytes::from_array(&env, &[10, 20, 30]);
    let hash2 = Bytes::from_array(&env, &[40, 50, 60]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), hash1);
        IdentityRegistry::commit(&env, identity_id, hash2);
    });
}

#[test]
fn test_verify_uncommitted_returns_false() {
    let (env, identity_addr, _) = setup();
    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);

    let is_revealed: bool = env.as_contract(&identity_addr, || {
        IdentityRegistry::verify(&env, identity_id)
    });
    assert!(!is_revealed);
}

#[test]
fn test_link_case() {
    let (env, identity_addr, _) = setup();

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::link_case(&env, identity_id.clone(), 42);
    });

    let linked_case: u32 = env.as_contract(&identity_addr, || {
        IdentityRegistry::get_linked_case(&env, identity_id)
    });
    assert_eq!(linked_case, 42);
}

#[test]
#[should_panic(expected = "identity not committed")]
fn test_link_case_without_commit() {
    let (env, identity_addr, _) = setup();
    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::link_case(&env, identity_id, 1);
    });
}

#[test]
#[should_panic(expected = "jury vote has not concluded")]
fn test_reveal_while_voting() {
    let case_id = 5u32;
    let (env, identity_addr, jury_addr) = setup_with_voting_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::link_case(&env, identity_id.clone(), case_id);
        IdentityRegistry::reveal(&env, identity_id, case_id, backend_ref);
    });
}

#[test]
fn test_reveal_after_resolution() {
    let case_id = 5u32;
    let (env, identity_addr, _) = setup_with_resolved_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::link_case(&env, identity_id.clone(), case_id);
        IdentityRegistry::reveal(&env, identity_id.clone(), case_id, backend_ref);
    });

    let is_revealed: bool = env.as_contract(&identity_addr, || {
        IdentityRegistry::verify(&env, identity_id)
    });
    assert!(is_revealed);
}

#[test]
#[should_panic(expected = "identity not committed")]
fn test_reveal_without_commit() {
    let case_id = 5u32;
    let (env, identity_addr, _) = setup_with_resolved_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::reveal(&env, identity_id, case_id, backend_ref);
    });
}

#[test]
#[should_panic(expected = "identity not linked to a case")]
fn test_reveal_without_link() {
    let case_id = 5u32;
    let (env, identity_addr, _) = setup_with_resolved_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::reveal(&env, identity_id, case_id, backend_ref);
    });
}

#[test]
#[should_panic(expected = "case_id does not match linked case")]
fn test_reveal_wrong_case_id() {
    let case_id = 5u32;
    let (env, identity_addr, _) = setup_with_resolved_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::link_case(&env, identity_id.clone(), case_id);
        IdentityRegistry::reveal(&env, identity_id, 999, backend_ref);
    });
}

#[test]
#[should_panic(expected = "identity already revealed")]
fn test_double_reveal() {
    let case_id = 5u32;
    let (env, identity_addr, _) = setup_with_resolved_case(case_id);

    let identity_id = Bytes::from_array(&env, &[1, 2, 3, 4]);
    let commitment_hash = Bytes::from_array(&env, &[10, 20, 30]);
    let backend_ref = Bytes::from_array(&env, &[99, 98, 97]);
    let backend_ref2 = Bytes::from_array(&env, &[88, 77, 66]);

    env.as_contract(&identity_addr, || {
        IdentityRegistry::commit(&env, identity_id.clone(), commitment_hash);
        IdentityRegistry::link_case(&env, identity_id.clone(), case_id);
        IdentityRegistry::reveal(&env, identity_id.clone(), case_id, backend_ref);
        IdentityRegistry::reveal(&env, identity_id, case_id, backend_ref2);
    });
}

#[test]
fn test_jury_registry_initialization() {
    let (env, identity_addr, jury_addr) = setup();

    let stored_jury: Address = env.as_contract(&identity_addr, || {
        IdentityRegistry::get_jury_registry(&env)
    });
    assert_eq!(stored_jury, jury_addr);
}
