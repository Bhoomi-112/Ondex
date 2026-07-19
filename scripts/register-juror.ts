import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const PLATFORM_CONTRACT_ID =
  process.env.PLATFORM_CONTRACT_ID ||
  "CB3X25J5HTYZJT5YETSU7EJDL237L7DFBKPQNC3ZMKVNDR7RTZDD2BEV";

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
  const jurorAddress = process.argv[2];

  if (!jurorAddress) {
    console.error("Usage: npx tsx scripts/register-juror.ts <JUROR_PUBLIC_KEY>");
    console.error("");
    console.error("Registers a juror address on the Ondex platform contract.");
    console.error("Must be called by the contract admin.");
    console.error("");
    console.error("Example:");
    console.error(
      "  npx tsx scripts/register-juror.ts GBORJ3VU6YBQA...EXAMPLE"
    );
    process.exit(1);
  }

  checkStellarCli();

  const env = loadEnv();
  const secret = env.DEPLOYER_SECRET;

  if (!secret) {
    console.error("Error: DEPLOYER_SECRET is not set in .env.");
    console.error(
      "This script must be run by the contract admin (the deployer account)."
    );
    process.exit(1);
  }

  console.log(`Registering juror: ${jurorAddress}`);
  console.log(`Platform contract: ${PLATFORM_CONTRACT_ID}`);
  console.log("");

  try {
    const result = execSync(
      `stellar contract invoke \
        --id "${PLATFORM_CONTRACT_ID}" \
        --source "${secret}" \
        --network testnet \
        -- register_juror \
        --juror "${jurorAddress}"`,
      { encoding: "utf-8" }
    ).trim();

    console.log("Juror registered successfully on-chain.");
    if (result) {
      console.log(`Transaction: ${result}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Failed to register juror:");
    console.error(message);
    console.error("");
    console.error("Common causes:");
    console.error("  - The DEPLOYER_SECRET is not the contract admin");
    console.error("  - The juror address is invalid");
    console.error("  - The contract is not initialized");
    process.exit(1);
  }
}

main();
