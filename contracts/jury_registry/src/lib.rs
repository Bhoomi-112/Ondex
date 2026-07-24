#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, Vec};

#[derive(Clone, PartialEq)]
#[contracttype]
pub enum CaseStatus {
    Voting,
    Resolved,
    Disputed,
    Slashed,
}

#[derive(Clone)]
#[contracttype]
pub struct JurorStakes {
    pub xlm: i128,
    pub platform: i128,
    pub registered_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum Vote {
    For,
    Against,
}

#[derive(Clone)]
#[contracttype]
pub struct VoteRecord {
    pub vote: Vote,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct CaseResult {
    pub status: CaseStatus,
    pub for_votes: u32,
    pub against_votes: u32,
    pub total_votes: u32,
    pub approved: bool,
    pub dispute_window_secs: u64,
    pub resolved_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    JurorStakes(Address),
    CaseJurors(u32),
    CaseVote(u32, Address),
    CaseResult(u32),
    NumCases,
    Registered(Address),
    IdentityRegistry,
    Admin,
    XlmToken,
    PlatformToken,
    Treasury,
    MinXlmStake,
    MinPlatformStake,
    JurySize,
    Quorum,
    SlashPct,
    Initialized,
    ReentrancyLock,
}

#[contract]
pub struct JuryRegistry;

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

fn get_u32(env: &Env, key: DataKey) -> u32 {
    env.storage()
        .instance()
        .get(&key)
        .expect("config not set")
}

fn get_i128(env: &Env, key: DataKey) -> i128 {
    env.storage()
        .instance()
        .get(&key)
        .expect("config not set")
}

fn get_addr(env: &Env, key: DataKey) -> Address {
    env.storage()
        .instance()
        .get(&key)
        .expect("config not set")
}

fn ensure_not_registered(env: &Env, juror: &Address) {
    if env
        .storage()
        .persistent()
        .get::<_, bool>(&DataKey::Registered(juror.clone()))
        .unwrap_or(false)
    {
        panic!("already registered");
    }
}

fn store_registration(env: &Env, juror: Address, xlm_stake: i128, platform_stake: i128) {
    env.storage().persistent().set(
        &DataKey::JurorStakes(juror.clone()),
        &JurorStakes {
            xlm: xlm_stake,
            platform: platform_stake,
            registered_at: env.ledger().timestamp(),
        },
    );
    env.storage()
        .persistent()
        .set(&DataKey::Registered(juror.clone()), &true);

    env.events().publish(
        (symbol_short!("REG"),),
        (juror, xlm_stake, platform_stake),
    );
}

fn self_register(env: &Env, juror: Address, xlm_stake: i128, platform_stake: i128) {
    reentrancy_enter(env);
    ensure_not_registered(env, &juror);

    let min_xlm = get_i128(env, DataKey::MinXlmStake);
    let min_platform = get_i128(env, DataKey::MinPlatformStake);
    if xlm_stake < min_xlm || platform_stake < min_platform {
        panic!("stake below minimum");
    }

    let contract = env.current_contract_address();
    let xlm_token = get_addr(env, DataKey::XlmToken);

    token::Client::new(env, &xlm_token).transfer(&juror, &contract, &xlm_stake);
    if platform_stake > 0 {
        let platform_token = get_addr(env, DataKey::PlatformToken);
        token::Client::new(env, &platform_token).transfer(&juror, &contract, &platform_stake);
    }

    store_registration(env, juror, xlm_stake, platform_stake);
    reentrancy_exit(env);
}

fn sponsored_register(
    env: &Env,
    sponsor: &Address,
    juror: Address,
    xlm_stake: i128,
    platform_stake: i128,
) {
    reentrancy_enter(env);
    ensure_not_registered(env, &juror);

    let min_xlm = get_i128(env, DataKey::MinXlmStake);
    let min_platform = get_i128(env, DataKey::MinPlatformStake);
    if xlm_stake < min_xlm || platform_stake < min_platform {
        panic!("stake below minimum");
    }

    let contract = env.current_contract_address();
    let xlm_token = get_addr(env, DataKey::XlmToken);

    token::Client::new(env, &xlm_token).transfer(sponsor, &contract, &xlm_stake);
    if platform_stake > 0 {
        let platform_token = get_addr(env, DataKey::PlatformToken);
        token::Client::new(env, &platform_token).transfer(sponsor, &contract, &platform_stake);
    }

    store_registration(env, juror, xlm_stake, platform_stake);
    reentrancy_exit(env);
}

#[contractimpl]
impl JuryRegistry {
    pub fn initialize(
        env: Env,
        admin: Address,
        xlm_token: Address,
        platform_token: Address,
        treasury: Address,
        min_xlm_stake: i128,
        min_platform_stake: i128,
        jury_size: u32,
        quorum: u32,
        slash_pct: u32,
    ) {
        if env
            .storage()
            .instance()
            .get::<_, bool>(&DataKey::Initialized)
            .unwrap_or(false)
        {
            panic!("already initialized");
        }
        if min_xlm_stake <= 0 || min_platform_stake < 0 {
            panic!("min stakes must be positive");
        }
        if jury_size == 0 {
            panic!("jury_size must be > 0");
        }
        if quorum == 0 || quorum > jury_size {
            panic!("quorum must be 1..=jury_size");
        }
        if slash_pct > 100 {
            panic!("slash_pct must be 0..=100");
        }

        let instance = env.storage().instance();
        instance.set(&DataKey::Admin, &admin);
        instance.set(&DataKey::XlmToken, &xlm_token);
        instance.set(&DataKey::PlatformToken, &platform_token);
        instance.set(&DataKey::Treasury, &treasury);
        instance.set(&DataKey::MinXlmStake, &min_xlm_stake);
        instance.set(&DataKey::MinPlatformStake, &min_platform_stake);
        instance.set(&DataKey::JurySize, &jury_size);
        instance.set(&DataKey::Quorum, &quorum);
        instance.set(&DataKey::SlashPct, &slash_pct);
        instance.set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::NumCases, &0u32);

