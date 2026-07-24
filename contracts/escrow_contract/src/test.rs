#![cfg(test)]

extern crate std;

use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

use crate::{EscrowContract, EscrowContractClient, EscrowState};

struct Setup {
    env: Env,
    client: EscrowContractClient<'static>,
    admin: Address,
    asset: Address,
    startup: Address,
    inv1: Address,
    inv2: Address,
}

fn create_token(env: &Env, admin: &Address) -> Address {
    env.register_stellar_asset_contract_v2(admin.clone())
        .address()
}

fn mint(env: &Env, token_id: &Address, to: &Address, amount: i128) {
    token::StellarAssetClient::new(env, token_id).mint(to, &amount);
}

fn setup() -> Setup {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let startup = Address::generate(&env);
    let inv1 = Address::generate(&env);
    let inv2 = Address::generate(&env);
    let asset = create_token(&env, &admin);

    let escrow_id = env.register(EscrowContract, ());
    let client = EscrowContractClient::new(&env, &escrow_id);

    client.initialize(&admin, &7 * 24 * 3600);

    mint(&env, &asset, &inv1, 1_000_000);
    mint(&env, &asset, &inv2, 1_000_000);

    Setup {
        env,
        client,
        admin,
        asset,
        startup,
        inv1,
        inv2,
    }
}

fn open_and_fund(s: &Setup, campaign_id: u32, a1: i128, a2: i128) {
    s.client
        .open_campaign(&campaign_id, &s.startup, &s.asset);
    if a1 > 0 {
        s.client.deposit(&campaign_id, &s.inv1, &a1);
    }
    if a2 > 0 {
        s.client.deposit(&campaign_id, &s.inv2, &a2);
    }
}

#[test]
fn test_initialize() {
    let s = setup();
    assert_eq!(s.client.get_admin(), s.admin);
}

#[test]
fn test_deposit_and_release_after_window() {
    let s = setup();
    open_and_fund(&s, 0, 300, 200);

    s.client.request_release(&0);
    let c = s.client.get_campaign(&0);
    assert_eq!(c.state, EscrowState::MilestoneRequested);
    assert_eq!(c.total_amount, 500);

    // Advance past dispute window
    s.env.ledger().with_mut(|li| {
        li.timestamp = c.release_requested_at + c.dispute_window_secs + 1;
    });

    let token_client = token::Client::new(&s.env, &s.asset);
    let before = token_client.balance(&s.startup);
    s.client.release(&0);
    assert_eq!(token_client.balance(&s.startup), before + 500);
    assert_eq!(s.client.get_campaign(&0).state, EscrowState::Released);
}

#[test]
#[should_panic(expected = "dispute window still open")]
fn test_cannot_release_before_window_expires() {
    let s = setup();
    open_and_fund(&s, 0, 300, 200);
    s.client.request_release(&0);
    s.client.release(&0); // window still open
}

#[test]
fn test_dispute_returns_funds() {
    let s = setup();
    open_and_fund(&s, 0, 300, 200);

    s.client.request_release(&0);
    let token_client = token::Client::new(&s.env, &s.asset);
    let b1_before = token_client.balance(&s.inv1);
    let b2_before = token_client.balance(&s.inv2);

    s.client.dispute_release(&0, &s.inv1);

    assert_eq!(token_client.balance(&s.inv1), b1_before + 300);
    assert_eq!(token_client.balance(&s.inv2), b2_before + 200);
    assert_eq!(s.client.get_campaign(&0).state, EscrowState::Refunded);
}

#[test]
#[should_panic(expected = "only investors may dispute")]
fn test_non_investor_cannot_dispute() {
    let s = setup();
    open_and_fund(&s, 0, 300, 0);
    s.client.request_release(&0);
    let stranger = Address::generate(&s.env);
    s.client.dispute_release(&0, &stranger);
}

#[test]
fn test_startup_cancels_refund() {
    let s = setup();
    open_and_fund(&s, 0, 150, 50);
    let token_client = token::Client::new(&s.env, &s.asset);
    let b1 = token_client.balance(&s.inv1);
    s.client.refund(&0);
    assert_eq!(token_client.balance(&s.inv1), b1 + 150);
    assert_eq!(s.client.get_campaign(&0).state, EscrowState::Refunded);
}

#[test]
fn test_request_release_starts_timer() {
    let s = setup();
    open_and_fund(&s, 0, 500, 0);
    s.client.request_release(&0);
    let c = s.client.get_campaign(&0);
    assert_eq!(c.state, EscrowState::MilestoneRequested);
    assert!(c.release_requested_at > 0);
}