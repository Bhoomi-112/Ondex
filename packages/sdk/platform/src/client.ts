import {Vote, Application, MilestoneInfo} from './types.js';
import {Spec, AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions} from '@stellar/stellar-sdk/contract';
import {Address} from '@stellar/stellar-sdk';

export interface Client {
  is_juror({ juror }: { juror: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<boolean>>;
  cast_vote({ voter, app_id, approve, comment_hash }: { voter: string | Address; app_id: bigint; approve: boolean; comment_hash: string }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  get_votes({ app_id }: { app_id: bigint }, options?: MethodOptions): Promise<AssembledTransaction<Array<Vote>>>;
  initialize({ admin }: { admin: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  get_vote_count({ app_id }: { app_id: bigint }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  register_juror({ juror }: { juror: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  set_mask_flags({ app_id, mask_name, mask_address }: { app_id: bigint; mask_name: boolean; mask_address: boolean }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  create_campaign({ app_id, escrow_addr }: { app_id: bigint; escrow_addr: string | Address }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  get_application({ id }: { id: bigint }, options?: MethodOptions): Promise<AssembledTransaction<Application>>;
  list_applications({ offset, limit }: { offset: bigint; limit: bigint }, options?: MethodOptions): Promise<AssembledTransaction<Array<Application>>>;
  reject_application({ app_id }: { app_id: bigint }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  submit_application({ startup, name, pitch, ask_amount, milestones, mask_name, mask_address }: { startup: string | Address; name: string; pitch: string; ask_amount: bigint; milestones: Array<MilestoneInfo>; mask_name: boolean; mask_address: boolean }, options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
  approve_application({ app_id }: { app_id: bigint }, options?: MethodOptions): Promise<AssembledTransaction<void>>;
  get_application_count(options?: MethodOptions): Promise<AssembledTransaction<bigint>>;
}

export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new Spec(["AAAAAQAAAAAAAAAAAAAABFZvdGUAAAAEAAAAAAAAAAdhcHByb3ZlAAAAAAEAAAAAAAAADGNvbW1lbnRfaGFzaAAAABEAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABXZvdGVyAAAAAAAAEw==", "AAAAAAAAAAAAAAAIaXNfanVyb3IAAAABAAAAAAAAAAVqdXJvcgAAAAAAABMAAAABAAAAAQ==", "AAAAAAAAAAAAAAAJY2FzdF92b3RlAAAAAAAABAAAAAAAAAAFdm90ZXIAAAAAAAATAAAAAAAAAAZhcHBfaWQAAAAAAAYAAAAAAAAAB2FwcHJvdmUAAAAAAQAAAAAAAAAMY29tbWVudF9oYXNoAAAAEQAAAAA=", "AAAAAAAAAAAAAAAJZ2V0X3ZvdGVzAAAAAAAAAQAAAAAAAAAGYXBwX2lkAAAAAAAGAAAAAQAAA+oAAAfQAAAABFZvdGU=", "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAAC0FwcGxpY2F0aW9uAAAAAAEAAAAGAAAAAQAAAAAAAAAIQ2FtcGFpZ24AAAABAAAABgAAAAEAAAAAAAAABFZvdGUAAAACAAAABgAAABMAAAABAAAAAAAAAAlWb3RlQ291bnQAAAAAAAABAAAABgAAAAEAAAAAAAAADkp1cm9yVm90ZUNvdW50AAAAAAABAAAABg==", "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==", "AAAAAgAAAAAAAAAAAAAACUFwcFN0YXR1cwAAAAAAAAQAAAAAAAAAAAAAAAlTdWJtaXR0ZWQAAAAAAAAAAAAAAAAAAAtVbmRlclJldmlldwAAAAAAAAAAAAAAAAhBcHByb3ZlZAAAAAAAAAAAAAAACFJlamVjdGVk", "AAAAAQAAAAAAAAAAAAAAC0FwcGxpY2F0aW9uAAAAAAkAAAAAAAAACmFza19hbW91bnQAAAAAAAsAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAxtYXNrX2FkZHJlc3MAAAABAAAAAAAAAAltYXNrX25hbWUAAAAAAAABAAAAAAAAAAptaWxlc3RvbmVzAAAAAAPqAAAH0AAAAA1NaWxlc3RvbmVJbmZvAAAAAAAAAAAAAARuYW1lAAAAEQAAAAAAAAAFcGl0Y2gAAAAAAAARAAAAAAAAAAdzdGFydHVwAAAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAAlBcHBTdGF0dXMAAAA=", "AAAAAAAAAAAAAAAOZ2V0X3ZvdGVfY291bnQAAAAAAAEAAAAAAAAABmFwcF9pZAAAAAAABgAAAAEAAAAG", "AAAAAAAAAAAAAAAOcmVnaXN0ZXJfanVyb3IAAAAAAAEAAAAAAAAABWp1cm9yAAAAAAAAEwAAAAA=", "AAAAAAAAAAAAAAAOc2V0X21hc2tfZmxhZ3MAAAAAAAMAAAAAAAAABmFwcF9pZAAAAAAABgAAAAAAAAAJbWFza19uYW1lAAAAAAAAAQAAAAAAAAAMbWFza19hZGRyZXNzAAAAAQAAAAA=", "AAAAAAAAAAAAAAAPY3JlYXRlX2NhbXBhaWduAAAAAAIAAAAAAAAABmFwcF9pZAAAAAAABgAAAAAAAAALZXNjcm93X2FkZHIAAAAAEwAAAAEAAAAG", "AAAAAAAAAAAAAAAPZ2V0X2FwcGxpY2F0aW9uAAAAAAEAAAAAAAAAAmlkAAAAAAAGAAAAAQAAB9AAAAALQXBwbGljYXRpb24A", "AAAAAQAAAAAAAAAAAAAADU1pbGVzdG9uZUluZm8AAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABE=", "AAAAAAAAAAAAAAARbGlzdF9hcHBsaWNhdGlvbnMAAAAAAAACAAAAAAAAAAZvZmZzZXQAAAAAAAYAAAAAAAAABWxpbWl0AAAAAAAABgAAAAEAAAPqAAAH0AAAAAtBcHBsaWNhdGlvbgA=", "AAAAAAAAAAAAAAAScmVqZWN0X2FwcGxpY2F0aW9uAAAAAAABAAAAAAAAAAZhcHBfaWQAAAAAAAYAAAAA", "AAAAAAAAAAAAAAASc3VibWl0X2FwcGxpY2F0aW9uAAAAAAAHAAAAAAAAAAdzdGFydHVwAAAAABMAAAAAAAAABG5hbWUAAAARAAAAAAAAAAVwaXRjaAAAAAAAABEAAAAAAAAACmFza19hbW91bnQAAAAAAAsAAAAAAAAACm1pbGVzdG9uZXMAAAAAA+oAAAfQAAAADU1pbGVzdG9uZUluZm8AAAAAAAAAAAAACW1hc2tfbmFtZQAAAAAAAAEAAAAAAAAADG1hc2tfYWRkcmVzcwAAAAEAAAABAAAABg==", "AAAAAAAAAAAAAAATYXBwcm92ZV9hcHBsaWNhdGlvbgAAAAABAAAAAAAAAAZhcHBfaWQAAAAAAAYAAAAA", "AAAAAAAAAAAAAAAVZ2V0X2FwcGxpY2F0aW9uX2NvdW50AAAAAAAAAAAAAAEAAAAG"]),
      options
    );
  }

   static deploy<T = Client>(options: MethodOptions & Omit<ContractClientOptions, 'contractId'> & { wasmHash: Buffer | string; salt?: Buffer | Uint8Array; format?: "hex" | "base64"; address?: string; }): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  public readonly fromJSON = {
    is_juror : this.txFromJSON<boolean>,  cast_vote : this.txFromJSON<void>,  get_votes : this.txFromJSON<Array<Vote>>,  initialize : this.txFromJSON<void>,  get_vote_count : this.txFromJSON<bigint>,  register_juror : this.txFromJSON<void>,  set_mask_flags : this.txFromJSON<void>,  create_campaign : this.txFromJSON<bigint>,  get_application : this.txFromJSON<Application>,  list_applications : this.txFromJSON<Array<Application>>,  reject_application : this.txFromJSON<void>,  submit_application : this.txFromJSON<bigint>,  approve_application : this.txFromJSON<void>,  get_application_count : this.txFromJSON<bigint>
  };
}