        env.events().publish((symbol_short!("INIT"),), (admin,));
    }

    pub fn set_identity_registry(env: Env, identity_registry: Address) {
        require_init(&env);
        let already = env.storage().instance().has(&DataKey::IdentityRegistry);
        if already {
            require_admin(&env);
        }
        env.storage()
            .instance()
            .set(&DataKey::IdentityRegistry, &identity_registry);
        env.events()
            .publish((symbol_short!("SET_ID"),), (identity_registry,));
    }

    pub fn set_min_stakes(env: Env, min_xlm_stake: i128, min_platform_stake: i128) {
        require_init(&env);
        require_admin(&env);
        if min_xlm_stake <= 0 || min_platform_stake < 0 {
            panic!("min stakes must be positive");
        }
        env.storage()
            .instance()
            .set(&DataKey::MinXlmStake, &min_xlm_stake);
        env.storage()
            .instance()
            .set(&DataKey::MinPlatformStake, &min_platform_stake);
        env.events().publish(
            (symbol_short!("SET_MIN"),),
            (min_xlm_stake, min_platform_stake),
        );
    }

    pub fn set_slash_pct(env: Env, slash_pct: u32) {
        require_init(&env);
        require_admin(&env);
        if slash_pct > 100 {
            panic!("slash_pct must be 0..=100");
        }
        env.storage()
            .instance()
            .set(&DataKey::SlashPct, &slash_pct);
        env.events()
            .publish((symbol_short!("SET_SL"),), (slash_pct,));
    }

    pub fn register(env: Env, juror: Address, xlm_stake: i128, platform_stake: i128) {
        juror.require_auth();
        self_register(&env, juror, xlm_stake, platform_stake);
    }

    pub fn sponsored_register(
        env: Env,
        sponsor: Address,
        juror: Address,
        xlm_stake: i128,
        platform_stake: i128,
    ) {
        sponsor.require_auth();
        sponsored_register(&env, &sponsor, juror, xlm_stake, platform_stake);
    }

