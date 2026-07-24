#![cfg(test)]

extern crate std;

use soroban_sdk::{testutils::Address as _, Address, Bytes, Env};

use crate::{CaseStatus, IdentityRegistry, IdentityRegistryClient};

#[soroban_sdk::contract]
pub struct MockJury;

#[soroban_sdk::contractimpl]
impl MockJury {
    pub fn set_case(env: Env, case_id: u32, status: CaseStatus, approved: bool) {
        let result = crate::CaseResult {
            status,
            for_votes: 2,
            against_votes: 1,
            total_votes: 3,
            resolved_at: env.ledger().timestamp(),
            approved,
            dispute_window_secs: 3600,
        };
        env.storage().persistent().set(&case_id, &result);
    }

    pub fn get_case(env: Env, case_id: u32) -> crate::CaseResult {
        env.storage()
            .persistent()
            .get(&case_id)
            .expect("case not found")
    }
}

struct Setup {
    env: Env,
    client: IdentityRegistryClient<'static>,
    jury: Address,
}

fn setup() -> Setup {
    let env = Env::default();
    env.mock_all_auths();

    let jury = env.register(MockJury, ());
    let id = env.register(IdentityRegistry, ());
    let client = IdentityRegistryClient::new(&env, &id);
    client.initialize(&jury);

    Setup { env, client, jury }
}

fn set_case(s: &Setup, case_id: u32, status: CaseStatus, approved: bool) {
    s.env.as_contract(&s.jury, || {
        MockJury::set_case(s.env.clone(), case_id, status, approved);
    });
}

#[test]
fn test_commit_and_is_committed() {
    let s = setup();
    let identity_id = Bytes::from_array(&s.env, &[1u8; 32]);
    let hash = Bytes::from_array(&s.env, &[2u8; 32]);

    s.client.commit(&identity_id, &hash);
    assert!(s.client.is_committed(&identity_id));
    assert_eq!(s.client.get_commitment(&identity_id), hash);
}

#[test]
#[should_panic(expected = "identity already committed")]
fn test_double_commit() {
    let s = setup();
    let identity_id = Bytes::from_array(&s.env, &[1u8; 32]);
    let hash = Bytes::from_array(&s.env, &[2u8; 32]);
    s.client.commit(&identity_id, &hash);
    s.client.commit(&identity_id, &hash);
}

#[test]
fn test_reveal_after_resolved() {
    let s = setup();
    let identity_id = Bytes::from_array(&s.env, &[9u8; 32]);
    let hash = Bytes::from_array(&s.env, &[8u8; 32]);
    let backend = Bytes::from_array(&s.env, &[7u8; 16]);

    s.client.commit(&identity_id, &hash);
    s.client.link_case(&identity_id, &0);
    set_case(&s, 0, CaseStatus::Resolved, true);

    s.client.reveal(&identity_id, &0, &backend);
    assert!(s.client.verify(&identity_id));
}

#[test]
#[should_panic(expected = "jury vote has not concluded")]
fn test_reveal_while_voting() {
    let s = setup();
    let identity_id = Bytes::from_array(&s.env, &[9u8; 32]);
    let hash = Bytes::from_array(&s.env, &[8u8; 32]);
    let backend = Bytes::from_array(&s.env, &[7u8; 16]);

    s.client.commit(&identity_id, &hash);
    s.client.link_case(&identity_id, &0);
    set_case(&s, 0, CaseStatus::Voting, false);

    s.client.reveal(&identity_id, &0, &backend);
}

#[test]
fn test_get_jury_registry() {
    let s = setup();
    assert_eq!(s.client.get_jury_registry(), s.jury);
}
