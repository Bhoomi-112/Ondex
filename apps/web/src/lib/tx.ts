<<<<<<< Updated upstream
import { TransactionBuilder, Networks, Horizon, rpc, Account } from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RPC_URL = "https://soroban-testnet.stellar.org";
const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const horizonServer = new Horizon.Server(HORIZON_URL);
export const rpcServer = new rpc.Server(RPC_URL);
=======
import {
  TransactionBuilder,
  Horizon,
  rpc,
  Transaction,
} from "@stellar/stellar-sdk";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { getNetworkConfig, explorerTxUrl, explorerContractUrl } from "./contracts";
>>>>>>> Stashed changes

interface TxResult {
  hash: string;
  ledger: number;
  successful: boolean;
}

export async function submitTransaction(
  signedXdr: string,
): Promise<TxResult> {
  const transaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

  const response = await rpcServer.sendTransaction(transaction);

  if (response.status === "PENDING") {
    return await pollTxResult(response.hash);
  }

  if (response.status === "ERROR") {
    throw new Error(
      `Transaction failed: ${JSON.stringify(response)}`
    );
  }

  return {
    hash: response.hash,
    ledger: 0,
    successful: true,
  };
}

async function pollTxResult(hash: string, maxAttempts = 30): Promise<TxResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await rpcServer.getTransaction(hash);

    if (response.status === "SUCCESS") {
      return {
        hash,
        ledger: response.ledger,
        successful: true,
      };
    }

    if (response.status === "FAILED") {
      throw new Error(
        `Transaction failed on-chain: ${JSON.stringify(response)}`
      );
    }
  }

  throw new Error("Transaction timed out waiting for confirmation");
}

export async function fundTestnetAccount(address: string): Promise<string> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(address)}`);

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("already funded")) {
      return "already-funded";
    }
    throw new Error(`Friendbot funding failed: ${text}`);
  }

  const data = await response.json();
  const hash = data?.result?.successful
    ? data.result.hash
    : data?.hash || "unknown";
  return hash;
}

export async function checkAccountExists(address: string): Promise<boolean> {
  try {
    const account = await rpcServer.getAccount(address);
    return !!account;
  } catch {
    return false;
  }
}

export function getExplorerUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function getContractExplorerUrl(contractId: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
}

function isBadSeqError(err: unknown): boolean {
  const msg = String(err);
  return msg.includes("txBadSeq") || msg.includes("txbad_seq") || msg.includes("-5");
}

export async function buildSignSubmit(
  buildFn: () => Promise<{ toXDR(): string }>,
  signFn: (xdr: string) => Promise<{ signedTxXdr: string }>,
  maxRetries = 2,
): Promise<TxResult> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }
    try {
      const assembled = await buildFn();
      const { signedTxXdr } = await signFn(assembled.toXDR());
      return await submitTransaction(signedTxXdr);
    } catch (err: unknown) {
      lastError = err;
      if (!isBadSeqError(err)) throw err;
    }
  }
  throw lastError;
}
<<<<<<< Updated upstream
=======

/**
 * Sign and send a Soroban transaction that requires auth (e.g. `requireAuth()`).
 * Unlike `buildSignSubmit`, this properly handles Soroban auth entry signing
 * by using `AssembledTransaction.signAndSend()` with Freighter as the wallet.
 */
export async function signAndSendSorobanTx<A>(
  assembled: AssembledTransaction<A>,
  signTx: (
    xdr: string,
    opts?: { networkPassphrase?: string; address?: string },
  ) => Promise<{ signedTxXdr: string }>,
  address: string,
  maxRetries = 2,
): Promise<TxResult> {
  const { networkPassphrase } = getNetworkConfig();

  const signer = async (
    tx: Transaction,
    opts?: { networkPassphrase?: string; address?: string },
  ) => {
    const xdr = tx.toXDR();
    const result = await signTx(xdr, {
      networkPassphrase: opts?.networkPassphrase ?? networkPassphrase,
      address: opts?.address ?? address,
    });
    return result.signedTxXdr;
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }
    try {
      const sent = await (assembled.signAndSend as any)({ signTransaction: signer });
      const hash = typeof sent.hash === "string" ? sent.hash : sent.hash.toString();
      return { hash, ledger: sent.ledger ?? 0, successful: true };
    } catch (err: unknown) {
      lastError = err;
      if (!isBadSeqError(err)) throw err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError));
}

// Avoid unused import if Horizon only used in helper
void horizonServer;
>>>>>>> Stashed changes
