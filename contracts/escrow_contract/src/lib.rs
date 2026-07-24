#![no_std]
#![allow(deprecated)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Map,
};

#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum EscrowState {
    Active,
    MilestoneRequested,
    Released,
    Refunded,
}

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub startup: Address,
    pub asset: Address,
    pub total_amount: i128,
    pub state: EscrowState,
    pub created_at: u64,
    pub dispute_window_secs: u64,
    pub release_requested_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Initialized,
    ReentrancyLock,
    Campaign(u32),
    InvestorDeposit(u32, Address),
    Investors(u32),
    NumCampaigns,
}

#[contract]
pub struct EscrowContract;

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
    pub fn initialize(env: Env, admin: Address, dispute_window_secs: u64) {
        if env
            .storage()
            .instance()
            .get::<_, bool>(&DataKey::Initialized)
            .unwrap_or(false)
        {
            panic!("already initialized");
        }
        if dispute_window_secs == 0 {
            panic!("dispute_window_secs must be > 0");
        }

        let instance = env.storage().instance();
        instance.set(&DataKey::Admin, &admin);
        instance.set(&DataKey::Initialized, &true);
        env.storage()
            .persistent()
            .set(&DataKey::NumCampaigns, &0u32);

        env.events().publish(
            (symbol_short!("INIT"),),
            (admin, dispute_window_secs),
        );
    }

    /// Default dispute window used for new campaigns
    pub fn get_dispute_window(env: Env) -> u64 {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set");
        7 * 24 * 3600 // 7 days default
    }

    pub fn open_campaign(
        env: Env,
        campaign_id: u32,
        startup: Address,
        asset: Address,
    ) -> u32 {
        require_init(&env);
        require_admin(&env);

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
            dispute_window_secs: 7 * 24 * 3600,
            release_requested_at: 0,
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
            (campaign_id, startup, asset),
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

    /// Startup requests milestone release. Starts dispute window.
    pub fn request_release(env: Env, campaign_id: u32) {
        require_init(&env);

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        campaign.startup.require_auth();

        if campaign.state != EscrowState::Active {
            panic!("campaign not in active state");
        }
        if campaign.total_amount <= 0 {
            panic!("campaign has no deposits");
        }

        campaign.state = EscrowState::MilestoneRequested;
        campaign.release_requested_at = env.ledger().timestamp();
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            (symbol_short!("REQ_REL"),),
            (campaign_id, campaign.release_requested_at),
        );
    }

    /// Investor disputes the release within the window. Funds go back to investors.
    pub fn dispute_release(env: Env, campaign_id: u32, disputer: Address) {
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

        let campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::MilestoneRequested {
            panic!("release not requested");
        }

        let now = env.ledger().timestamp();
        if now > campaign.release_requested_at + campaign.dispute_window_secs {
            panic!("dispute window closed");
        }

        // Dispute → refund all investors
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

        // Refund happen inline on dispute
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

        let mut updated = campaign;
        updated.state = EscrowState::Refunded;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &updated);

        reentrancy_exit(&env);

        env.events()
            .publish((symbol_short!("DISPUTE"),), (campaign_id, disputer, total));
    }

    /// Anyone can trigger release after dispute window expires.
    pub fn release(env: Env, campaign_id: u32) {
        require_init(&env);

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::MilestoneRequested {
            panic!("release not requested");
        }

        let now = env.ledger().timestamp();
        if now < campaign.release_requested_at + campaign.dispute_window_secs {
            panic!("dispute window still open");
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

    /// Cancel campaign before any deposit. Refund all investors.
    pub fn refund(env: Env, campaign_id: u32) {
        require_init(&env);

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        campaign.startup.require_auth();

        if campaign.state != EscrowState::Active {
            panic!("campaign not in active state");
        }
        if campaign.total_amount <= 0 {
            panic!("campaign has no deposits");
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

    pub fn get_admin(env: Env) -> Address {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("admin not set")
    }
}

#[cfg(test)]
mod test;