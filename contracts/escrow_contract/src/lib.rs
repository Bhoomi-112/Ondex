#![no_std]
#![allow(deprecated)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, IntoVal, Map,
};

#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum EscrowState {
    Active,
    JuryApproved,
    DisputeOpen,
    Released,
    Refunded,
}

#[derive(Clone, PartialEq)]
#[contracttype]
pub enum JuryCaseStatus {
    Voting,
    Resolved,
    Disputed,
    Slashed,
}

#[derive(Clone)]
#[contracttype]
pub struct JuryCaseResult {
    pub status: JuryCaseStatus,
    pub for_votes: u32,
    pub against_votes: u32,
    pub total_votes: u32,
    pub resolved_at: u64,
    pub approved: bool,
    pub dispute_window_secs: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub startup: Address,
    pub asset: Address,
    pub total_amount: i128,
    pub state: EscrowState,
    pub created_at: u64,
    pub approved_at: u64,
    pub dispute_deadline: u64,
    pub dispute_window_secs: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct WeightedVoteCount {
    pub for_weight: i128,
    pub against_weight: i128,
    pub voted_capital: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    JuryRegistry,
    MinVoteCapitalBps,
    Initialized,
    /// Reentrancy guard flag for fund-moving entrypoints
    ReentrancyLock,
    Campaign(u32),
    InvestorDeposit(u32, Address),
    Investors(u32),
    InvestorVote(u32, Address),
    WeightedVotes(u32),
    NumCampaigns,
}

#[contract]
pub struct EscrowContract;

// TODO(security-audit): External third-party security audit required before
// mainnet deployment / handling real funds. Code review alone is insufficient.
// See docs/THREAT_MODEL.md — Smart Contract Layer.

fn require_init(env: &Env) {
    if !env
        .storage()
        .instance()
        .get::<_, bool>(&DataKey::Initialized)
        .unwrap_or(false)
    {
        panic!("not initialized");
    }
}

fn require_admin(env: &Env) {
    let admin: Address = env
        .storage()
        .instance()
        .get(&DataKey::Admin)
        .expect("admin not set");
    admin.require_auth();
}

/// Reentrancy guard: set lock before external token transfers / cross-contract calls.
fn reentrancy_enter(env: &Env) {
    let locked: bool = env
        .storage()
        .instance()
        .get(&DataKey::ReentrancyLock)
        .unwrap_or(false);
    if locked {
        panic!("reentrancy");
    }
    env.storage()
        .instance()
        .set(&DataKey::ReentrancyLock, &true);
}

fn reentrancy_exit(env: &Env) {
    env.storage()
        .instance()
        .set(&DataKey::ReentrancyLock, &false);
}

#[contractimpl]
impl EscrowContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        jury_registry: Address,
        min_vote_capital_bps: u32,
    ) {
        if env
            .storage()
            .instance()
            .get::<_, bool>(&DataKey::Initialized)
            .unwrap_or(false)
        {
            panic!("already initialized");
        }
        if min_vote_capital_bps == 0 || min_vote_capital_bps > 10_000 {
            panic!("min_vote_capital_bps must be 1..=10000");
        }

        // Admin is stored as config; deployer signs the init tx (admin key not required at deploy).

        let instance = env.storage().instance();
        instance.set(&DataKey::Admin, &admin);
        instance.set(&DataKey::JuryRegistry, &jury_registry);
        instance.set(&DataKey::MinVoteCapitalBps, &min_vote_capital_bps);
        instance.set(&DataKey::Initialized, &true);
        env.storage()
            .persistent()
            .set(&DataKey::NumCampaigns, &0u32);

        env.events().publish(
            (symbol_short!("INIT"),),
            (admin, jury_registry, min_vote_capital_bps),
        );
    }

    pub fn set_min_vote_capital_bps(env: Env, min_vote_capital_bps: u32) {
        require_init(&env);
        require_admin(&env);
        if min_vote_capital_bps == 0 || min_vote_capital_bps > 10_000 {
            panic!("min_vote_capital_bps must be 1..=10000");
        }
        env.storage()
            .instance()
            .set(&DataKey::MinVoteCapitalBps, &min_vote_capital_bps);
        env.events()
            .publish((symbol_short!("SET_BPS"),), (min_vote_capital_bps,));
    }

    pub fn set_jury_registry(env: Env, jury_registry: Address) {
        require_init(&env);
        require_admin(&env);
        env.storage()
            .instance()
            .set(&DataKey::JuryRegistry, &jury_registry);
        env.events()
            .publish((symbol_short!("SET_JURY"),), (jury_registry,));
    }

    /// Creates campaign shell (admin). Investors then `deposit`.
    pub fn open_campaign(
        env: Env,
        campaign_id: u32,
        startup: Address,
        asset: Address,
        dispute_window_secs: u64,
    ) -> u32 {
        require_init(&env);
        require_admin(&env);

        if dispute_window_secs == 0 {
            panic!("dispute_window_secs must be > 0");
        }
        if env
            .storage()
            .persistent()
            .has(&DataKey::Campaign(campaign_id))
        {
            panic!("campaign already exists");
        }

        let campaign = Campaign {
            startup: startup.clone(),
            asset: asset.clone(),
            total_amount: 0,
            state: EscrowState::Active,
            created_at: env.ledger().timestamp(),
            approved_at: 0,
            dispute_deadline: 0,
            dispute_window_secs,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        env.storage()
            .persistent()
            .set(&DataKey::Investors(campaign_id), &Map::<Address, bool>::new(&env));

        let num: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::NumCampaigns)
            .unwrap_or(0);
        if campaign_id >= num {
            env.storage()
                .persistent()
                .set(&DataKey::NumCampaigns, &(campaign_id + 1));
        }

        env.events().publish(
            (symbol_short!("OPEN"),),
            (campaign_id, startup, asset, dispute_window_secs),
        );

        campaign_id
    }

    pub fn deposit(env: Env, campaign_id: u32, investor: Address, amount: i128) {
        require_init(&env);
        investor.require_auth();

        if amount <= 0 {
            panic!("amount must be positive");
        }

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::Active {
            panic!("campaign not accepting deposits");
        }

        reentrancy_enter(&env);

        let prev: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::InvestorDeposit(campaign_id, investor.clone()))
            .unwrap_or(0);
        env.storage().persistent().set(
            &DataKey::InvestorDeposit(campaign_id, investor.clone()),
            &(prev + amount),
        );

        let mut investors: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&DataKey::Investors(campaign_id))
            .unwrap_or(Map::new(&env));
        investors.set(investor.clone(), true);
        env.storage()
            .persistent()
            .set(&DataKey::Investors(campaign_id), &investors);

        campaign.total_amount += amount;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        let contract = env.current_contract_address();
        token::Client::new(&env, &campaign.asset).transfer(&investor, &contract, &amount);

        reentrancy_exit(&env);

        env.events().publish(
            (symbol_short!("DEPOSIT"),),
            (campaign_id, investor, amount, campaign.total_amount),
        );
    }

    pub fn jury_approved(env: Env, campaign_id: u32) {
        require_init(&env);

        let jury_registry_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set");

        let case_result: JuryCaseResult = env.invoke_contract(
            &jury_registry_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, campaign_id.into_val(&env)],
        );

        if case_result.status != JuryCaseStatus::Resolved || !case_result.approved {
            panic!("jury has not approved this campaign");
        }

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::Active {
            panic!("campaign not in active state");
        }
        if campaign.total_amount <= 0 {
            panic!("campaign has no deposits");
        }

        let now = env.ledger().timestamp();
        campaign.state = EscrowState::JuryApproved;
        campaign.approved_at = now;
        campaign.dispute_deadline = now + campaign.dispute_window_secs;

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            (symbol_short!("APPROVED"),),
            (campaign_id, now, campaign.dispute_deadline),
        );
    }

    pub fn dispute(env: Env, campaign_id: u32, disputer: Address) {
        require_init(&env);
        disputer.require_auth();

        let deposit: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::InvestorDeposit(campaign_id, disputer.clone()))
            .unwrap_or(0);
        if deposit <= 0 {
            panic!("only investors may dispute");
        }

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::JuryApproved {
            panic!("can only dispute after jury approval");
        }

        let now = env.ledger().timestamp();
        if now >= campaign.dispute_deadline {
            panic!("dispute window closed");
        }

        campaign.state = EscrowState::DisputeOpen;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.storage().persistent().set(
            &DataKey::WeightedVotes(campaign_id),
            &WeightedVoteCount {
                for_weight: 0,
                against_weight: 0,
                voted_capital: 0,
            },
        );

        env.events()
            .publish((symbol_short!("DISPUTE"),), (campaign_id, disputer));
    }

    pub fn investor_vote(env: Env, campaign_id: u32, investor: Address, approve: bool) {
        require_init(&env);
        investor.require_auth();

        let campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::DisputeOpen {
            panic!("can only vote during dispute");
        }

        let weight: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::InvestorDeposit(campaign_id, investor.clone()))
            .unwrap_or(0);
        if weight <= 0 {
            panic!("only investors may vote");
        }

        if env
            .storage()
            .persistent()
            .has(&DataKey::InvestorVote(campaign_id, investor.clone()))
        {
            panic!("investor already voted");
        }

        env.storage().persistent().set(
            &DataKey::InvestorVote(campaign_id, investor.clone()),
            &approve,
        );

        let mut counts: WeightedVoteCount = env
            .storage()
            .persistent()
            .get(&DataKey::WeightedVotes(campaign_id))
            .unwrap_or(WeightedVoteCount {
                for_weight: 0,
                against_weight: 0,
                voted_capital: 0,
            });

        if approve {
            counts.for_weight += weight;
        } else {
            counts.against_weight += weight;
        }
        counts.voted_capital += weight;

        env.storage()
            .persistent()
            .set(&DataKey::WeightedVotes(campaign_id), &counts);

        env.events().publish(
            (symbol_short!("INV_VOTE"),),
            (campaign_id, investor, approve, weight),
        );
    }

    pub fn release(env: Env, campaign_id: u32) {
        require_init(&env);

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        match campaign.state {
            EscrowState::JuryApproved => {
                let now = env.ledger().timestamp();
                if now < campaign.dispute_deadline {
                    panic!("dispute window still open");
                }
            }
            EscrowState::DisputeOpen => {
                let counts: WeightedVoteCount = env
                    .storage()
                    .persistent()
                    .get(&DataKey::WeightedVotes(campaign_id))
                    .expect("no investor votes");

                let min_bps: u32 = env
                    .storage()
                    .instance()
                    .get(&DataKey::MinVoteCapitalBps)
                    .expect("min_vote_capital_bps not set");

                let required = campaign.total_amount * (min_bps as i128) / 10_000;
                if counts.voted_capital < required {
                    panic!("insufficient capital participation");
                }
                if counts.for_weight <= counts.against_weight {
                    panic!("investor capital majority did not approve release");
                }
            }
            _ => panic!("campaign not in releasable state"),
        }

        let amount = campaign.total_amount;
        let startup = campaign.startup.clone();
        let asset = campaign.asset.clone();
        let contract = env.current_contract_address();

        reentrancy_enter(&env);

        campaign.state = EscrowState::Released;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        token::Client::new(&env, &asset).transfer(&contract, &startup, &amount);

        reentrancy_exit(&env);

        env.events().publish(
            (symbol_short!("RELEASE"),),
            (campaign_id, startup, amount),
        );
    }

    pub fn refund(env: Env, campaign_id: u32) {
        require_init(&env);

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        match campaign.state {
            EscrowState::Active => {
                campaign.startup.require_auth();
            }
            EscrowState::DisputeOpen => {
                let counts: WeightedVoteCount = env
                    .storage()
                    .persistent()
                    .get(&DataKey::WeightedVotes(campaign_id))
                    .expect("no investor votes");

                let min_bps: u32 = env
                    .storage()
                    .instance()
                    .get(&DataKey::MinVoteCapitalBps)
                    .expect("min_vote_capital_bps not set");

                let required = campaign.total_amount * (min_bps as i128) / 10_000;
                if counts.voted_capital < required {
                    panic!("insufficient capital participation");
                }
                if counts.against_weight <= counts.for_weight {
                    panic!("investor capital majority did not approve refund");
                }
            }
            _ => panic!("campaign not in refundable state"),
        }

        let investors: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&DataKey::Investors(campaign_id))
            .expect("investors not found");

        let contract = env.current_contract_address();
        let asset = campaign.asset.clone();
        let token_client = token::Client::new(&env, &asset);
        let total = campaign.total_amount;

        reentrancy_enter(&env);

        campaign.state = EscrowState::Refunded;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        for investor in investors.keys() {
            let amt: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::InvestorDeposit(campaign_id, investor.clone()))
                .unwrap_or(0);
            if amt > 0 {
                token_client.transfer(&contract, &investor, &amt);
            }
        }

        reentrancy_exit(&env);

        env.events()
            .publish((symbol_short!("REFUND"),), (campaign_id, total));
    }

    pub fn get_campaign(env: Env, campaign_id: u32) -> Campaign {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found")
    }

    pub fn get_deposit(env: Env, campaign_id: u32, investor: Address) -> i128 {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::InvestorDeposit(campaign_id, investor))
            .unwrap_or(0)
    }

    pub fn get_weighted_votes(env: Env, campaign_id: u32) -> WeightedVoteCount {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::WeightedVotes(campaign_id))
            .unwrap_or(WeightedVoteCount {
                for_weight: 0,
                against_weight: 0,
                voted_capital: 0,
            })
    }

    pub fn get_investor_vote(env: Env, campaign_id: u32, investor: Address) -> bool {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::InvestorVote(campaign_id, investor))
            .expect("investor has not voted")
    }

    pub fn get_jury_registry(env: Env) -> Address {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set")
    }

    pub fn get_admin(env: Env) -> Address {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set")
    }

    pub fn get_min_vote_capital_bps(env: Env) -> u32 {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::MinVoteCapitalBps)
            .expect("min_vote_capital_bps not set")
    }
}

#[cfg(test)]
mod test;
