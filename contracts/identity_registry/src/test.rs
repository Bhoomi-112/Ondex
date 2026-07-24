#![cfg(test)]

extern crate std;

use soroban_sdk::{testutils::Address as _, Address, Bytes, Env};

use crate::{IdentityRegistry, IdentityRegistryClient};

struct Setup {
    env: Env,
    client: IdentityRegistryClient<'static>,
    admin: Address,
}

fn setup() -> Setup {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let id = env.register(IdentityRegistry, ());
    let client = IdentityRegistryClient::new(&env, &id);
    client.initialize(&admin);

    Setup { env, client, admin }
}

fn name(env: &Env) -> Bytes {
    Bytes::from_array(env, b"My Startup")
}

fn desc(env: &Env) -> Bytes {
    Bytes::from_array(env, b"Building the future")
}

fn tags(env: &Env) -> Bytes {
    Bytes::from_array(env, b"defi,blockchain")
}

fn stage(env: &Env) -> Bytes {
    Bytes::from_array(env, b"seed")
}

fn kyc(env: &Env) -> Bytes {
    Bytes::from_array(env, b"0x1234")
}

#[test]
fn test_initialize() {
    let s = setup();
    assert!(s.client.is_startup(&s.admin) == false);
    assert!(s.client.is_investor(&s.admin) == false);
}

#[test]
fn test_register_startup() {
    let s = setup();
    let wallet = Address::generate(&s.env);

    s.client.register_startup(
        &wallet,
        &name(&s.env),
        &desc(&s.env),
        &tags(&s.env),
        &1_000_000,
        &10,
    );

    assert!(s.client.is_startup(&wallet));
    let profile = s.client.get_startup(&wallet);
    assert_eq!(profile.name, name(&s.env));
    assert_eq!(profile.funding_ask, 1_000_000);
    assert_eq!(profile.equity_offered, 10);
}

#[test]
fn test_register_investor() {
    let s = setup();
    let wallet = Address::generate(&s.env);

    s.client.register_investor(
        &wallet,
        &tags(&s.env),
        &10_000,
        &100_000,
        &stage(&s.env),
        &kyc(&s.env),
    );

    assert!(s.client.is_investor(&wallet));
    let profile = s.client.get_investor(&wallet);
    assert_eq!(profile.preferred_industries, tags(&s.env));
    assert_eq!(profile.min_ticket, 10_000);
    assert_eq!(profile.max_ticket, 100_000);
}

#[test]
#[should_panic(expected = "startup already registered")]
fn test_double_startup() {
    let s = setup();
    let wallet = Address::generate(&s.env);
    s.client.register_startup(&wallet, &name(&s.env), &desc(&s.env), &tags(&s.env), &1_000_000, &10);
    s.client.register_startup(&wallet, &name(&s.env), &desc(&s.env), &tags(&s.env), &2_000_000, &20);
}

#[test]
#[should_panic(expected = "funding_ask must be positive")]
fn test_zero_funding() {
    let s = setup();
    let wallet = Address::generate(&s.env);
    s.client.register_startup(&wallet, &name(&s.env), &desc(&s.env), &tags(&s.env), &0, &10);
}

#[test]
fn test_list_startups() {
    let s = setup();
    let w1 = Address::generate(&s.env);
    let w2 = Address::generate(&s.env);
    s.client.register_startup(&w1, &name(&s.env), &desc(&s.env), &tags(&s.env), &1_000_000, &10);
    s.client.register_startup(&w2, &name(&s.env), &desc(&s.env), &tags(&s.env), &2_000_000, &20);
    let list = s.client.list_startups();
    assert!(list.get(w1.clone()).unwrap_or(false));
    assert!(list.get(w2.clone()).unwrap_or(false));
}