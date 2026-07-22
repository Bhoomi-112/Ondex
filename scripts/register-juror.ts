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
    console.error(`Error: ${key} is required.`);
    process.exit(1);
  }
  return v;
}

function loadJuryId(env: Record<string, string>): string {
  if (env.JURY_REGISTRY_CONTRACT_ID) return env.JURY_REGISTRY_CONTRACT_ID;
  const jsonPath =
    env.CONTRACTS_JSON_PATH || path.join(process.cwd(), "contracts.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Error: contracts.json not found and JURY_REGISTRY_CONTRACT_ID unset.");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const id = raw.contracts?.jury_registry;
  if (!id) {
    console.error("Error: jury_registry missing from contracts.json");
    process.exit(1);
  }
  return id;
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
  const juror = process.argv[2] || env.JUROR_ADDRESS;
  if (!juror) {
    console.error("Usage: tsx scripts/register-juror.ts <juror_address>");
    process.exit(1);
  }
  const xlmStake = requireEnv(env, "INIT_MIN_XLM_STAKE");
  const platformStake = requireEnv(env, "INIT_MIN_PLATFORM_STAKE");
  const juryId = loadJuryId(env);
  const net = networkArgs(env);

  const cmd = [
    "stellar",
    "contract",
    "invoke",
    "--id",
    juryId,
    "--source",
    secret,
    net,
    "--",
    "register",
    "--juror",
    juror,
    "--xlm_stake",
    xlmStake,
    "--platform_stake",
    platformStake,
  ].join(" ");

  console.log(`Registering juror ${juror} on ${juryId}...`);
  try {
    const out = execSync(cmd, { encoding: "utf-8" });
    console.log(out);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("register failed:", message);
    process.exit(1);
  }
}

main();
