import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Admin", values: void} | {tag: "JuryRegistry", values: void} | {tag: "MinVoteCapitalBps", values: void} | {tag: "Initialized", values: void} | {tag: "Campaign", values: readonly [u32]} | {tag: "InvestorDeposit", values: readonly [u32, string]} | {tag: "Investors", values: readonly [u32]} | {tag: "InvestorVote", values: readonly [u32, string]} | {tag: "WeightedVotes", values: readonly [u32]} | {tag: "NumCampaigns", values: void};


export interface Campaign {
  approved_at: u64;
  asset: string;
  created_at: u64;
  dispute_deadline: u64;
  dispute_window_secs: u64;
  startup: string;
  state: EscrowState;
  total_amount: i128;
}

export type EscrowState = {tag: "Active", values: void} | {tag: "JuryApproved", values: void} | {tag: "DisputeOpen", values: void} | {tag: "Released", values: void} | {tag: "Refunded", values: void};


export interface JuryCaseResult {
  against_votes: u32;
  approved: boolean;
  dispute_window_secs: u64;
  for_votes: u32;
  resolved_at: u64;
  status: JuryCaseStatus;
  total_votes: u32;
}

export type JuryCaseStatus = {tag: "Voting", values: void} | {tag: "Resolved", values: void} | {tag: "Disputed", values: void} | {tag: "Slashed", values: void};


export interface WeightedVoteCount {
  against_weight: i128;
  for_weight: i128;
  voted_capital: i128;
}

