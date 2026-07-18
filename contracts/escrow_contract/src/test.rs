#![cfg(test)]

extern crate std;

use soroban_sdk::{symbol_short, Address, Env};

use crate::{
    Campaign, DataKey, EscrowContract, EscrowState, InvestorVoteCount, JuryCaseResult,
    JuryCaseStatus,
};

#[derive(Clone)]
#[soroban_sdk::contracttype]
pub enum MockJuryCaseStatus {
    Voting,
    Resolved,
    Disputed,
    Slashed,
}

#[derive(Clone)]
#[soroban_sdk::contracttype]
pub struct MockJuryCaseResult {
    pub status: MockJuryCaseStatus,
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
            MockJuryCaseStatus::Resolved
        } else {
            MockJuryCaseStatus::Voting
        };
        let result = MockJuryCaseResult {
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

    pub fn get_case(env: Env, case_id: u32) -> MockJuryCaseResult {
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

fn setup() -> (Env, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let startup = Address::generate(&env);
    let investor = Address::generate(&env);
    let jury_addr = Address::generate(&env);

    env.register(&admin, EscrowContract);
    env.register(&jury_addr, MockJuryRegistry);

    env.as_contract(&admin, || {
        EscrowContract::initialize(&env, jury_addr.clone(), 259200);
    });

    (env, admin, startup, investor)
}

fn deposit(env: &Env, admin: &Address, startup: &Address, investor: &Address, amount: i128) -> u32 {
    env.as_contract(admin, || {
        EscrowContract::deposit(
            &env,
            0,
            startup.clone(),
            investor.clone(),
            amount,
            soroban_sdk::Address::generate(env),
        )
    })
}

fn setup_jury_resolved(env: &Env, jury_addr: &Address, case_id: u32) {
    env.as_contract(jury_addr, || {
        MockJuryRegistry::init_mock(env, case_id, true);
    });
}

fn setup_jury_voting(env: &Env, jury_addr: &Address, case_id: u32) {
    env.as_contract(jury_addr, || {
        MockJuryRegistry::init_mock(env, case_id, false);
    });
}

#[test]
fn test_initialize() {
    let (env, admin, _, _) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });
    let window: u64 = env.as_contract(&admin, || {
        EscrowContract::get_dispute_window(&env)
    });
    assert_eq!(window, 259200);
    let num: u32 = env.as_contract(&admin, || {
        env.storage()
            .persistent()
            .get::<_, u32>(&DataKey::NumCampaigns)
            .unwrap_or(0)
    });
    assert_eq!(num, 0);
}

#[test]
fn test_deposit() {
    let (env, admin, startup, investor) = setup();

    let campaign_id = deposit(&env, &admin, &startup, &investor, 1000);

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::Active);
    assert_eq!(campaign.amount, 1000);
    assert_eq!(campaign.investor, investor);
    assert_eq!(campaign.startup, startup);
}

#[test]
#[should_panic(expected = "amount must be positive")]
fn test_deposit_zero_amount() {
    let (env, admin, startup, investor) = setup();
    deposit(&env, &admin, &startup, &investor, 0);
}

#[test]
#[should_panic(expected = "amount must be positive")]
fn test_deposit_negative_amount() {
    let (env, admin, startup, investor) = setup();
    deposit(&env, &admin, &startup, &investor, -100);
}

#[test]
fn test_jury_approved_resolves() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::JuryApproved);
    assert!(campaign.approved_at > 0);
    assert_eq!(campaign.dispute_deadline, campaign.approved_at + 259200);
}

#[test]
#[should_panic(expected = "jury has not approved this campaign")]
fn test_jury_approved_voting_state() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_voting(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });
}

#[test]
#[should_panic(expected = "campaign not in active state")]
fn test_jury_approved_twice() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::jury_approved(&env, campaign_id);
    });
}

#[test]
fn test_dispute_within_window() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });

    let disputer = soroban_sdk::Address::generate(&env);
    env.as_contract(&admin, || {
        EscrowContract::dispute(&env, campaign_id, disputer);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::DisputeOpen);
}

#[test]
#[should_panic(expected = "can only dispute after jury approval")]
fn test_dispute_on_active_campaign() {
    let (env, admin, startup, investor) = setup();
    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    let disputer = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::dispute(&env, campaign_id, disputer);
    });
}

#[test]
fn test_release_after_window_no_dispute() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });

    let dispute_window: u64 = env.as_contract(&admin, || {
        EscrowContract::get_dispute_window(&env)
    });

    env.ledger().set_timestamp(
        env.ledger().get_timestamp() + dispute_window + 1,
    );

    env.as_contract(&admin, || {
        EscrowContract::release(&env, campaign_id);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::Released);
}

#[test]
#[should_panic(expected = "dispute window still open")]
fn test_release_during_window() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::release(&env, campaign_id);
    });
}

