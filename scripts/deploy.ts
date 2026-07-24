import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const CONTRACTS = [
  { label: "escrow_contract", wasm: "escrow_contract.wasm" },
  { label: "identity_registry", wasm: "identity_registry.wasm" },
] as const;

function loadEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found. Copy .env.example to .env");
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
    console.error(`Error: ${key} is required in .env (no hardcoded defaults).`);
    process.exit(1);
  }
  return v;
}

function checkStellarCli(): void {
  try {
    execSync("stellar --version", { stdio: "ignore" });
  } catch {
    console.error("Error: Stellar CLI not found.");
    process.exit(1);
  }
}

function networkFlag(env: Record<string, string>): string {
  if (env.STELLAR_NETWORK) {
    return `--network ${env.STELLAR_NETWORK}`;
  }
  if (env.SOROBAN_RPC_URL && env.SOROBAN_NETWORK_PASSPHRASE) {
    return `--rpc-url "${env.SOROBAN_RPC_URL}" --network-passphrase "${env.SOROBAN_NETWORK_PASSPHRASE}"`;
  }
  console.error(
    "Error: set STELLAR_NETWORK or both SOROBAN_RPC_URL and SOROBAN_NETWORK_PASSPHRASE.",
  );
  process.exit(1);
}

function invoke(
  secret: string,
  net: string,
  contractId: string,
  fn: string,
  args: string[],
): string {
  const cmd = [
    "stellar",
    "contract",
    "invoke",
    "--id",
    contractId,
    "--source",
    secret,
    ...net.split(" ").filter(Boolean),
    "--",
    fn,
    ...args,
  ].join(" ");
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function main(): void {
  const force = process.argv.includes("--force");
  const skipInit = process.argv.includes("--skip-init");
  const env = loadEnv();
  const secret = requireEnv(env, "DEPLOYER_SECRET");
  const net = networkFlag(env);

  checkStellarCli();

  const contractsJsonPath = path.join(process.cwd(), "contracts.json");
  if (fs.existsSync(contractsJsonPath) && !force) {
    console.error("Error: contracts.json already exists. Use --force to overwrite.");
    process.exit(1);
  }

  const contractIds: Record<string, string> = {};

  if (fs.existsSync(contractsJsonPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(contractsJsonPath, "utf-8"));
      if (prev.contracts?.platform_token) {
        contractIds.platform_token = prev.contracts.platform_token;
      }
      if (prev.contracts?.xlm_token) {
        contractIds.xlm_token = prev.contracts.xlm_token;
      }
    } catch {
      /* ignore */
    }
  }

  if (env.PLATFORM_TOKEN_CONTRACT_ID) {
    contractIds.platform_token = env.PLATFORM_TOKEN_CONTRACT_ID;
  }
  if (env.XLM_TOKEN_CONTRACT_ID) {
    contractIds.xlm_token = env.XLM_TOKEN_CONTRACT_ID;
  }

  for (const contract of CONTRACTS) {
    const wasmPath = `contracts/target/wasm32v1-none/release/${contract.wasm}`;
    const absWasmPath = path.join(process.cwd(), wasmPath);
    if (!fs.existsSync(absWasmPath)) {
      console.error(`Error: WASM not found at ${wasmPath}. Run pnpm build:contracts.`);
      process.exit(1);
    }

    console.log(`Deploying ${contract.label}...`);
    try {
      const result = execSync(
        `stellar contract deploy --wasm "${wasmPath}" --source "${secret}" ${net}`,
        { encoding: "utf-8" },
      ).trim();
      contractIds[contract.label] = result;
      console.log(`  -> ${result}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to deploy ${contract.label}:`, message);
      process.exit(1);
    }
  }

  if (!skipInit) {
    const admin = requireEnv(env, "ADMIN_ADDRESS");

    console.log("Initializing escrow_contract...");
    invoke(secret, net, contractIds.escrow_contract, "initialize", [
      "--admin",
      admin,
      "--dispute_window_secs",
      env.INIT_DISPUTE_WINDOW_SECS || "604800", // 7 days default
    ]);

    console.log("Initializing identity_registry...");
    invoke(secret, net, contractIds.identity_registry, "initialize", [
      "--admin",
      admin,
    ]);
  }

  const output = {
    deployedAt: new Date().toISOString(),
    network: env.NETWORK_NAME || env.STELLAR_NETWORK || "",
    contracts: contractIds,
  };

  fs.writeFileSync(contractsJsonPath, JSON.stringify(output, null, 2) + "\n");
  console.log("\nDeployment complete. contracts.json written.\n");

  const explorer = env.EXPLORER_BASE_URL;
  for (const [name, id] of Object.entries(contractIds)) {
    console.log(`  ${name}: ${id}`);
    if (explorer) {
      console.log(`  ${explorer.replace(/\/$/, "")}/contract/${id}`);
    }
  }
}

main();