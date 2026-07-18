import {Address} from '@stellar/stellar-sdk';

    /**
 * Union: DataKey
 */
 export type DataKey =
  { tag: "Deposit"; values: readonly [string] } |
  { tag: "Milestone"; values: readonly [number] };

/**
 * Struct: Milestone
 */
export interface Milestone {
  amount: bigint;
  released: boolean;
}

/**
 * Union: CampaignStatus
 */
 export type CampaignStatus =
  { tag: "Active"; values: void } |
  { tag: "Completed"; values: void } |
  { tag: "Failed"; values: void } |
  { tag: "Refunding"; values: void };
    