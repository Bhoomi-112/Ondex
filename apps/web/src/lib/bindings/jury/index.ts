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




export type Vote = {tag: "For", values: void} | {tag: "Against", values: void};

export type DataKey = {tag: "Admin", values: void} | {tag: "XlmToken", values: void} | {tag: "PlatformToken", values: void} | {tag: "Treasury", values: void} | {tag: "MinXlmStake", values: void} | {tag: "MinPlatformStake", values: void} | {tag: "JurySize", values: void} | {tag: "Quorum", values: void} | {tag: "SlashPct", values: void} | {tag: "IdentityRegistry", values: void} | {tag: "Initialized", values: void} | {tag: "JurorStakes", values: readonly [string]} | {tag: "Registered", values: readonly [string]} | {tag: "CaseJurors", values: readonly [u32]} | {tag: "CaseVote", values: readonly [u32, string]} | {tag: "CaseResult", values: readonly [u32]} | {tag: "NumCases", values: void};


export interface CaseResult {
  against_votes: u32;
  approved: boolean;
  dispute_window_secs: u64;
  for_votes: u32;
  resolved_at: u64;
  status: CaseStatus;
  total_votes: u32;
}

export type CaseStatus = {tag: "Voting", values: void} | {tag: "Resolved", values: void} | {tag: "Disputed", values: void} | {tag: "Slashed", values: void};


export interface VoteRecord {
  timestamp: u64;
  vote: Vote;
}


export interface JurorStakes {
  platform: i128;
  registered_at: u64;
  xlm: i128;
}

