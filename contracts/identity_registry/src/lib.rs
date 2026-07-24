#![no_std]
#![allow(deprecated)]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, IntoVal,
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
pub struct CaseResult {
    pub status: CaseStatus,
    pub for_votes: u32,
    pub against_votes: u32,
    pub total_votes: u32,
    pub resolved_at: u64,
    pub approved: bool,
    pub dispute_window_secs: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Commitment(Bytes),
    Revealed(Bytes),
    Committed(Bytes),
    Nullifier(Bytes),
    CaseLink(Bytes),
    JuryRegistry,
    Initialized,
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

#[contractimpl]
impl IdentityRegistry {
    pub fn initialize(env: Env, jury_registry: Address) {
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
            .set(&DataKey::JuryRegistry, &jury_registry);
        env.storage()
            .instance()
            .set(&DataKey::Initialized, &true);
        env.events()
            .publish((symbol_short!("INIT"),), (jury_registry,));
    }

    pub fn commit(env: Env, identity_id: Bytes, commitment_hash: Bytes) {
        require_init(&env);
        if env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::Committed(identity_id.clone()))
            .unwrap_or(false)
        {
            panic!("identity already committed");
        }

        env.storage().persistent().set(
            &DataKey::Commitment(identity_id.clone()),
            &commitment_hash,
        );
        env.storage()
            .persistent()
            .set(&DataKey::Committed(identity_id.clone()), &true);

        env.events()
            .publish((symbol_short!("COMMIT"),), (identity_id, commitment_hash));
    }

    pub fn link_case(env: Env, identity_id: Bytes, case_id: u32) {
        require_init(&env);
        if !env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::Committed(identity_id.clone()))
            .unwrap_or(false)
        {
            panic!("identity not committed");
        }

        env.storage()
            .persistent()
            .set(&DataKey::CaseLink(identity_id.clone()), &case_id);

        env.events()
            .publish((symbol_short!("LNK_CASE"),), (identity_id, case_id));
    }

    pub fn reveal(env: Env, identity_id: Bytes, case_id: u32, backend_ref: Bytes) {
        require_init(&env);
        if !env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::Committed(identity_id.clone()))
            .unwrap_or(false)
        {
            panic!("identity not committed");
        }

        if env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::Revealed(identity_id.clone()))
            .unwrap_or(false)
        {
            panic!("identity already revealed");
        }

        let stored_case_id: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::CaseLink(identity_id.clone()))
            .expect("identity not linked to a case");

        if stored_case_id != case_id {
            panic!("case_id does not match linked case");
        }

        let jury_registry_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set");

        let case_result: CaseResult = env.invoke_contract(
            &jury_registry_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, case_id.into_val(&env)],
        );

        // Terminal states only — vote has concluded (resolved, disputed, or slashed)
        match case_result.status {
            CaseStatus::Resolved | CaseStatus::Disputed | CaseStatus::Slashed => {}
            CaseStatus::Voting => panic!("jury vote has not concluded"),
        }

        env.storage()
            .persistent()
            .set(&DataKey::Revealed(identity_id.clone()), &true);
        env.storage()
            .persistent()
            .set(&DataKey::Nullifier(identity_id.clone()), &true);

        env.events().publish(
            (symbol_short!("REVEAL"),),
            (identity_id, case_id, backend_ref),
        );
    }

    pub fn verify(env: Env, identity_id: Bytes) -> bool {
        require_init(&env);
        env.storage()
            .persistent()
            .get::<_, bool>(&DataKey::Revealed(identity_id))
            .unwrap_or(false)
    }

    pub fn get_commitment(env: Env, identity_id: Bytes) -> Bytes {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::Commitment(identity_id))
            .expect("commitment not found")
    }

    pub fn is_committed(env: Env, identity_id: Bytes) -> bool {
        require_init(&env);
        env.storage()
            .persistent()
            .get::<_, bool>(&DataKey::Committed(identity_id))
            .unwrap_or(false)
    }

    pub fn get_linked_case(env: Env, identity_id: Bytes) -> u32 {
        require_init(&env);
        env.storage()
            .persistent()
            .get(&DataKey::CaseLink(identity_id))
            .expect("identity not linked to a case")
    }

    pub fn get_jury_registry(env: Env) -> Address {
        require_init(&env);
        env.storage()
            .instance()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set")
    }
}

#[cfg(test)]
mod test;
