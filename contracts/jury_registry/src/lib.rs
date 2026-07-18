#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Vec,
};

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
    pub resolved_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    JurorStakes(Address),
    CaseJurors(u32),
    CaseVote(u32, Address),
    CaseResult(u32),
    DisputeWindow,
    NumCases,
    Registered(Address),
    IdentityRegistry,
}

#[contract]
pub struct JuryRegistry;

#[contractimpl]
impl JuryRegistry {
    pub fn initialize(env: Env, admin: Address, dispute_window_secs: u64) {
        env.storage()
            .persistent()
            .set(&DataKey::DisputeWindow, &dispute_window_secs);
        env.storage()
            .persistent()
            .set(&DataKey::NumCases, &0u32);
        env.storage()
            .persistent()
            .set(&DataKey::Registered(admin.clone()), &true);
        env.events().publish(
            (symbol_short!("INIT"),),
            (admin, dispute_window_secs),
        );
    }

    pub fn set_identity_registry(env: Env, identity_registry: Address) {
        env.storage().persistent().set(
            &DataKey::IdentityRegistry,
            &identity_registry,
        );
    }

    pub fn register(env: Env, juror: Address, xlm_stake: i128, platform_stake: i128) {
        juror.require_auth();

        if env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::Registered(juror.clone()))
            .unwrap_or(false)
        {
            panic!("already registered");
        }

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

    pub fn assign(env: Env, case_id: u32, jurors: Vec<Address>) {
        if jurors.len() != 5 {
            panic!("must assign exactly 5 jurors");
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

        let quorum = 3u32;
        if updated.total_votes >= quorum {
            let majority = (updated.total_votes / 2) + 1;
            updated.status = if updated.for_votes >= majority {
                CaseStatus::Resolved
            } else {
                CaseStatus::Resolved
            };
            updated.resolved_at = env.ledger().timestamp();

            env.storage()
                .persistent()
                .set(&DataKey::CaseResult(case_id), &updated);

            env.events().publish(
                (symbol_short!("RESOLVE"),),
                (
                    case_id,
                    updated.status.clone(),
                    updated.for_votes,
                    updated.against_votes,
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

        let dispute_window: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::DisputeWindow)
            .unwrap_or(259200);

        let elapsed = env.ledger().timestamp() - case_result.resolved_at;
        if elapsed >= dispute_window {
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

        let slash_pct: i128 = 50;
        stakes.xlm = stakes.xlm * (100 - slash_pct) / 100;
        stakes.platform = stakes.platform * (100 - slash_pct) / 100;
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
            .persistent()
            .get(&DataKey::IdentityRegistry)
            .expect("identity registry not set")
    }

    pub fn disp_win(env: Env) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::DisputeWindow)
            .unwrap_or(259200)
    }

    pub fn get_vote(env: Env, case_id: u32, juror: Address) -> VoteRecord {
        env.storage()
            .persistent()
            .get(&DataKey::CaseVote(case_id, juror))
            .expect("vote not found")
    }
}

#[cfg(test)]
mod test;
