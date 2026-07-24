import "./env.js";

(BigInt.prototype as any).toJSON = function () {
  return String(this);
};
import { config, requiredConfig } from "./config.js";
import { createLogger } from "./lib/logger.js";
import { prisma, checkDatabaseConnection } from "./lib/db.js";
import { rpcClient, checkRpcConnection } from "./lib/stellar.js";
import { EventIndexer } from "./indexer/indexer.js";
import app from "./app.js";

const logger = createLogger("startup");

type ContractType = "platform" | "campaign" | "case" | "juror" | "identity";

function buildContractSpecs(): Array<{ contractId: string; type: ContractType }> {
  const specs: Array<{ contractId: string; type: ContractType }> = [];
  const c = config.contracts;

  if (c.platformToken) specs.push({ contractId: c.platformToken, type: "platform" });
  if (c.escrow) specs.push({ contractId: c.escrow, type: "campaign" });
  if (c.juryRegistry) {
    specs.push({ contractId: c.juryRegistry, type: "case" });
    specs.push({ contractId: c.juryRegistry, type: "juror" });
  }
  if (c.identityRegistry) specs.push({ contractId: c.identityRegistry, type: "identity" });

  return specs;
}

async function main(): Promise<void> {
  requiredConfig();

  logger.info({ port: config.port, env: config.nodeEnv }, "Starting API server");

  const dbOk = await checkDatabaseConnection();
  if (!dbOk) {
    logger.fatal("Database connection failed");
    process.exit(1);
  }
  logger.info("Database connection verified");

  const rpcOk = await checkRpcConnection();
  if (!rpcOk) {
    logger.fatal("Soroban RPC connection failed");
    process.exit(1);
  }
  logger.info("Soroban RPC connection verified");

  const server = app.listen(config.port, () => {
    logger.info({ url: `http://localhost:${config.port}` }, "API server listening");
  });

  const contractSpecs = buildContractSpecs();
  let indexer: EventIndexer | null = null;

  if (contractSpecs.length > 0) {
    indexer = new EventIndexer(rpcClient, contractSpecs);
    await indexer.start();
    logger.info(
      { contracts: contractSpecs.map((c) => c.type) },
      "Event indexer started",
    );
  } else {
    logger.warn("No contract IDs configured; indexer not started");
  }

  async function shutdown(signal: string): Promise<void> {
    logger.info({ signal }, "Shutdown signal received");

    if (indexer) {
      indexer.stop();
      logger.info("Indexer stopped");
    }

    server.close(() => {
      logger.info("HTTP server closed");
    });

    await prisma.$disconnect();
    logger.info("Database disconnected");

    process.exit(0);
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.fatal({ err }, "Startup failed");
  process.exit(1);
});