export interface Client {
  /**
   * Construct and simulate a refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  refund: ({campaign_id}: {campaign_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({campaign_id, investor, amount}: {campaign_id: u32, investor: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  dispute: ({campaign_id, disputer}: {campaign_id: u32, disputer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  release: ({campaign_id}: {campaign_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, jury_registry, min_vote_capital_bps}: {admin: string, jury_registry: string, min_vote_capital_bps: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_deposit: ({campaign_id, investor}: {campaign_id: u32, investor: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_campaign: ({campaign_id}: {campaign_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Campaign>>

  /**
   * Construct and simulate a investor_vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  investor_vote: ({campaign_id, investor, approve}: {campaign_id: u32, investor: string, approve: boolean}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a jury_approved transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  jury_approved: ({campaign_id}: {campaign_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a open_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Creates campaign shell (admin). Investors then `deposit`.
   */
  open_campaign: ({campaign_id, startup, asset, dispute_window_secs}: {campaign_id: u32, startup: string, asset: string, dispute_window_secs: u64}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_investor_vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_investor_vote: ({campaign_id, investor}: {campaign_id: u32, investor: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_jury_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_jury_registry: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a set_jury_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_jury_registry: ({jury_registry}: {jury_registry: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_weighted_votes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_weighted_votes: ({campaign_id}: {campaign_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<WeightedVoteCount>>

  /**
   * Construct and simulate a get_min_vote_capital_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_min_vote_capital_bps: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a set_min_vote_capital_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_min_vote_capital_bps: ({min_vote_capital_bps}: {min_vote_capital_bps: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMSnVyeVJlZ2lzdHJ5AAAAAAAAAAAAAAARTWluVm90ZUNhcGl0YWxCcHMAAAAAAAAAAAAAAAAAAAtJbml0aWFsaXplZAAAAAABAAAAAAAAAAhDYW1wYWlnbgAAAAEAAAAEAAAAAQAAAAAAAAAPSW52ZXN0b3JEZXBvc2l0AAAAAAIAAAAEAAAAEwAAAAEAAAAAAAAACUludmVzdG9ycwAAAAAAAAEAAAAEAAAAAQAAAAAAAAAMSW52ZXN0b3JWb3RlAAAAAgAAAAQAAAATAAAAAQAAAAAAAAANV2VpZ2h0ZWRWb3RlcwAAAAAAAAEAAAAEAAAAAAAAAAAAAAAMTnVtQ2FtcGFpZ25z",
        "AAAAAQAAAAAAAAAAAAAACENhbXBhaWduAAAACAAAAAAAAAALYXBwcm92ZWRfYXQAAAAABgAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAABBkaXNwdXRlX2RlYWRsaW5lAAAABgAAAAAAAAATZGlzcHV0ZV93aW5kb3dfc2VjcwAAAAAGAAAAAAAAAAdzdGFydHVwAAAAABMAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtFc2Nyb3dTdGF0ZQAAAAAAAAAADHRvdGFsX2Ftb3VudAAAAAs=",
        "AAAAAgAAAAAAAAAAAAAAC0VzY3Jvd1N0YXRlAAAAAAUAAAAAAAAAAAAAAAZBY3RpdmUAAAAAAAAAAAAAAAAADEp1cnlBcHByb3ZlZAAAAAAAAAAAAAAAC0Rpc3B1dGVPcGVuAAAAAAAAAAAAAAAACFJlbGVhc2VkAAAAAAAAAAAAAAAIUmVmdW5kZWQ=",
        "AAAAAQAAAAAAAAAAAAAADkp1cnlDYXNlUmVzdWx0AAAAAAAHAAAAAAAAAA1hZ2FpbnN0X3ZvdGVzAAAAAAAABAAAAAAAAAAIYXBwcm92ZWQAAAABAAAAAAAAABNkaXNwdXRlX3dpbmRvd19zZWNzAAAAAAYAAAAAAAAACWZvcl92b3RlcwAAAAAAAAQAAAAAAAAAC3Jlc29sdmVkX2F0AAAAAAYAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA5KdXJ5Q2FzZVN0YXR1cwAAAAAAAAAAAAt0b3RhbF92b3RlcwAAAAAE",
        "AAAAAgAAAAAAAAAAAAAADkp1cnlDYXNlU3RhdHVzAAAAAAAEAAAAAAAAAAAAAAAGVm90aW5nAAAAAAAAAAAAAAAAAAhSZXNvbHZlZAAAAAAAAAAAAAAACERpc3B1dGVkAAAAAAAAAAAAAAAHU2xhc2hlZAA=",
        "AAAAAQAAAAAAAAAAAAAAEVdlaWdodGVkVm90ZUNvdW50AAAAAAAAAwAAAAAAAAAOYWdhaW5zdF93ZWlnaHQAAAAAAAsAAAAAAAAACmZvcl93ZWlnaHQAAAAAAAsAAAAAAAAADXZvdGVkX2NhcGl0YWwAAAAAAAAL",
        "AAAAAAAAAAAAAAAGcmVmdW5kAAAAAAABAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAAAAAAhpbnZlc3RvcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAHZGlzcHV0ZQAAAAACAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAAAAAAhkaXNwdXRlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAHcmVsZWFzZQAAAAABAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA1qdXJ5X3JlZ2lzdHJ5AAAAAAAAEwAAAAAAAAAUbWluX3ZvdGVfY2FwaXRhbF9icHMAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAALZ2V0X2RlcG9zaXQAAAAAAgAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAAAAAAIaW52ZXN0b3IAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAMZ2V0X2NhbXBhaWduAAAAAQAAAAAAAAALY2FtcGFpZ25faWQAAAAABAAAAAEAAAfQAAAACENhbXBhaWdu",
        "AAAAAAAAAAAAAAANaW52ZXN0b3Jfdm90ZQAAAAAAAAMAAAAAAAAAC2NhbXBhaWduX2lkAAAAAAQAAAAAAAAACGludmVzdG9yAAAAEwAAAAAAAAAHYXBwcm92ZQAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAANanVyeV9hcHByb3ZlZAAAAAAAAAEAAAAAAAAAC2NhbXBhaWduX2lkAAAAAAQAAAAA",
        "AAAAAAAAADlDcmVhdGVzIGNhbXBhaWduIHNoZWxsIChhZG1pbikuIEludmVzdG9ycyB0aGVuIGBkZXBvc2l0YC4AAAAAAAANb3Blbl9jYW1wYWlnbgAAAAAAAAQAAAAAAAAAC2NhbXBhaWduX2lkAAAAAAQAAAAAAAAAB3N0YXJ0dXAAAAAAEwAAAAAAAAAFYXNzZXQAAAAAAAATAAAAAAAAABNkaXNwdXRlX3dpbmRvd19zZWNzAAAAAAYAAAABAAAABA==",
        "AAAAAAAAAAAAAAARZ2V0X2ludmVzdG9yX3ZvdGUAAAAAAAACAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAAAAAAhpbnZlc3RvcgAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAARZ2V0X2p1cnlfcmVnaXN0cnkAAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAARc2V0X2p1cnlfcmVnaXN0cnkAAAAAAAABAAAAAAAAAA1qdXJ5X3JlZ2lzdHJ5AAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASZ2V0X3dlaWdodGVkX3ZvdGVzAAAAAAABAAAAAAAAAAtjYW1wYWlnbl9pZAAAAAAEAAAAAQAAB9AAAAARV2VpZ2h0ZWRWb3RlQ291bnQAAAA=",
        "AAAAAAAAAAAAAAAYZ2V0X21pbl92b3RlX2NhcGl0YWxfYnBzAAAAAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAYc2V0X21pbl92b3RlX2NhcGl0YWxfYnBzAAAAAQAAAAAAAAAUbWluX3ZvdGVfY2FwaXRhbF9icHMAAAAEAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    refund: this.txFromJSON<null>,
        deposit: this.txFromJSON<null>,
        dispute: this.txFromJSON<null>,
        release: this.txFromJSON<null>,
        get_admin: this.txFromJSON<string>,
        initialize: this.txFromJSON<null>,
        get_deposit: this.txFromJSON<i128>,
        get_campaign: this.txFromJSON<Campaign>,
        investor_vote: this.txFromJSON<null>,
        jury_approved: this.txFromJSON<null>,
        open_campaign: this.txFromJSON<u32>,
        get_investor_vote: this.txFromJSON<boolean>,
        get_jury_registry: this.txFromJSON<string>,
        set_jury_registry: this.txFromJSON<null>,
        get_weighted_votes: this.txFromJSON<WeightedVoteCount>,
        get_min_vote_capital_bps: this.txFromJSON<u32>,
        set_min_vote_capital_bps: this.txFromJSON<null>
  }
}