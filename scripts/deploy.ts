import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const CONTRACTS = [
  { label: "escrow_contract", wasm: "escrow_contract.wasm" },
  { label: "jury_registry", wasm: "jury_registry.wasm" },
  { label: "identity_registry", wasm: "identity_registry.wasm" },
];

function loadEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found.");
    console.error("1. Copy .env.example to .env");
    console.error("2. Run 'pnpm fund' to generate a testnet account");
    console.error(
      "3. Paste the secret from deployer.key into .env as DEPLOYER_SECRET"
    );
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

function checkStellarCli(): void {
  try {
    execSync("stellar --version", { stdio: "ignore" });
  } catch {
    console.error("Error: Stellar CLI not found.");
    console.error(
      "Install: https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli"
    );
    process.exit(1);
  }
}

function main(): void {
  const force = process.argv.includes("--force");
  const env = loadEnv();
  const secret = env.DEPLOYER_SECRET;

  if (!secret) {
    console.error("Error: DEPLOYER_SECRET is not set in .env.");
    console.error(
      "Run 'pnpm fund' to generate a testnet account, then paste the secret into .env."
    );
    process.exit(1);
  }

  checkStellarCli();

  const contractsJsonPath = path.join(process.cwd(), "contracts.json");
  if (fs.existsSync(contractsJsonPath) && !force) {
    console.error("Error: contracts.json already exists.");
    const existing = JSON.parse(fs.readFileSync(contractsJsonPath, "utf-8"));
    console.error(JSON.stringify(existing, null, 2));
    console.error("\nUse --force to redeploy and overwrite.");
    process.exit(1);
  }

  const contractIds: Record<string, string> = {};

  for (const contract of CONTRACTS) {
    const wasmPath = `contracts/target/wasm32v1-none/release/${contract.wasm}`;
    const absWasmPath = path.join(process.cwd(), wasmPath);

    if (!fs.existsSync(absWasmPath)) {
      console.error(`Error: WASM not found at ${wasmPath}`);
      console.error("Run 'pnpm build:contracts' first.");
      process.exit(1);
    }

    console.log(`Deploying ${contract.label}...`);
    try {
      const result = execSync(
        `stellar contract deploy --wasm "${wasmPath}" --source "${secret}" --network testnet`,
        { encoding: "utf-8" }
      ).trim();
      contractIds[contract.label] = result;
      console.log(`  -> ${result}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to deploy ${contract.label}:`, message);
      process.exit(1);
    }
  }

  const output = {
    deployedAt: new Date().toISOString(),
    contracts: contractIds,
  };

  fs.writeFileSync(
    contractsJsonPath,
    JSON.stringify(output, null, 2) + "\n"
  );

  console.log("\nDeployment complete. contracts.json written.\n");
  for (const [name, id] of Object.entries(contractIds)) {
    console.log(`  ${name}: ${id}`);
    console.log(
      `  https://stellar.expert/explorer/testnet/contract/${id}\n`
    );
  }
}

main();
