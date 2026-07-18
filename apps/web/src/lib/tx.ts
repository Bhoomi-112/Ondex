import { TransactionBuilder, Networks, Horizon, rpc } from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RPC_URL = "https://soroban-testnet.stellar.org";

export const horizonServer = new Horizon.Server(HORIZON_URL);
export const rpcServer = new rpc.Server(RPC_URL);

interface TxResult {
  hash: string;
  ledger: number;
  successful: boolean;
}

export async function submitTransaction(
  signedXdr: string,
  opts?: { timeout?: number }
): Promise<TxResult> {
  const transaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

  const response = await rpcServer.sendTransaction(transaction, opts?.timeout || 30);

  if (response.status === "PENDING") {
    return await pollTxResult(response.hash);
  }

  if (response.status === "ERROR") {
    throw new Error(
      `Transaction failed: ${response.error || JSON.stringify(response)}`
    );
  }

  return {
    hash: response.hash,
    ledger: response.ledger || 0,
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

export function getExplorerUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function getContractExplorerUrl(contractId: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
}
