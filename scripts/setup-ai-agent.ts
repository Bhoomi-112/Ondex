import { Keypair } from "@stellar/stellar-sdk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

function requireEnv(env: Record<string, string>, key: string): string {
  const v = env[key];
  if (!v) { console.error(`Error: ${key} is required.`); process.exit(1); }
  return v;
}

function loadJuryId(env: Record<string, string>): string {
  if (env.JURY_REGISTRY_CONTRACT_ID) return env.JURY_REGISTRY_CONTRACT_ID;
  const jsonPath = env.CONTRACTS_JSON_PATH || path.join(process.cwd(), "contracts.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("Error: contracts.json not found and JURY_REGISTRY_CONTRACT_ID unset.");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const id = raw.contracts?.jury_registry;
  if (!id) { console.error("Error: jury_registry missing from contracts.json"); process.exit(1); }
  return id;
}

function networkArgs(env: Record<string, string>): string {
  if (env.STELLAR_NETWORK) return `--network ${env.STELLAR_NETWORK}`;
  if (env.SOROBAN_RPC_URL && env.SOROBAN_NETWORK_PASSPHRASE) {
    return `--rpc-url "${env.SOROBAN_RPC_URL}" --network-passphrase "${env.SOROBAN_NETWORK_PASSPHRASE}"`;
  }
  console.error("Set STELLAR_NETWORK or SOROBAN_RPC_URL + SOROBAN_NETWORK_PASSPHRASE.");
  process.exit(1);
}

function main(): void {
  const action = process.argv[2] || "generate";

  if (action === "generate") {
    console.log("=== AI Agent Keypair Generation ===\n");
    const kp = Keypair.random();
    console.log(`Public Key:  ${kp.publicKey()}`);
    console.log(`Secret Key:  ${kp.secret()}`);
    console.log("\nAdd these to your .env file:");
    console.log(`AI_AGENT_PUBLIC_KEY=${kp.publicKey()}`);
    console.log(`AI_AGENT_SECRET_KEY=${kp.secret()}`);
    console.log("\nSave the secret key securely. It cannot be recovered.");
    return;
  }

  if (action === "register") {
    const env = loadEnv();
    const secret = requireEnv(env, "DEPLOYER_SECRET");
    const aiAgentSecret = process.argv[3] || env.AI_AGENT_SECRET_KEY;
    const aiAgentPublic = process.argv[4] || env.AI_AGENT_PUBLIC_KEY;

    if (!aiAgentSecret || !aiAgentPublic) {
      console.error("Usage: tsx scripts/setup-ai-agent.ts register <ai_secret> <ai_public>");
      console.error("  Or set AI_AGENT_SECRET_KEY and AI_AGENT_PUBLIC_KEY in .env");
      process.exit(1);
    }

    const kp = Keypair.fromSecret(aiAgentSecret);
    if (kp.publicKey() !== aiAgentPublic) {
      console.error("Error: Secret key does not match public key.");
      process.exit(1);
    }

    const xlmStake = requireEnv(env, "INIT_MIN_XLM_STAKE");
    const platformStake = requireEnv(env, "INIT_MIN_PLATFORM_STAKE");
    const juryId = loadJuryId(env);
    const net = networkArgs(env);

    console.log(`\nFunding AI agent wallet ${aiAgentPublic} via Friendbot...`);
    try {
      const friendbotUrl = env.FRIENDBOT_URL || `https://friendbot.stellar.org`;
      execSync(`curl -s "${friendbotUrl}?addr=${aiAgentPublic}"`, { encoding: "utf-8" });
      console.log("Friendbot funding succeeded.");
    } catch {
      console.warn("Friendbot funding failed (may already be funded). Continuing...");
    }

    console.log(`\nRegistering AI agent as juror on ${juryId}...`);
    const cmd = [
      "stellar", "contract", "invoke",
      "--id", juryId,
      "--source", secret,
      net,
      "--",
      "sponsored_register",
      "--sponsor", secret,
      "--juror", aiAgentPublic,
      "--xlm_stake", xlmStake,
      "--platform_stake", platformStake,
    ].join(" ");

    try {
      const out = execSync(cmd, { encoding: "utf-8" });
      console.log("Registration response:", out);
      console.log(`\n✓ AI agent ${aiAgentPublic} registered as juror on jury_registry.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Registration failed:", message);
      console.log("\nTip: The juror may already be registered. Check with:");
      console.log(`stellar contract invoke --id ${juryId} ${net} -- is_reg --juror ${aiAgentPublic}`);
      process.exit(1);
    }
    return;
  }

  console.error("Usage: tsx scripts/setup-ai-agent.ts [generate|register]");
  process.exit(1);
}

main();