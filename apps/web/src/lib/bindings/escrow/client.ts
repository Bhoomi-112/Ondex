import {Milestone, CampaignStatus} from './types';
import {Spec, AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions} from '@stellar/stellar-sdk/contract';
import {Address} from '@stellar/stellar-sdk';

export interface Client {
  deposit({ investor, amount }: { investor: string | Address; amount: bigint }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  get_goal(options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  initialize({ admin, creator, goal, milestone_amounts, platform_addr, deadline }: { admin: string | Address; creator: string | Address; goal: bigint; milestone_amounts: Array<bigint>; platform_addr: string | Address; deadline: bigint }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  get_creator(options?: MethodOptions): Promise<AssembledTransaction<string>>;
  get_deposit({ investor }: { investor: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  claim_refund({ investor }: { investor: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  get_deadline(options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  get_milestone({ index }: { index: number }, options?: MethodOptions): Promise<AssembledTransaction<Milestone>>;
  release_milestone({ index }: { index: number }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  get_released_count(options?: MethodOptions): Promise<AssembledTransaction<number>>;
  get_campaign_status(options?: MethodOptions): Promise<AssembledTransaction<CampaignStatus>>;
  get_milestone_count(options?: MethodOptions): Promise<AssembledTransaction<number>>;
  get_total_deposited(options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
}

export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new Spec(["AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAACAAAAAAAAAAhpbnZlc3RvcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAAL", "AAAAAAAAAAAAAAAIZ2V0X2dvYWwAAAAAAAAAAQAAAAs=", "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAB0RlcG9zaXQAAAAAAQAAABMAAAABAAAAAAAAAAlNaWxlc3RvbmUAAAAAAAABAAAABA==", "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAABGdvYWwAAAALAAAAAAAAABFtaWxlc3RvbmVfYW1vdW50cwAAAAAAA+oAAAALAAAAAAAAAA1wbGF0Zm9ybV9hZGRyAAAAAAAAEwAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAA==", "AAAAAAAAAAAAAAALZ2V0X2NyZWF0b3IAAAAAAAAAAAEAAAAT", "AAAAAAAAAAAAAAALZ2V0X2RlcG9zaXQAAAAAAQAAAAAAAAAIaW52ZXN0b3IAAAATAAAAAQAAAAs=", "AAAAAQAAAAAAAAAAAAAACU1pbGVzdG9uZQAAAAAAAAIAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAIcmVsZWFzZWQAAAAB", "AAAAAAAAAAAAAAAMY2xhaW1fcmVmdW5kAAAAAQAAAAAAAAAIaW52ZXN0b3IAAAATAAAAAQAAAAs=", "AAAAAAAAAAAAAAAMZ2V0X2RlYWRsaW5lAAAAAAAAAAEAAAAG", "AAAAAAAAAAAAAAANZ2V0X21pbGVzdG9uZQAAAAAAAAEAAAAAAAAABWluZGV4AAAAAAAABAAAAAEAAAfQAAAACU1pbGVzdG9uZQAAAA==", "AAAAAgAAAAAAAAAAAAAADkNhbXBhaWduU3RhdHVzAAAAAAAEAAAAAAAAAAAAAAAGQWN0aXZlAAAAAAAAAAAAAAAAAAlDb21wbGV0ZWQAAAAAAAAAAAAAAAAAAAZGYWlsZWQAAAAAAAAAAAAAAAAACVJlZnVuZGluZwAAAA==", "AAAAAAAAAAAAAAARcmVsZWFzZV9taWxlc3RvbmUAAAAAAAABAAAAAAAAAAVpbmRleAAAAAAAAAQAAAABAAAACw==", "AAAAAAAAAAAAAAASZ2V0X3JlbGVhc2VkX2NvdW50AAAAAAAAAAAAAQAAAAQ=", "AAAAAAAAAAAAAAATZ2V0X2NhbXBhaWduX3N0YXR1cwAAAAAAAAAAAQAAB9AAAAAOQ2FtcGFpZ25TdGF0dXMAAA==", "AAAAAAAAAAAAAAATZ2V0X21pbGVzdG9uZV9jb3VudAAAAAAAAAAAAQAAAAQ=", "AAAAAAAAAAAAAAATZ2V0X3RvdGFsX2RlcG9zaXRlZAAAAAAAAAAAAQAAAAs="]),
      options
    );
  }

   static deploy<T = Client>(options: MethodOptions & Omit<ContractClientOptions, 'contractId'> & { wasmHash: Buffer | string; salt?: Buffer | Uint8Array; format?: "hex" | "base64"; address?: string; }): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  public readonly fromJSON = {
    deposit : this.txFromJSON<bigint>,  get_goal : this.txFromJSON<bigint>,  initialize : this.txFromJSON<void>,  get_creator : this.txFromJSON<string>,  get_deposit : this.txFromJSON<bigint>,  claim_refund : this.txFromJSON<bigint>,  get_deadline : this.txFromJSON<bigint>,  get_milestone : this.txFromJSON<Milestone>,  release_milestone : this.txFromJSON<bigint>,  get_released_count : this.txFromJSON<number>,  get_campaign_status : this.txFromJSON<CampaignStatus>,  get_milestone_count : this.txFromJSON<number>,  get_total_deposited : this.txFromJSON<bigint>
  };
}