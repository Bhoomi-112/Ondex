#![cfg(test)]

extern crate std;

use soroban_sdk::{symbol_short, Address, Env, Vec};

use crate::{CaseResult, CaseStatus, DataKey, JurorStakes, JuryRegistry, Vote};

fn setup() -> (
    Env,
    Address,
    Address,
    Address,
    Address,
    Address,
    Address,
    Address,
) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let identity_registry = Address::generate(&env);
    let jury_addr = Address::generate(&env);

    let juror1 = Address::generate(&env);
    let juror2 = Address::generate(&env);
    let juror3 = Address::generate(&env);

    env.register(&jury_addr, JuryRegistry);
    env.register_contract(&identity_registry, crate::IdentityRegistry);

    env.as_contract(&jury_addr, || {
        env.storage()
            .persistent()
            .set(&DataKey::DisputeWindow, &259200u64);
        env.storage()
            .persistent()
            .set(&DataKey::NumCases, &0u32);
        env.storage()
            .persistent()
            .set(&DataKey::Registered(&admin), &true);
    });

    env.as_contract(&jury_addr, || {
        env.storage().persistent().set(
            &DataKey::IdentityRegistry,
            &identity_registry,
        );
    });

    (
        env,
        jury_addr,
        identity_registry,
        admin,
        juror1,
        juror2,
        juror3,
    )
}

#[test]
fn test_register_juror() {
    let (env, jury_addr, _, _, juror1, _, _) = setup();

    let xlm_stake: i128 = 1000;
    let platform_stake: i128 = 500;

    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("register"),
            soroban_sdk::vec![
                &env,
                juror1.clone().into_val(&env),
                xlm_stake.into_val(&env),
                platform_stake.into_val(&env),
            ],
        );
    });

    let is_reg: bool = env.as_contract(&jury_addr, || {
        env.invoke_contract::<bool>(
            &jury_addr,
            &symbol_short!("is_reg"),
            soroban_sdk::vec![&env, juror1.clone().into_val(&env)],
        )
    });

    assert!(is_reg);

    let stakes: JurorStakes = env.as_contract(&jury_addr, || {
        env.invoke_contract::<JurorStakes>(
            &jury_addr,
            &symbol_short!("juror_stake"),
            soroban_sdk::vec![&env, juror1.clone().into_val(&env)],
        )
    });

    assert_eq!(stakes.xlm, xlm_stake);
    assert_eq!(stakes.platform, platform_stake);
    assert!(stakes.registered_at > 0);
}

#[test]
#[should_panic(expected = "already registered")]
fn test_register_duplicate() {
    let (env, jury_addr, _, _, juror1, _, _) = setup();

    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("register"),
            soroban_sdk::vec![
                &env,
                juror1.clone().into_val(&env),
                1000i128.into_val(&env),
                500i128.into_val(&env),
            ],
        );
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("register"),
            soroban_sdk::vec![
                &env,
                juror1.into_val(&env),
                1000i128.into_val(&env),
                500i128.into_val(&env),
            ],
        );
    });
}

fn register_juror(env: &Env, jury_addr: &Address, juror: &Address) {
    env.as_contract(jury_addr, || {
        env.invoke_contract::<()>(
            jury_addr,
            &symbol_short!("register"),
            soroban_sdk::vec![
                env,
                juror.clone().into_val(env),
                1000i128.into_val(env),
                500i128.into_val(env),
            ],
        );
    });
}

fn assign_case(
    env: &Env,
    jury_addr: &Address,
    case_id: u32,
    jurors: &[Address],
) {
    let juror_vec: Vec<Address> = jurors.iter().collect();
    env.as_contract(jury_addr, || {
        env.invoke_contract::<()>(
            jury_addr,
            &symbol_short!("assign"),
            soroban_sdk::vec![
                env,
                case_id.into_val(env),
                juror_vec.into_val(env),
            ],
        );
    });
}

fn cast_vote(
    env: &Env,
    jury_addr: &Address,
    case_id: u32,
    juror: &Address,
    vote: Vote,
) {
    env.as_contract(jury_addr, || {
        env.invoke_contract::<()>(
            jury_addr,
            &symbol_short!("vote"),
            soroban_sdk::vec![
                env,
                case_id.into_val(env),
                juror.clone().into_val(env),
                vote.into_val(env),
            ],
        );
    });
}

#[test]
fn test_assign_and_vote_basic() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::Against);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });

    assert_eq!(result.status, CaseStatus::Resolved);
    assert_eq!(result.for_votes, 2);
    assert_eq!(result.against_votes, 1);
    assert_eq!(result.total_votes, 3);
    assert!(result.resolved_at > 0);
}

