#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, Map};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Initialized,
    StartupProfile(Address),
    InvestorProfile(Address),
    StartupIndex,
    InvestorIndex,
}

#[derive(Clone)]
#[contracttype]
pub struct StartupProfile {
    pub name: Bytes,
    pub description: Bytes,
    pub industry_tags: Bytes,
    pub funding_ask: i128,
    pub equity_offered: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct InvestorProfile {
    pub preferred_industries: Bytes,
    pub min_ticket: i128,
    pub max_ticket: i128,
    pub preferred_stage: Bytes,
    pub kyc_hash: Bytes,
}

#[contract]
pub struct IdentityRegistry;

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

#[contractimpl]
impl IdentityRegistry {
    pub fn initialize(env: Env, admin: Address) {
        if env
            .storage()
            .instance()
            .get::<_, bool>(&DataKey::Initialized)
            .unwrap_or(false)
        {
            panic!("already initialized");
        }
        env.storage()
            .instance()
            .set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::Initialized, &true);
        env.storage()
            .persistent()
            .set(&DataKey::StartupIndex, &Map::<Address, bool>::new(&env));
        env.storage()
            .persistent()
            .set(&DataKey::InvestorIndex, &Map::<Address, bool>::new(&env));
        env.events()
            .publish((symbol_short!("INIT"),), (admin,));
    }

    pub fn register_startup(
        env: Env,
        wallet: Address,
        name: Bytes,
        description: Bytes,
        industry_tags: Bytes,
        funding_ask: i128,
        equity_offered: u32,
    ) {
        require_init(&env);
        wallet.require_auth();

        if env
            .storage()
            .persistent()
            .has(&DataKey::StartupProfile(wallet.clone()))
        {
            panic!("startup already registered");
        }

        if funding_ask <= 0 {
            panic!("funding_ask must be positive");
        }
        if equity_offered == 0 || equity_offered > 100 {
            panic!("equity_offered must be 1..=100");
        }

        let profile = StartupProfile {
            name,
            description,
            industry_tags,
            funding_ask,
            equity_offered,
        };

        env.storage()
            .persistent()
            .set(&DataKey::StartupProfile(wallet.clone()), &profile);

        let mut index: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&DataKey::StartupIndex)
            .unwrap_or(Map::new(&env));
        index.set(wallet.clone(), true);
        env.storage()
            .persistent()
            .set(&DataKey::StartupIndex, &index);

        env.events()
            .publish((symbol_short!("REG_STR"),), (wallet,));
    }

    pub fn register_investor(
        env: Env,
        wallet: Address,
        preferred_industries: Bytes,
        min_ticket: i128,
        max_ticket: i128,
        preferred_stage: Bytes,
        kyc_hash: Bytes,
    ) {
        require_init(&env);
        wallet.require_auth();

        if env
            .storage()
            .persistent()
            .has(&DataKey::InvestorProfile(wallet.clone()))
        {
            panic!("investor already registered");
        }

        if min_ticket <= 0 || max_ticket <= 0 || max_ticket < min_ticket {
            panic!("invalid ticket range");
        }

        let profile = InvestorProfile {
            preferred_industries,
            min_ticket,
            max_ticket,
            preferred_stage,
            kyc_hash,
        };

        env.storage()
            .persistent()
            .set(&DataKey::InvestorProfile(wallet.clone()), &profile);

        let mut index: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&DataKey::InvestorIndex)
            .unwrap_or(Map::new(&env));
        index.set(wallet.clone(), true);
        env.storage()
            .persistent()
            .set(&DataKey::InvestorIndex, &index);

        env.events()
            .publish((symbol_short!("REG_INV"),), (wallet,));
    }

    pub fn get_startup(env: Env, wallet: Address) -> StartupProfile {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::StartupProfile(wallet))
            .expect("startup not found")
    }

    pub fn get_investor(env: Env, wallet: Address) -> InvestorProfile {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::InvestorProfile(wallet))
            .expect("investor not found")
    }

    pub fn is_startup(env: Env, wallet: Address) -> bool {
        require_init(&env);
        env.storage()
            .persistent()
            .has(&DataKey::StartupProfile(wallet))
    }

    pub fn is_investor(env: Env, wallet: Address) -> bool {
        require_init(&env);
        env.storage()
            .persistent()
            .has(&DataKey::InvestorProfile(wallet))
    }

    pub fn list_startups(env: Env) -> Map<Address, bool> {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::StartupIndex)
            .unwrap_or(Map::new(&env))
    }

    pub fn list_investors(env: Env) -> Map<Address, bool> {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::InvestorIndex)
            .unwrap_or(Map::new(&env))
    }
}

#[cfg(test)]
mod test;