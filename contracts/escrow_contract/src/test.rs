#![cfg(test)]

extern crate std;

use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

use crate::{EscrowContract, EscrowContractClient, EscrowState};

// Minimal mock jury matching JuryCaseResult layout
#[soroban_sdk::contract]
pub struct MockJury;

#[soroban_sdk::contractimpl]
impl MockJury {
    pub fn set_case(
        env: Env,
        case_id: u32,
        status: crate::JuryCaseStatus,
        approved: bool,
        window: u64,
    ) {
        let result = crate::JuryCaseResult {
            status,
            for_votes: if approved { 2 } else { 0 },
            against_votes: if approved { 0 } else { 2 },
            total_votes: 2,
            resolved_at: env.ledger().timestamp(),
            approved,
            dispute_window_secs: window,
        };
        env.storage()
            .persistent()
            .set(&case_id, &result);
    }

    pub fn get_case(env: Env, case_id: u32) -> crate::JuryCaseResult {
        env.storage()
            .persistent()
            .get(&case_id)
            .expect("case not found")
    }
}

struct Setup {
    env: Env,
    client: EscrowContractClient<'static>,
    admin: Address,
    jury: Address,
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

fn setup(min_bps: u32) -> Setup {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let startup = Address::generate(&env);
    let inv1 = Address::generate(&env);
    let inv2 = Address::generate(&env);
    let asset = create_token(&env, &admin);

    let jury = env.register(MockJury, ());
    let escrow_id = env.register(EscrowContract, ());
    let client = EscrowContractClient::new(&env, &escrow_id);

    client.initialize(&admin, &jury, &min_bps);

    mint(&env, &asset, &inv1, 1_000_000);
    mint(&env, &asset, &inv2, 1_000_000);

    Setup {
        env,
        client,
        admin,
        jury,
        asset,
        startup,
        inv1,
        inv2,
    }
}

fn open_and_fund(s: &Setup, campaign_id: u32, window: u64, a1: i128, a2: i128) {
    s.client
        .open_campaign(&campaign_id, &s.startup, &s.asset, &window);
    if a1 > 0 {
        s.client.deposit(&campaign_id, &s.inv1, &a1);
    }
    if a2 > 0 {
        s.client.deposit(&campaign_id, &s.inv2, &a2);
    }
}

fn set_jury_approved(s: &Setup, case_id: u32, approved: bool, window: u64) {
    s.env.as_contract(&s.jury, || {
        MockJury::set_case(
            &s.env,
            case_id,
            crate::JuryCaseStatus::Resolved,
            approved,
            window,
        );
    });
}

#[test]
fn test_initialize() {
    let s = setup(5000);
    assert_eq!(s.client.get_admin(), s.admin);
    assert_eq!(s.client.get_jury_registry(), s.jury);
    assert_eq!(s.client.get_min_vote_capital_bps(), 5000);
}

#[test]
fn test_deposit_and_release_after_window() {
    let s = setup(5000);
    let window: u64 = 1000;
    open_and_fund(&s, 0, window, 300, 200);
    set_jury_approved(&s, 0, true, window);

    s.client.jury_approved(&0);
    let c = s.client.get_campaign(&0);
    assert_eq!(c.state, EscrowState::JuryApproved);
    assert_eq!(c.total_amount, 500);

    s.env.ledger().with_mut(|li| {
        li.timestamp = c.dispute_deadline;
    });

    let token_client = token::Client::new(&s.env, &s.asset);
    let before = token_client.balance(&s.startup);
    s.client.release(&0);
    assert_eq!(token_client.balance(&s.startup), before + 500);
    assert_eq!(s.client.get_campaign(&0).state, EscrowState::Released);
}

#[test]
#[should_panic(expected = "jury has not approved this campaign")]
fn test_jury_not_approved_blocks() {
    let s = setup(5000);
    open_and_fund(&s, 0, 1000, 100, 0);
    set_jury_approved(&s, 0, false, 1000);
    s.client.jury_approved(&0);
}

#[test]
fn test_capital_weighted_override_release() {
    let s = setup(5000);
    let window: u64 = 10_000;
    open_and_fund(&s, 0, window, 700, 300);
    set_jury_approved(&s, 0, true, window);
    s.client.jury_approved(&0);

    s.client.dispute(&0, &s.inv1);
    // inv1 has 700 weight FOR, inv2 300 AGAINST → FOR wins
    s.client.investor_vote(&0, &s.inv1, &true);
    s.client.investor_vote(&0, &s.inv2, &false);

    let token_client = token::Client::new(&s.env, &s.asset);
    let before = token_client.balance(&s.startup);
    s.client.release(&0);
    assert_eq!(token_client.balance(&s.startup), before + 1000);
}

#[test]
fn test_capital_weighted_override_refund() {
    let s = setup(5000);
    let window: u64 = 10_000;
    open_and_fund(&s, 0, window, 200, 800);
    set_jury_approved(&s, 0, true, window);
    s.client.jury_approved(&0);

    s.client.dispute(&0, &s.inv2);
    s.client.investor_vote(&0, &s.inv1, &true);
    s.client.investor_vote(&0, &s.inv2, &false);

    let token_client = token::Client::new(&s.env, &s.asset);
    let b1 = token_client.balance(&s.inv1);
    let b2 = token_client.balance(&s.inv2);
    s.client.refund(&0);
    assert_eq!(token_client.balance(&s.inv1), b1 + 200);
    assert_eq!(token_client.balance(&s.inv2), b2 + 800);
    assert_eq!(s.client.get_campaign(&0).state, EscrowState::Refunded);
}

#[test]
#[should_panic(expected = "insufficient capital participation")]
fn test_participation_threshold() {
    let s = setup(8000); // need 80% of capital
    open_and_fund(&s, 0, 10_000, 900, 100);
    set_jury_approved(&s, 0, true, 10_000);
    s.client.jury_approved(&0);
    s.client.dispute(&0, &s.inv1);
    // only inv2 votes (100 < 80% of 1000)
    s.client.investor_vote(&0, &s.inv2, &true);
    s.client.release(&0);
}

#[test]
fn test_active_refund_by_startup() {
    let s = setup(5000);
    open_and_fund(&s, 0, 1000, 150, 50);
    let token_client = token::Client::new(&s.env, &s.asset);
    let b1 = token_client.balance(&s.inv1);
    s.client.refund(&0);
    assert_eq!(token_client.balance(&s.inv1), b1 + 150);
}

#[test]
fn test_admin_set_bps() {
    let s = setup(5000);
    s.client.set_min_vote_capital_bps(&2500);
    assert_eq!(s.client.get_min_vote_capital_bps(), 2500);
}