    pub fn assign(env: Env, case_id: u32, jurors: Vec<Address>, dispute_window_secs: u64) {
        require_init(&env);
        require_admin(&env);

        let jury_size = get_u32(&env, DataKey::JurySize);
        if jurors.len() != jury_size {
            panic!("juror count must equal jury_size");
        }

        let num_cases: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::NumCases)
            .unwrap_or(0);

        for juror in jurors.iter() {
            if !env
                .storage()
                .persistent()
                .get::<_, bool>(&DataKey::Registered(juror.clone()))
                .unwrap_or(false)
            {
                panic!("juror not registered");
            }
        }

        env.storage()
            .persistent()
            .set(&DataKey::CaseJurors(case_id), &jurors);

        env.storage().persistent().set(
            &DataKey::CaseResult(case_id),
            &CaseResult {
                status: CaseStatus::Voting,
                for_votes: 0,
                against_votes: 0,
                total_votes: 0,
                approved: false,
                dispute_window_secs,
                resolved_at: 0,
            },
        );

        if case_id >= num_cases {
            env.storage()
                .persistent()
                .set(&DataKey::NumCases, &(case_id + 1));
        }

        env.events()
            .publish((symbol_short!("ASSIGN"),), (case_id, jurors));
    }

    pub fn vote(env: Env, case_id: u32, juror: Address, vote: Vote) {
        juror.require_auth();

        let case_result: CaseResult = env
            .storage()
            .persistent()
            .get(&DataKey::CaseResult(case_id))
            .expect("case not found");

        if case_result.status != CaseStatus::Voting {
            panic!("case not in voting state");
        }

        let jurors: Vec<Address> = env
            .storage()
            .persistent()
            .get(&DataKey::CaseJurors(case_id))
            .expect("case jurors not found");

        let mut is_assigned = false;
        for j in jurors.iter() {
            if j == juror {
                is_assigned = true;
                break;
            }
        }
        if !is_assigned {
            panic!("juror not assigned to this case");
        }

        if env
            .storage()
            .persistent()
            .get::<_, VoteRecord>(&DataKey::CaseVote(case_id, juror.clone()))
            .is_some()
        {
            panic!("juror already voted");
        }

        env.storage().persistent().set(
            &DataKey::CaseVote(case_id, juror.clone()),
            &VoteRecord {
                vote: vote.clone(),
                timestamp: env.ledger().timestamp(),
            },
        );

        let mut updated = case_result;
        updated.total_votes += 1;
        match vote {
            Vote::For => updated.for_votes += 1,
            Vote::Against => updated.against_votes += 1,
        }

        let quorum = get_u32(&env, DataKey::Quorum);
        if updated.total_votes >= quorum {
            updated.approved = updated.for_votes > updated.against_votes;
            updated.status = CaseStatus::Resolved;
            updated.resolved_at = env.ledger().timestamp();

            env.storage()
                .persistent()
                .set(&DataKey::CaseResult(case_id), &updated);

            env.events().publish(
                (symbol_short!("RESOLVE"),),
                (
                    case_id,
                    updated.for_votes,
                    updated.against_votes,
                    updated.approved,
                ),
            );
            return;
        }

        env.storage()
            .persistent()
            .set(&DataKey::CaseResult(case_id), &updated);

        env.events()
            .publish((symbol_short!("VOTE"),), (case_id, juror, vote));
    }

    pub fn dispute(env: Env, case_id: u32, disputer: Address) {
        disputer.require_auth();

        let case_result: CaseResult = env
            .storage()
            .persistent()
            .get(&DataKey::CaseResult(case_id))
            .expect("case not found");

        if case_result.status != CaseStatus::Resolved {
            panic!("case not resolved");
        }

        let elapsed = env.ledger().timestamp() - case_result.resolved_at;
        if elapsed >= case_result.dispute_window_secs {
            panic!("dispute window closed");
        }

        let mut updated = case_result;
        updated.status = CaseStatus::Disputed;
        env.storage()
            .persistent()
            .set(&DataKey::CaseResult(case_id), &updated);

        env.events()
            .publish((symbol_short!("DISPUTE"),), (case_id, disputer));
    }

