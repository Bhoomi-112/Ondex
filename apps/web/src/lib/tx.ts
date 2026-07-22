import { TransactionBuilder, Horizon, rpc } from "@stellar/stellar-sdk";
import { getNetworkConfig, explorerTxUrl, explorerContractUrl } from "./contracts";

interface TxResult {
  hash: string;
  ledger: number;
  successful: boolean;
}

function horizonServer(): Horizon.Server {
  return new Horizon.Server(getNetworkConfig().horizonUrl);
}

function rpcServer(): rpc.Server {
  return new rpc.Server(getNetworkConfig().rpcUrl);
}

export async function submitTransaction(signedXdr: string): Promise<TxResult> {
  const { networkPassphrase } = getNetworkConfig();
  const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const response = await rpcServer().sendTransaction(transaction);

  if (response.status === "PENDING") {
    return await pollTxResult(response.hash);
  }

  if (response.status === "ERROR") {
    throw new Error(`Transaction failed: ${JSON.stringify(response)}`);
  }

  return {
    hash: response.hash,
    ledger: 0,
    successful: true,
  };
}

async function pollTxResult(
  hash: string,
  maxAttempts = 30,
): Promise<TxResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await rpcServer().getTransaction(hash);

    if (response.status === "SUCCESS") {
      return {
        hash,
        ledger: response.ledger,
        successful: true,
      };
    }

    if (response.status === "FAILED") {
      throw new Error(
        `Transaction failed on-chain: ${JSON.stringify(response)}`,
      );
    }
  }

  throw new Error("Transaction timed out waiting for confirmation");
}

export async function fundTestnetAccount(address: string): Promise<string> {
  const friendbot = process.env.NEXT_PUBLIC_FRIENDBOT_URL;
  if (!friendbot) {
    throw new Error(
      "NEXT_PUBLIC_FRIENDBOT_URL is not set. Cannot fund account.",
    );
  }
  const response = await fetch(
    `${friendbot.replace(/\/$/, "")}?addr=${encodeURIComponent(address)}`,
  );

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("already funded")) {
      return "already-funded";
    }
    throw new Error(`Friendbot funding failed: ${text}`);
  }

  const data = (await response.json()) as {
    result?: { successful?: boolean; hash?: string };
    hash?: string;
  };
  return data?.result?.hash || data?.hash || "unknown";
}

export async function checkAccountExists(address: string): Promise<boolean> {
  try {
    const account = await rpcServer().getAccount(address);
    return !!account;
  } catch {
    return false;
  }
}

export function getExplorerUrl(hash: string): string {
  return explorerTxUrl(hash);
}

export function getContractExplorerUrl(contractId: string): string {
  return explorerContractUrl(contractId);
}

function isBadSeqError(err: unknown): boolean {
  const msg = String(err);
  return (
    msg.includes("txBadSeq") ||
    msg.includes("txbad_seq") ||
    msg.includes("-5")
  );
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
  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError));
}

// Avoid unused import if Horizon only used in helper
void horizonServer;
