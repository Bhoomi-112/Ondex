#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, IntoVal,
};

#[derive(Clone, PartialEq)]
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
}

#[derive(Clone)]
#[contracttype]
pub struct Campaign {
    pub startup: Address,
    pub investor: Address,
    pub amount: i128,
    pub asset: Address,
    pub state: EscrowState,
    pub created_at: u64,
    pub approved_at: u64,
    pub dispute_deadline: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Campaign(u32),
    NumCampaigns,
    DisputeWindow,
    JuryRegistry,
    InvestorVote(u32, Address),
    InvestorVoteCount(u32),
}

#[derive(Clone)]
#[contracttype]
pub struct InvestorVoteCount {
    pub for_release: u32,
    pub against_release: u32,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn initialize(env: Env, jury_registry: Address, dispute_window_secs: u64) {
        env.storage()
            .persistent()
            .set(&DataKey::JuryRegistry, &jury_registry);
        env.storage()
            .persistent()
            .set(&DataKey::DisputeWindow, &dispute_window_secs);
        env.storage()
            .persistent()
            .set(&DataKey::NumCampaigns, &0u32);
        env.events().publish(
            (symbol_short!("INIT"),),
            (jury_registry, dispute_window_secs),
        );
    }

    pub fn deposit(
        env: Env,
        campaign_id: u32,
        startup: Address,
        investor: Address,
        amount: i128,
        asset: Address,
    ) -> u32 {
        investor.require_auth();

        if amount <= 0 {
            panic!("amount must be positive");
        }

        let num_campaigns: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::NumCampaigns)
            .unwrap_or(0);

        let campaign = Campaign {
            startup: startup.clone(),
            investor: investor.clone(),
            amount,
            asset: asset.clone(),
            state: EscrowState::Active,
            created_at: env.ledger().timestamp(),
            approved_at: 0,
            dispute_deadline: 0,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        if campaign_id >= num_campaigns {
            env.storage()
                .persistent()
                .set(&DataKey::NumCampaigns, &(campaign_id + 1));
        }

        env.events().publish(
            (symbol_short!("DEPOSIT"),),
            (campaign_id, investor, startup, amount, asset),
        );

        campaign_id
    }

    pub fn jury_approved(env: Env, campaign_id: u32) {
        let jury_registry_addr: Address = env
            .storage()
            .persistent()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set");

        let case_result: JuryCaseResult = env.invoke_contract(
            &jury_registry_addr,
            &symbol_short!("get_case"),
            soroban_sdk::vec![&env, campaign_id.into_val(&env)],
        );

        if case_result.status != JuryCaseStatus::Resolved {
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

        let dispute_window: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::DisputeWindow)
            .unwrap_or(259200);

        let now = env.ledger().timestamp();
        campaign.state = EscrowState::JuryApproved;
        campaign.approved_at = now;
        campaign.dispute_deadline = now + dispute_window;

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            (symbol_short!("APPROVED"),),
            (campaign_id, now, campaign.dispute_deadline),
        );
    }

    pub fn dispute(env: Env, campaign_id: u32, disputer: Address) {
        disputer.require_auth();

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

        env.events()
            .publish((symbol_short!("DISPUTE"),), (campaign_id, disputer));
    }

    pub fn investor_vote(env: Env, campaign_id: u32, investor: Address, approve: bool) {
        investor.require_auth();

        let campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::DisputeOpen {
            panic!("can only vote during dispute");
        }

        if env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::InvestorVote(campaign_id, investor.clone()))
            .is_some()
        {
            panic!("investor already voted");
        }

        env.storage().persistent().set(
            &DataKey::InvestorVote(campaign_id, investor.clone()),
            &approve,
        );

        let mut counts: InvestorVoteCount = env
            .storage()
            .persistent()
            .get(&DataKey::InvestorVoteCount(campaign_id))
            .unwrap_or(InvestorVoteCount {
                for_release: 0,
                against_release: 0,
            });

        if approve {
            counts.for_release += 1;
        } else {
            counts.against_release += 1;
        }

        env.storage()
            .persistent()
            .set(&DataKey::InvestorVoteCount(campaign_id), &counts);

        env.events().publish(
            (symbol_short!("INV_VOTE"),),
            (campaign_id, investor, approve),
        );
    }

    pub fn release(env: Env, campaign_id: u32) {
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
                let counts: InvestorVoteCount = env
                    .storage()
                    .persistent()
                    .get(&DataKey::InvestorVoteCount(campaign_id))
                    .unwrap_or(InvestorVoteCount {
                        for_release: 0,
                        against_release: 0,
                    });

                let total = counts.for_release + counts.against_release;
                if total == 0 {
                    panic!("no investor votes cast");
                }

                let majority = (total / 2) + 1;
                if counts.for_release < majority {
                    panic!("investor majority did not approve release");
                }
            }
            _ => panic!("campaign not in releasable state"),
        }

        campaign.state = EscrowState::Released;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            (symbol_short!("RELEASE"),),
            (campaign_id, campaign.investor, campaign.startup, campaign.amount),
        );
    }

    pub fn refund(env: Env, campaign_id: u32) {
        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        if campaign.state != EscrowState::Active {
            panic!("can only refund active campaigns");
        }

        campaign.startup.require_auth();

        campaign.state = EscrowState::Refunded;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        env.events().publish(
            (symbol_short!("REFUND"),),
            (campaign_id, campaign.investor, campaign.amount),
        );
    }

    pub fn get_campaign(env: Env, campaign_id: u32) -> Campaign {
        env.storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found")
    }

    pub fn get_dispute_window(env: Env) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::DisputeWindow)
            .unwrap_or(259200)
    }

    pub fn get_jury_registry(env: Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::JuryRegistry)
            .expect("jury registry not set")
    }

    pub fn get_investor_vote(env: Env, campaign_id: u32, investor: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::InvestorVote(campaign_id, investor))
            .expect("investor has not voted")
    }

    pub fn get_investor_vote_count(env: Env, campaign_id: u32) -> InvestorVoteCount {
        env.storage()
            .persistent()
            .get(&DataKey::InvestorVoteCount(campaign_id))
            .unwrap_or(InvestorVoteCount {
                for_release: 0,
                against_release: 0,
            })
    }
}

#[cfg(test)]
mod test;