    pub fn slash(env: Env, case_id: u32, juror: Address) {
        let case_result: CaseResult = env
            .storage()
            .persistent()
            .get(&DataKey::CaseResult(case_id))
            .expect("case not found");

        if case_result.status != CaseStatus::Disputed {
            panic!("case not disputed");
        }

        let vote_record: VoteRecord = env
            .storage()
            .persistent()
            .get(&DataKey::CaseVote(case_id, juror.clone()))
            .expect("juror did not vote on this case");

        let majority_is_for = case_result.for_votes > case_result.against_votes;

        let dissenting = match (&vote_record.vote, majority_is_for) {
            (Vote::Against, true) => true,
            (Vote::For, false) => true,
            _ => false,
        };

        if !dissenting {
            panic!("juror vote aligns with majority");
        }

        let mut stakes: JurorStakes = env
            .storage()
            .persistent()
            .get(&DataKey::JurorStakes(juror.clone()))
            .expect("juror not found");

        let slash_pct = get_u32(&env, DataKey::SlashPct) as i128;
        let slash_xlm = stakes.xlm * slash_pct / 100;
        let slash_platform = stakes.platform * slash_pct / 100;

        stakes.xlm -= slash_xlm;
        stakes.platform -= slash_platform;

        let xlm_token = get_addr(&env, DataKey::XlmToken);
        let treasury = get_addr(&env, DataKey::Treasury);
        token::Client::new(&env, &xlm_token).transfer(
            &env.current_contract_address(),
            &treasury,
            &slash_xlm,
        );
        if slash_platform > 0 {
            let platform_token = get_addr(&env, DataKey::PlatformToken);
            token::Client::new(&env, &platform_token).transfer(
                &env.current_contract_address(),
                &treasury,
                &slash_platform,
            );
        }

        env.storage()
            .persistent()
            .set(&DataKey::JurorStakes(juror.clone()), &stakes);

        let mut updated = case_result;
        updated.status = CaseStatus::Slashed;
        env.storage()
            .persistent()
            .set(&DataKey::CaseResult(case_id), &updated);

        env.events().publish(
            (symbol_short!("SLASH"),),
            (case_id, juror, stakes.xlm, stakes.platform),
        );
    }

    pub fn get_case(env: Env, case_id: u32) -> CaseResult {
        env.storage()
            .persistent()
            .get(&DataKey::CaseResult(case_id))
            .expect("case not found")
    }

    pub fn juror_stake(env: Env, juror: Address) -> JurorStakes {
        env.storage()
            .persistent()
            .get(&DataKey::JurorStakes(juror))
            .expect("juror not found")
    }

    pub fn is_reg(env: Env, juror: Address) -> bool {
        env.storage()
            .persistent()
            .get::<_, bool>(&DataKey::Registered(juror))
            .unwrap_or(false)
    }

    pub fn id_reg(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::IdentityRegistry)
            .expect("identity registry not set")
    }

    pub fn get_vote(env: Env, case_id: u32, juror: Address) -> VoteRecord {
        env.storage()
            .persistent()
            .get(&DataKey::CaseVote(case_id, juror))
            .expect("vote not found")
    }

    pub fn get_admin(env: Env) -> Address {
        get_addr(&env, DataKey::Admin)
    }

    pub fn get_slash_pct(env: Env) -> u32 {
        get_u32(&env, DataKey::SlashPct)
    }

    pub fn get_jury_size(env: Env) -> u32 {
        get_u32(&env, DataKey::JurySize)
    }

    pub fn get_quorum(env: Env) -> u32 {
        get_u32(&env, DataKey::Quorum)
    }

    pub fn get_min_stakes(env: Env) -> (i128, i128) {
        let min_xlm = get_i128(&env, DataKey::MinXlmStake);
        let min_platform = get_i128(&env, DataKey::MinPlatformStake);
        (min_xlm, min_platform)
    }

    pub fn get_xlm_token(env: Env) -> Address {
        get_addr(&env, DataKey::XlmToken)
    }

    pub fn get_platform_token(env: Env) -> Address {
        get_addr(&env, DataKey::PlatformToken)
    }

    pub fn get_treasury(env: Env) -> Address {
        get_addr(&env, DataKey::Treasury)
    }
}

#[cfg(test)]
mod test;