#[test]
fn test_quorum_reached_majority_for() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::For);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });

    assert_eq!(result.status, CaseStatus::Resolved);
    assert_eq!(result.for_votes, 3);
    assert_eq!(result.against_votes, 0);
}

#[test]
fn test_quorum_not_reached() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });

    assert_eq!(result.status, CaseStatus::Voting);
    assert_eq!(result.total_votes, 1);
}

#[test]
#[should_panic(expected = "juror already voted")]
fn test_double_vote() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2, juror3, j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror1, Vote::Against);
}

#[test]
#[should_panic(expected = "juror not assigned")]
fn test_unassigned_juror_vote() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    let outsider = Address::generate(&env);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1, juror2, juror3, j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &outsider, Vote::For);
}

#[test]
fn test_dispute_within_window() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::Against);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });
    assert_eq!(result.status, CaseStatus::Resolved);

    let disputer = Address::generate(&env);
    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("dispute"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                disputer.into_val(&env),
            ],
        );
    });

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });
    assert_eq!(result.status, CaseStatus::Disputed);
}

#[test]
#[should_panic(expected = "dispute window closed")]
fn test_dispute_after_window() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::Against);

    env.ledger().set_timestamp(300000);

    let disputer = Address::generate(&env);
    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("dispute"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                disputer.into_val(&env),
            ],
        );
    });
}

#[test]
fn test_slash_dissenting_juror() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::Against);

    let disputer = Address::generate(&env);
    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("dispute"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                disputer.into_val(&env),
            ],
        );
    });

    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("slash"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                juror3.clone().into_val(&env),
            ],
        );
    });

    let stakes: JurorStakes = env.as_contract(&jury_addr, || {
        env.invoke_contract::<JurorStakes>(
            &jury_addr,
            &symbol_short!("juror_stake"),
            soroban_sdk::vec![&env, juror3.into_val(&env)],
        )
    });

    assert_eq!(stakes.xlm, 500);
    assert_eq!(stakes.platform, 250);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });
    assert_eq!(result.status, CaseStatus::Slashed);
}

#[test]
#[should_panic(expected = "juror vote aligns with majority")]
fn test_slash_non_dissenting_fails() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2, juror3, j4, j5],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);

    let j3 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j3);
    cast_vote(&env, &jury_addr, 0, &j3, Vote::For);

    let disputer = Address::generate(&env);
    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("dispute"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                disputer.into_val(&env),
            ],
        );
    });

    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("slash"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                juror1.into_val(&env),
            ],
        );
    });
}

#[test]
fn test_full_lifecycle() {
    let (env, jury_addr, _, _, juror1, juror2, juror3) = setup();

    register_juror(&env, &jury_addr, &juror1);
    register_juror(&env, &jury_addr, &juror2);
    register_juror(&env, &jury_addr, &juror3);

    let j4 = Address::generate(&env);
    let j5 = Address::generate(&env);
    register_juror(&env, &jury_addr, &j4);
    register_juror(&env, &jury_addr, &j5);

    assign_case(
        &env,
        &jury_addr,
        0,
        &[juror1.clone(), juror2.clone(), juror3.clone(), j4.clone(), j5.clone()],
    );

    cast_vote(&env, &jury_addr, 0, &juror1, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror2, Vote::For);
    cast_vote(&env, &jury_addr, 0, &juror3, Vote::Against);

    let result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });
    assert_eq!(result.status, CaseStatus::Resolved);

    let disputer = Address::generate(&env);
    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("dispute"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                disputer.into_val(&env),
            ],
        );
    });

    env.as_contract(&jury_addr, || {
        env.invoke_contract::<()>(
            &jury_addr,
            &symbol_short!("slash"),
            soroban_sdk::vec![
                &env,
                0u32.into_val(&env),
                juror3.into_val(&env),
            ],
        );
    });

    let final_stakes: JurorStakes = env.as_contract(&jury_addr, || {
        env.invoke_contract::<JurorStakes>(
            &jury_addr,
            &symbol_short!("juror_stake"),
            soroban_sdk::vec![&env, juror3.into_val(&env)],
        )
    });
    assert_eq!(final_stakes.xlm, 500);
    assert_eq!(final_stakes.platform, 250);

    let final_result: CaseResult = env.as_contract(&jury_addr, || {
        env.invoke_contract::<CaseResult>(
            &jury_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, 0u32.into_val(&env)],
        )
    });
    assert_eq!(final_result.status, CaseStatus::Slashed);

    let dispute_win: u64 = env.as_contract(&jury_addr, || {
        env.invoke_contract::<u64>(
            &jury_addr,
            &symbol_short!("disp_win"),
            soroban_sdk::vec![&env],
        )
    });
    assert_eq!(dispute_win, 259200);
}
