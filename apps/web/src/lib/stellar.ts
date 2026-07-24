import {
  TransactionBuilder,
  Contract,
  Address,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";

export const NETWORK_PASSPHRASE: string =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? (() => { throw new Error("NEXT_PUBLIC_NETWORK_PASSPHRASE not set"); })();
export const SOROBAN_RPC_URL: string =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? (() => { throw new Error("NEXT_PUBLIC_SOROBAN_RPC_URL not set"); })();

export const rpcClient = new rpc.Server(SOROBAN_RPC_URL);

export async function buildContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  source: string
): Promise<TransactionBuilder> {
  const sourceAccount = await rpcClient.getAccount(source);
  const contractObj = new Contract(contractId);

  const operation = contractObj.call(method, ...args);

  return new TransactionBuilder(sourceAccount, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(120);
}

export async function simulateTx(tx: TransactionBuilder): Promise<rpc.Api.SimulateTransactionResponse> {
  const built = tx.build();
  return rpcClient.simulateTransaction(built);
}

export function parseScVal(val: xdr.ScVal): unknown {
  if (val.switch() === xdr.ScValType.scvBool()) {
    return val.b();
  }
  if (val.switch() === xdr.ScValType.scvVoid()) {
    return null;
  }
  if (val.switch() === xdr.ScValType.scvU32()) {
    return val.u32();
  }
  if (val.switch() === xdr.ScValType.scvI32()) {
    return val.i32();
  }
  if (val.switch() === xdr.ScValType.scvU64()) {
    return Number(val.u64());
  }
  if (val.switch() === xdr.ScValType.scvI64()) {
    return Number(val.i64());
  }
  if (val.switch() === xdr.ScValType.scvU128()) {
    return val.u128().toString();
  }
  if (val.switch() === xdr.ScValType.scvI128()) {
    return val.i128().toString();
  }
  if (val.switch() === xdr.ScValType.scvU256()) {
    return val.u256().toString();
  }
  if (val.switch() === xdr.ScValType.scvI256()) {
    return val.i256().toString();
  }
  if (val.switch() === xdr.ScValType.scvBytes()) {
    return val.bytes().toString("hex");
  }
  if (val.switch() === xdr.ScValType.scvString()) {
    return val.str().toString("utf8");
  }
  if (val.switch() === xdr.ScValType.scvSymbol()) {
    return val.sym().toString("utf8");
  }
  if (val.switch() === xdr.ScValType.scvAddress()) {
    return Address.fromScAddress(val.address()).toString();
  }
  if (val.switch() === xdr.ScValType.scvVec()) {
    const vec = val.vec();
    return vec ? vec.map(parseScVal) : [];
  }
  if (val.switch() === xdr.ScValType.scvMap()) {
    const map = val.map();
    if (!map) return {};
    const result: Record<string, unknown> = {};
    for (const entry of map) {
      const key = parseScVal(entry.key()) as string;
      result[key] = parseScVal(entry.val());
    }
    return result;
  }
  return val.toXDR("base64");
}
