import {Address} from '@stellar/stellar-sdk';

    /**
 * Struct: Vote
 */
export interface Vote {
  approve: boolean;
  comment_hash: string;
  timestamp: bigint;
  voter: string;
}

/**
 * Union: DataKey
 */
 export type DataKey =
  { tag: "Application"; values: readonly [bigint] } |
  { tag: "Campaign"; values: readonly [bigint] } |
  { tag: "Vote"; values: readonly [bigint, string] } |
  { tag: "VoteCount"; values: readonly [bigint] } |
  { tag: "JurorVoteCount"; values: readonly [bigint] };

/**
 * Union: AppStatus
 */
 export type AppStatus =
  { tag: "Submitted"; values: void } |
  { tag: "UnderReview"; values: void } |
  { tag: "Approved"; values: void } |
  { tag: "Rejected"; values: void };

/**
 * Struct: Application
 */
export interface Application {
  ask_amount: bigint;
  id: bigint;
  mask_address: boolean;
  mask_name: boolean;
  milestones: Array<MilestoneInfo>;
  name: string;
  pitch: string;
  startup: string;
  status: AppStatus;
}

/**
 * Struct: MilestoneInfo
 */
export interface MilestoneInfo {
  amount: bigint;
  description: string;
}
    