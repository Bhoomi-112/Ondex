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




export type DataKey = {tag: "Commitment", values: readonly [Buffer]} | {tag: "Revealed", values: readonly [Buffer]} | {tag: "Committed", values: readonly [Buffer]} | {tag: "Nullifier", values: readonly [Buffer]} | {tag: "CaseLink", values: readonly [Buffer]} | {tag: "JuryRegistry", values: void} | {tag: "Initialized", values: void};


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

export interface Client {
  /**
   * Construct and simulate a commit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  commit: ({identity_id, commitment_hash}: {identity_id: Buffer, commitment_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a reveal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reveal: ({identity_id, case_id, backend_ref}: {identity_id: Buffer, case_id: u32, backend_ref: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a verify transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  verify: ({identity_id}: {identity_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a link_case transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  link_case: ({identity_id, case_id}: {identity_id: Buffer, case_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({jury_registry}: {jury_registry: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_committed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_committed: ({identity_id}: {identity_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_commitment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_commitment: ({identity_id}: {identity_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_linked_case transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_linked_case: ({identity_id}: {identity_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_jury_registry transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_jury_registry: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAEAAAAAAAAACkNvbW1pdG1lbnQAAAAAAAEAAAAOAAAAAQAAAAAAAAAIUmV2ZWFsZWQAAAABAAAADgAAAAEAAAAAAAAACUNvbW1pdHRlZAAAAAAAAAEAAAAOAAAAAQAAAAAAAAAJTnVsbGlmaWVyAAAAAAAAAQAAAA4AAAABAAAAAAAAAAhDYXNlTGluawAAAAEAAAAOAAAAAAAAAAAAAAAMSnVyeVJlZ2lzdHJ5AAAAAAAAAAAAAAALSW5pdGlhbGl6ZWQA",
        "AAAAAQAAAAAAAAAAAAAACkNhc2VSZXN1bHQAAAAAAAcAAAAAAAAADWFnYWluc3Rfdm90ZXMAAAAAAAAEAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAAAAAAE2Rpc3B1dGVfd2luZG93X3NlY3MAAAAABgAAAAAAAAAJZm9yX3ZvdGVzAAAAAAAABAAAAAAAAAALcmVzb2x2ZWRfYXQAAAAABgAAAAAAAAAGc3RhdHVzAAAAAAfQAAAACkNhc2VTdGF0dXMAAAAAAAAAAAALdG90YWxfdm90ZXMAAAAABA==",
        "AAAAAgAAAAAAAAAAAAAACkNhc2VTdGF0dXMAAAAAAAQAAAAAAAAAAAAAAAZWb3RpbmcAAAAAAAAAAAAAAAAACFJlc29sdmVkAAAAAAAAAAAAAAAIRGlzcHV0ZWQAAAAAAAAAAAAAAAdTbGFzaGVkAA==",
        "AAAAAAAAAAAAAAAGY29tbWl0AAAAAAACAAAAAAAAAAtpZGVudGl0eV9pZAAAAAAOAAAAAAAAAA9jb21taXRtZW50X2hhc2gAAAAADgAAAAA=",
        "AAAAAAAAAAAAAAAGcmV2ZWFsAAAAAAADAAAAAAAAAAtpZGVudGl0eV9pZAAAAAAOAAAAAAAAAAdjYXNlX2lkAAAAAAQAAAAAAAAAC2JhY2tlbmRfcmVmAAAAAA4AAAAA",
        "AAAAAAAAAAAAAAAGdmVyaWZ5AAAAAAABAAAAAAAAAAtpZGVudGl0eV9pZAAAAAAOAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAJbGlua19jYXNlAAAAAAAAAgAAAAAAAAALaWRlbnRpdHlfaWQAAAAADgAAAAAAAAAHY2FzZV9pZAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAANanVyeV9yZWdpc3RyeQAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAMaXNfY29tbWl0dGVkAAAAAQAAAAAAAAALaWRlbnRpdHlfaWQAAAAADgAAAAEAAAAB",
        "AAAAAAAAAAAAAAAOZ2V0X2NvbW1pdG1lbnQAAAAAAAEAAAAAAAAAC2lkZW50aXR5X2lkAAAAAA4AAAABAAAADg==",
        "AAAAAAAAAAAAAAAPZ2V0X2xpbmtlZF9jYXNlAAAAAAEAAAAAAAAAC2lkZW50aXR5X2lkAAAAAA4AAAABAAAABA==",
        "AAAAAAAAAAAAAAARZ2V0X2p1cnlfcmVnaXN0cnkAAAAAAAAAAAAAAQAAABM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    commit: this.txFromJSON<null>,
        reveal: this.txFromJSON<null>,
        verify: this.txFromJSON<boolean>,
        link_case: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>,
        is_committed: this.txFromJSON<boolean>,
        get_commitment: this.txFromJSON<Buffer>,
        get_linked_case: this.txFromJSON<u32>,
        get_jury_registry: this.txFromJSON<string>
  }
}