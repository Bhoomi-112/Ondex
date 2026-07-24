import { rpc, Horizon } from "@stellar/stellar-sdk";
import { config } from "../config.js";

export const rpcClient = new rpc.Server(config.sorobanRpcUrl);
export const horizonServer = new Horizon.Server(config.horizonUrl);

export async function checkRpcConnection(): Promise<boolean> {
  try {
    const response = await rpcClient.getHealth();
    return response.status === "healthy";
  } catch {
    return false;
  }
}

export async function getLatestLedger(): Promise<number> {
  const ledger = await rpcClient.getLatestLedger();
  return ledger.sequence;
}
