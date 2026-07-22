/**
 * Deploy (or wrap) the Ondex platform SAC on the configured network.
 * All network/admin values come from env — nothing hardcoded.
 *
 * Usage:
 *   pnpm tsx scripts/deploy-platform-token.ts
 *
 * Requires in .env:
 *   DEPLOYER_SECRET
 *   STELLAR_NETWORK  OR  (SOROBAN_RPC_URL + SOROBAN_NETWORK_PASSPHRASE)
 *   PLATFORM_ASSET_CODE
 *   ADMIN_ADDRESS (issuer/admin for the asset)
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found.");
    process.exit(1);
  }
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function requireEnv(env: Record<string, string>, key: string): string {
  const v = env[key];
  if (!v) {
    console.error(`Error: ${key} is required in .env.`);
    process.exit(1);
  }
  return v;
}

function networkArgs(env: Record<string, string>): string {
  if (env.STELLAR_NETWORK) return `--network ${env.STELLAR_NETWORK}`;
  if (env.SOROBAN_RPC_URL && env.SOROBAN_NETWORK_PASSPHRASE) {
    return `--rpc-url "${env.SOROBAN_RPC_URL}" --network-passphrase "${env.SOROBAN_NETWORK_PASSPHRASE}"`;
  }
  console.error(
    "Set STELLAR_NETWORK or SOROBAN_RPC_URL + SOROBAN_NETWORK_PASSPHRASE.",
  );
  process.exit(1);
}

function main(): void {
  const env = loadEnv();
  const secret = requireEnv(env, "DEPLOYER_SECRET");
  const assetCode = requireEnv(env, "PLATFORM_ASSET_CODE");
  const net = networkArgs(env);

  // Deploy classic asset as SAC via stellar CLI asset deploy
  console.log(`Deploying platform SAC for asset code ${assetCode}...`);
  let contractId: string;
  try {
    contractId = execSync(
      `stellar contract asset deploy --asset "${assetCode}:${requireEnv(env, "ADMIN_ADDRESS")}" --source "${secret}" ${net}`,
      { encoding: "utf-8" },
    ).trim();
  } catch (err: unknown) {
    // Fallback: if asset already has SAC, resolve id
    try {
      contractId = execSync(
        `stellar contract id asset --asset "${assetCode}:${requireEnv(env, "ADMIN_ADDRESS")}" ${net}`,
        { encoding: "utf-8" },
      ).trim();
      console.log("Asset SAC already exists; using existing id.");
    } catch {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to deploy platform SAC:", message);
      process.exit(1);
    }
  }

  console.log(`platform_token: ${contractId}`);

  const contractsJsonPath = path.join(process.cwd(), "contracts.json");
  let existing: {
    deployedAt?: string;
    network?: string;
    contracts: Record<string, string>;
  } = { contracts: {} };

  if (fs.existsSync(contractsJsonPath)) {
    existing = JSON.parse(fs.readFileSync(contractsJsonPath, "utf-8"));
    existing.contracts = existing.contracts || {};
  }

  existing.contracts.platform_token = contractId;
  if (env.XLM_TOKEN_CONTRACT_ID) {
    existing.contracts.xlm_token = env.XLM_TOKEN_CONTRACT_ID;
  }
  if (env.NETWORK_NAME || env.STELLAR_NETWORK) {
    existing.network = env.NETWORK_NAME || env.STELLAR_NETWORK;
  }
  if (!existing.deployedAt) {
    existing.deployedAt = new Date().toISOString();
  }

  fs.writeFileSync(contractsJsonPath, JSON.stringify(existing, null, 2) + "\n");
  console.log("Updated contracts.json with platform_token.");

  if (env.EXPLORER_BASE_URL) {
    console.log(
      `${env.EXPLORER_BASE_URL.replace(/\/$/, "")}/contract/${contractId}`,
    );
  }
}

main();