export interface Client {
  /**
   * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  vote: ({case_id, juror, vote}: {case_id: u32, juror: string, vote: Vote}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a slash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  slash: ({case_id, juror}: {case_id: u32, juror: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a assign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assign: ({case_id, jurors, dispute_window_secs}: {case_id: u32, jurors: Array<string>, dispute_window_secs: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a id_reg transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  id_reg: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a is_reg transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_reg: ({juror}: {juror: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  dispute: ({case_id, disputer}: {case_id: u32, disputer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_case transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_case: ({case_id}: {case_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<CaseResult>>

  /**
   * Construct and simulate a get_vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_vote: ({case_id, juror}: {case_id: u32, juror: string}, options?: MethodOptions) => Promise<AssembledTransaction<VoteRecord>>

  /**
   * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register: ({juror, xlm_stake, platform_stake}: {juror: string, xlm_stake: i128, platform_stake: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_quorum transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_quorum: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, xlm_token, platform_token, treasury, min_xlm_stake, min_platform_stake, jury_size, quorum, slash_pct}: {admin: string, xlm_token: string, platform_token: string, treasury: string, min_xlm_stake: i128, min_platform_stake: i128, jury_size: u32, quorum: u32, slash_pct: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a juror_stake transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  juror_stake: ({juror}: {juror: string}, options?: MethodOptions) => Promise<AssembledTransaction<JurorStakes>>

  /**
   * Construct and simulate a set_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_treasury: ({treasury}: {treasury: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_jury_size transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_jury_size: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_slash_pct transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_slash_pct: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a set_slash_pct transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_slash_pct: ({slash_pct}: {slash_pct: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_min_stakes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_min_stakes: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [i128, i128]>>

  /**
   * Construct and simulate a set_min_stakes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_min_stakes: ({min_xlm_stake, min_platform_stake}: {min_xlm_stake: i128, min_platform_stake: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_jury_params transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_jury_params: ({jury_size, quorum}: {jury_size: u32, quorum: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a register_sponsored transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Admin pays stake from their wallet and registers `juror` (sponsored onboarding).
   */
  register_sponsored: ({juror, xlm_stake, platform_stake}: {juror: string, xlm_stake: i128, platform_stake: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_identity_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_identity_registry: ({identity_registry}: {identity_registry: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAABFZvdGUAAAACAAAAAAAAAAAAAAADRm9yAAAAAAAAAAAAAAAAB0FnYWluc3QA",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAEQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAIWGxtVG9rZW4AAAAAAAAAAAAAAA1QbGF0Zm9ybVRva2VuAAAAAAAAAAAAAAAAAAAIVHJlYXN1cnkAAAAAAAAAAAAAAAtNaW5YbG1TdGFrZQAAAAAAAAAAAAAAABBNaW5QbGF0Zm9ybVN0YWtlAAAAAAAAAAAAAAAISnVyeVNpemUAAAAAAAAAAAAAAAZRdW9ydW0AAAAAAAAAAAAAAAAACFNsYXNoUGN0AAAAAAAAAAAAAAAQSWRlbnRpdHlSZWdpc3RyeQAAAAAAAAAAAAAAC0luaXRpYWxpemVkAAAAAAEAAAAAAAAAC0p1cm9yU3Rha2VzAAAAAAEAAAATAAAAAQAAAAAAAAAKUmVnaXN0ZXJlZAAAAAAAAQAAABMAAAABAAAAAAAAAApDYXNlSnVyb3JzAAAAAAABAAAABAAAAAEAAAAAAAAACENhc2VWb3RlAAAAAgAAAAQAAAATAAAAAQAAAAAAAAAKQ2FzZVJlc3VsdAAAAAAAAQAAAAQAAAAAAAAAAAAAAAhOdW1DYXNlcw==",
        "AAAAAQAAAAAAAAAAAAAACkNhc2VSZXN1bHQAAAAAAAcAAAAAAAAADWFnYWluc3Rfdm90ZXMAAAAAAAAEAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAAAAAAE2Rpc3B1dGVfd2luZG93X3NlY3MAAAAABgAAAAAAAAAJZm9yX3ZvdGVzAAAAAAAABAAAAAAAAAALcmVzb2x2ZWRfYXQAAAAABgAAAAAAAAAGc3RhdHVzAAAAAAfQAAAACkNhc2VTdGF0dXMAAAAAAAAAAAALdG90YWxfdm90ZXMAAAAABA==",
        "AAAAAgAAAAAAAAAAAAAACkNhc2VTdGF0dXMAAAAAAAQAAAAAAAAAAAAAAAZWb3RpbmcAAAAAAAAAAAAAAAAACFJlc29sdmVkAAAAAAAAAAAAAAAIRGlzcHV0ZWQAAAAAAAAAAAAAAAdTbGFzaGVkAA==",
        "AAAAAQAAAAAAAAAAAAAAClZvdGVSZWNvcmQAAAAAAAIAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABHZvdGUAAAfQAAAABFZvdGU=",
        "AAAAAQAAAAAAAAAAAAAAC0p1cm9yU3Rha2VzAAAAAAMAAAAAAAAACHBsYXRmb3JtAAAACwAAAAAAAAANcmVnaXN0ZXJlZF9hdAAAAAAAAAYAAAAAAAAAA3hsbQAAAAAL",
        "AAAAAAAAAAAAAAAEdm90ZQAAAAMAAAAAAAAAB2Nhc2VfaWQAAAAABAAAAAAAAAAFanVyb3IAAAAAAAATAAAAAAAAAAR2b3RlAAAH0AAAAARWb3RlAAAAAA==",
        "AAAAAAAAAAAAAAAFc2xhc2gAAAAAAAACAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAAAAAAABWp1cm9yAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAGYXNzaWduAAAAAAADAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAAAAAAABmp1cm9ycwAAAAAD6gAAABMAAAAAAAAAE2Rpc3B1dGVfd2luZG93X3NlY3MAAAAABgAAAAA=",
        "AAAAAAAAAAAAAAAGaWRfcmVnAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAGaXNfcmVnAAAAAAABAAAAAAAAAAVqdXJvcgAAAAAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAAHZGlzcHV0ZQAAAAACAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAAAAAAACGRpc3B1dGVyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAIZ2V0X2Nhc2UAAAABAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAABAAAH0AAAAApDYXNlUmVzdWx0AAA=",
        "AAAAAAAAAAAAAAAIZ2V0X3ZvdGUAAAACAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAAAAAAABWp1cm9yAAAAAAAAEwAAAAEAAAfQAAAAClZvdGVSZWNvcmQAAA==",
        "AAAAAAAAAAAAAAAIcmVnaXN0ZXIAAAADAAAAAAAAAAVqdXJvcgAAAAAAABMAAAAAAAAACXhsbV9zdGFrZQAAAAAAAAsAAAAAAAAADnBsYXRmb3JtX3N0YWtlAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKZ2V0X3F1b3J1bQAAAAAAAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAACQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAl4bG1fdG9rZW4AAAAAAAATAAAAAAAAAA5wbGF0Zm9ybV90b2tlbgAAAAAAEwAAAAAAAAAIdHJlYXN1cnkAAAATAAAAAAAAAA1taW5feGxtX3N0YWtlAAAAAAAACwAAAAAAAAASbWluX3BsYXRmb3JtX3N0YWtlAAAAAAALAAAAAAAAAAlqdXJ5X3NpemUAAAAAAAAEAAAAAAAAAAZxdW9ydW0AAAAAAAQAAAAAAAAACXNsYXNoX3BjdAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAALanVyb3Jfc3Rha2UAAAAAAQAAAAAAAAAFanVyb3IAAAAAAAATAAAAAQAAB9AAAAALSnVyb3JTdGFrZXMA",
        "AAAAAAAAAAAAAAAMc2V0X3RyZWFzdXJ5AAAAAQAAAAAAAAAIdHJlYXN1cnkAAAATAAAAAA==",
        "AAAAAAAAAAAAAAANZ2V0X2p1cnlfc2l6ZQAAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAANZ2V0X3NsYXNoX3BjdAAAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAANc2V0X3NsYXNoX3BjdAAAAAAAAAEAAAAAAAAACXNsYXNoX3BjdAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X21pbl9zdGFrZXMAAAAAAAAAAAABAAAD7QAAAAIAAAALAAAACw==",
        "AAAAAAAAAAAAAAAOc2V0X21pbl9zdGFrZXMAAAAAAAIAAAAAAAAADW1pbl94bG1fc3Rha2UAAAAAAAALAAAAAAAAABJtaW5fcGxhdGZvcm1fc3Rha2UAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAPc2V0X2p1cnlfcGFyYW1zAAAAAAIAAAAAAAAACWp1cnlfc2l6ZQAAAAAAAAQAAAAAAAAABnF1b3J1bQAAAAAABAAAAAA=",
        "AAAAAAAAAFBBZG1pbiBwYXlzIHN0YWtlIGZyb20gdGhlaXIgd2FsbGV0IGFuZCByZWdpc3RlcnMgYGp1cm9yYCAoc3BvbnNvcmVkIG9uYm9hcmRpbmcpLgAAABJyZWdpc3Rlcl9zcG9uc29yZWQAAAAAAAMAAAAAAAAABWp1cm9yAAAAAAAAEwAAAAAAAAAJeGxtX3N0YWtlAAAAAAAACwAAAAAAAAAOcGxhdGZvcm1fc3Rha2UAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAVc2V0X2lkZW50aXR5X3JlZ2lzdHJ5AAAAAAAAAQAAAAAAAAARaWRlbnRpdHlfcmVnaXN0cnkAAAAAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    vote: this.txFromJSON<null>,
        slash: this.txFromJSON<null>,
        assign: this.txFromJSON<null>,
        id_reg: this.txFromJSON<string>,
        is_reg: this.txFromJSON<boolean>,
        dispute: this.txFromJSON<null>,
        get_case: this.txFromJSON<CaseResult>,
        get_vote: this.txFromJSON<VoteRecord>,
        register: this.txFromJSON<null>,
        get_admin: this.txFromJSON<string>,
        get_quorum: this.txFromJSON<u32>,
        initialize: this.txFromJSON<null>,
        juror_stake: this.txFromJSON<JurorStakes>,
        set_treasury: this.txFromJSON<null>,
        get_jury_size: this.txFromJSON<u32>,
        get_slash_pct: this.txFromJSON<u32>,
        set_slash_pct: this.txFromJSON<null>,
        get_min_stakes: this.txFromJSON<readonly [i128, i128]>,
        set_min_stakes: this.txFromJSON<null>,
        set_jury_params: this.txFromJSON<null>,
        register_sponsored: this.txFromJSON<null>,
        set_identity_registry: this.txFromJSON<null>
  }
}