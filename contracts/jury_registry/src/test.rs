#![cfg(test)]

extern crate std;

use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env, Vec,
};

use crate::{CaseStatus, JuryRegistry, JuryRegistryClient, Vote};

fn create_token(env: &Env, admin: &Address) -> Address {
    let contract = env.register_stellar_asset_contract_v2(admin.clone());
    contract.address()
}

fn mint(env: &Env, token_id: &Address, to: &Address, amount: i128) {
    token::StellarAssetClient::new(env, token_id).mint(to, &amount);
}

struct Setup {
    env: Env,
    client: JuryRegistryClient<'static>,
    admin: Address,
    xlm: Address,
    platform: Address,
    treasury: Address,
    juror1: Address,
    juror2: Address,
    juror3: Address,
}

fn setup_with_params(
    min_xlm: i128,
    min_platform: i128,
    jury_size: u32,
    quorum: u32,
    slash_pct: u32,
) -> Setup {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let treasury = Address::generate(&env);
    let xlm = create_token(&env, &admin);
    let platform = create_token(&env, &admin);

    let contract_id = env.register(JuryRegistry, ());
    let client = JuryRegistryClient::new(&env, &contract_id);

    client.initialize(
        &admin,
        &xlm,
        &platform,
        &treasury,
        &min_xlm,
        &min_platform,
        &jury_size,
        &quorum,
        &slash_pct,
    );

    let juror1 = Address::generate(&env);
    let juror2 = Address::generate(&env);
    let juror3 = Address::generate(&env);

    for j in [&juror1, &juror2, &juror3] {
        mint(&env, &xlm, j, min_xlm * 10);
        mint(&env, &platform, j, min_platform * 10);
    }

    Setup {
        env,
        client,
        admin,
        xlm,
        platform,
        treasury,
        juror1,
        juror2,
        juror3,
    }
}

fn default_setup() -> Setup {
    // Injected params — not contract constants
    setup_with_params(10, 100, 3, 2, 50)
}

fn register_all(s: &Setup, xlm: i128, platform: i128) {
    s.client.register(&s.juror1, &xlm, &platform);
    s.client.register(&s.juror2, &xlm, &platform);
    s.client.register(&s.juror3, &xlm, &platform);
}

#[test]
fn test_initialize_and_config() {
    let s = default_setup();
    assert_eq!(s.client.get_admin(), s.admin);
    assert_eq!(s.client.get_slash_pct(), 50);
    assert_eq!(s.client.get_jury_size(), 3);
    assert_eq!(s.client.get_quorum(), 2);
    assert_eq!(s.client.get_min_stakes(), (10, 100));
}

#[test]
fn test_register_transfers_tokens() {
    let s = default_setup();
    let xlm_client = token::Client::new(&s.env, &s.xlm);
    let before = xlm_client.balance(&s.juror1);

    s.client.register(&s.juror1, &10, &100);

    assert!(s.client.is_reg(&s.juror1));
    assert_eq!(xlm_client.balance(&s.juror1), before - 10);
    assert_eq!(
        xlm_client.balance(&s.client.address),
        10
    );
    let stakes = s.client.juror_stake(&s.juror1);
    assert_eq!(stakes.xlm, 10);
    assert_eq!(stakes.platform, 100);
}

#[test]
#[should_panic(expected = "stake below minimum")]
fn test_register_below_min() {
    let s = default_setup();
    s.client.register(&s.juror1, &5, &100);
}

#[test]
#[should_panic(expected = "already registered")]
fn test_register_duplicate() {
    let s = default_setup();
    s.client.register(&s.juror1, &10, &100);
    s.client.register(&s.juror1, &10, &100);
}

#[test]
fn test_assign_and_vote_majority_for() {
    let s = default_setup();
    register_all(&s, 10, 100);

    let mut jurors = Vec::new(&s.env);
    jurors.push_back(s.juror1.clone());
    jurors.push_back(s.juror2.clone());
    jurors.push_back(s.juror3.clone());

    let window: u64 = 3600;
    s.client.assign(&0, &jurors, &window);

    s.client.vote(&0, &s.juror1, &Vote::For);
    s.client.vote(&0, &s.juror2, &Vote::For);

    let result = s.client.get_case(&0);
    assert_eq!(result.status, CaseStatus::Resolved);
    assert!(result.approved);
    assert_eq!(result.for_votes, 2);
    assert_eq!(result.dispute_window_secs, window);
}

#[test]
fn test_vote_majority_against_not_approved() {
    let s = default_setup();
    register_all(&s, 10, 100);

    let mut jurors = Vec::new(&s.env);
    jurors.push_back(s.juror1.clone());
    jurors.push_back(s.juror2.clone());
    jurors.push_back(s.juror3.clone());
    s.client.assign(&0, &jurors, &7200u64);

    s.client.vote(&0, &s.juror1, &Vote::Against);
    s.client.vote(&0, &s.juror2, &Vote::Against);

    let result = s.client.get_case(&0);
    assert_eq!(result.status, CaseStatus::Resolved);
    assert!(!result.approved);
}

#[test]
fn test_dispute_and_slash_uses_admin_pct() {
    let s = setup_with_params(10, 100, 3, 2, 25);
    register_all(&s, 10, 100);

    let mut jurors = Vec::new(&s.env);
    jurors.push_back(s.juror1.clone());
    jurors.push_back(s.juror2.clone());
    jurors.push_back(s.juror3.clone());
    s.client.assign(&0, &jurors, &10_000u64);

    s.client.vote(&0, &s.juror1, &Vote::For);
    s.client.vote(&0, &s.juror2, &Vote::For);
    s.client.vote(&0, &s.juror3, &Vote::Against);

    let disputer = Address::generate(&s.env);
    s.client.dispute(&0, &disputer);

    let xlm_client = token::Client::new(&s.env, &s.xlm);
    let treasury_before = xlm_client.balance(&s.treasury);

    s.client.slash(&0, &s.juror3);

    let stakes = s.client.juror_stake(&s.juror3);
    assert_eq!(stakes.xlm, 8);
    assert_eq!(stakes.platform, 75);
    assert_eq!(xlm_client.balance(&s.treasury), treasury_before + 2);

    let result = s.client.get_case(&0);
    assert_eq!(result.status, CaseStatus::Slashed);
}

#[test]
fn test_admin_set_slash_pct() {
    let s = default_setup();
    s.client.set_slash_pct(&10);
    assert_eq!(s.client.get_slash_pct(), 10);
}

#[test]
#[should_panic(expected = "dispute window closed")]
fn test_dispute_after_window() {
    let s = default_setup();
    register_all(&s, 10, 100);

    let mut jurors = Vec::new(&s.env);
    jurors.push_back(s.juror1.clone());
    jurors.push_back(s.juror2.clone());
    jurors.push_back(s.juror3.clone());
    s.client.assign(&0, &jurors, &100u64);

    s.client.vote(&0, &s.juror1, &Vote::For);
    s.client.vote(&0, &s.juror2, &Vote::For);

    s.env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + 101;
    });

    let disputer = Address::generate(&s.env);
    s.client.dispute(&0, &disputer);
}

#[test]
#[should_panic(expected = "juror count must equal jury_size")]
fn test_assign_wrong_count() {
    let s = default_setup();
    register_all(&s, 10, 100);
    let mut jurors = Vec::new(&s.env);
    jurors.push_back(s.juror1.clone());
    s.client.assign(&0, &jurors, &100u64);
}
