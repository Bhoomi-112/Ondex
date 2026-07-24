import { Keypair, TransactionBuilder, BASE_FEE, Operation, Address, nativeToScVal } from "@stellar/stellar-sdk";
import { config } from "../config.js";
import { createLogger } from "../lib/logger.js";
import { rpcClient, horizonServer } from "../lib/stellar.js";

const log = createLogger("AiVoter");

export interface VoteResult {
  success: boolean;
  txHash?: string;
  errorMessage?: string;
}

export async function castVote(
  caseId: number,
  approve: boolean,
): Promise<VoteResult> {
  try {
    const secretKey = config.aiAgentSecretKey;
    const agentKeypair = Keypair.fromSecret(secretKey);
    const agentPublicKey = agentKeypair.publicKey();
    const juryRegistryId = config.contracts.juryRegistry;

    if (!juryRegistryId) {
      throw new Error("JURY_REGISTRY_CONTRACT_ID not configured");
    }

    const account = await horizonServer.loadAccount(agentPublicKey);

    const voteSymbol = approve ? "For" : "Against";

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: juryRegistryId,
          function: "vote",
          args: [
            nativeToScVal(caseId, { type: "u32" }),
            Address.fromString(agentPublicKey).toScVal(),
            nativeToScVal(voteSymbol, { type: "symbol" }),
          ],
        }),
      )
      .setTimeout(30)
      .build();

    const preparedTx = await rpcClient.prepareTransaction(tx);

    preparedTx.sign(agentKeypair);

    const sendResponse = await rpcClient.sendTransaction(preparedTx);

    if (sendResponse.status === "PENDING") {
      const txHash = sendResponse.hash;
      log.info({ txHash, caseId, approve }, "AI vote transaction submitted");

      let attempts = 0;
      while (attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const getResponse = await rpcClient.getTransaction(txHash);

        if (getResponse.status === "SUCCESS") {
          log.info({ txHash, caseId }, "AI vote transaction confirmed");
          return { success: true, txHash };
        }

        if (getResponse.status === "FAILED") {
          log.error({ txHash, caseId }, "AI vote transaction failed on-chain");
          return { success: false, errorMessage: "Transaction failed on-chain" };
        }

        attempts++;
      }

      return { success: false, errorMessage: "Timed out waiting for confirmation" };
    }

    const errorDetail = (sendResponse as any).errorResult?.result?.code || "unknown";
    return { success: false, errorMessage: `Transaction rejected: ${errorDetail}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error({ err, caseId }, "Failed to cast AI vote");
    return { success: false, errorMessage: msg };
  }
}