#[test]
fn test_release_dispute_open_investor_majority_for() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::dispute(&env, campaign_id, soroban_sdk::Address::generate(&env));
    });

    let inv1 = soroban_sdk::Address::generate(&env);
    let inv2 = soroban_sdk::Address::generate(&env);
    let inv3 = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1, true);
        EscrowContract::investor_vote(&env, campaign_id, inv2, true);
        EscrowContract::investor_vote(&env, campaign_id, inv3, true);
    });

    env.as_contract(&admin, || {
        EscrowContract::release(&env, campaign_id);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::Released);
}

#[test]
#[should_panic(expected = "investor majority did not approve release")]
fn test_release_dispute_open_investor_majority_against() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::dispute(&env, campaign_id, soroban_sdk::Address::generate(&env));
    });

    let inv1 = soroban_sdk::Address::generate(&env);
    let inv2 = soroban_sdk::Address::generate(&env);
    let inv3 = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1, true);
        EscrowContract::investor_vote(&env, campaign_id, inv2, false);
        EscrowContract::investor_vote(&env, campaign_id, inv3, false);
    });

    env.as_contract(&admin, || {
        EscrowContract::release(&env, campaign_id);
    });
}

#[test]
#[should_panic(expected = "no investor votes cast")]
fn test_release_dispute_open_no_votes() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::dispute(&env, campaign_id, soroban_sdk::Address::generate(&env));
        EscrowContract::release(&env, campaign_id);
    });
}

#[test]
fn test_investor_vote_counts() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::dispute(&env, campaign_id, soroban_sdk::Address::generate(&env));
    });

    let inv1 = soroban_sdk::Address::generate(&env);
    let inv2 = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1.clone(), true);
        EscrowContract::investor_vote(&env, campaign_id, inv2.clone(), false);
    });

    let counts: InvestorVoteCount = env.as_contract(&admin, || {
        EscrowContract::get_investor_vote_count(&env, campaign_id)
    });
    assert_eq!(counts.for_release, 1);
    assert_eq!(counts.against_release, 1);

    let vote1: bool = env.as_contract(&admin, || {
        EscrowContract::get_investor_vote(&env, campaign_id, inv1)
    });
    assert!(vote1);

    let vote2: bool = env.as_contract(&admin, || {
        EscrowContract::get_investor_vote(&env, campaign_id, inv2)
    });
    assert!(!vote2);
}

#[test]
#[should_panic(expected = "investor already voted")]
fn test_investor_double_vote() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::dispute(&env, campaign_id, soroban_sdk::Address::generate(&env));
    });

    let inv1 = soroban_sdk::Address::generate(&env);
    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1.clone(), true);
        EscrowContract::investor_vote(&env, campaign_id, inv1, false);
    });
}

#[test]
#[should_panic(expected = "can only vote during dispute")]
fn test_investor_vote_outside_dispute() {
    let (env, admin, startup, investor) = setup();

    let campaign_id = deposit(&env, &admin, &startup, &investor, 5000);
    let inv1 = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1, true);
    });
}

#[test]
fn test_refund_by_startup() {
    let (env, admin, startup, investor) = setup();

    let campaign_id = deposit(&env, &admin, &startup, &investor, 2000);

    env.as_contract(&admin, || {
        EscrowContract::refund(&env, campaign_id);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::Refunded);
}

#[test]
#[should_panic(expected = "can only refund active campaigns")]
fn test_refund_after_jury_approved() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 2000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
        EscrowContract::refund(&env, campaign_id);
    });
}

#[test]
#[should_panic(expected = "can only refund active campaigns")]
fn test_refund_after_release() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 2000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });

    env.ledger().set_timestamp(
        env.ledger().get_timestamp() + 259201,
    );

    env.as_contract(&admin, || {
        EscrowContract::release(&env, campaign_id);
        EscrowContract::refund(&env, campaign_id);
    });
}

#[test]
fn test_full_lifecycle_dispute_then_release() {
    let (env, admin, startup, investor) = setup();
    let jury_addr: Address = env.as_contract(&admin, || {
        EscrowContract::get_jury_registry(&env)
    });

    let campaign_id = deposit(&env, &admin, &startup, &investor, 10000);
    setup_jury_resolved(&env, &jury_addr, campaign_id);

    env.as_contract(&admin, || {
        EscrowContract::jury_approved(&env, campaign_id);
    });

    let disputer = soroban_sdk::Address::generate(&env);
    env.as_contract(&admin, || {
        EscrowContract::dispute(&env, campaign_id, disputer);
    });

    let inv1 = soroban_sdk::Address::generate(&env);
    let inv2 = soroban_sdk::Address::generate(&env);

    env.as_contract(&admin, || {
        EscrowContract::investor_vote(&env, campaign_id, inv1, true);
        EscrowContract::investor_vote(&env, campaign_id, inv2, true);
    });

    env.as_contract(&admin, || {
        EscrowContract::release(&env, campaign_id);
    });

    let campaign: Campaign = env.as_contract(&admin, || {
        EscrowContract::get_campaign(&env, campaign_id)
    });
    assert_eq!(campaign.state, EscrowState::Released);
    assert_eq!(campaign.amount, 10000);
}
