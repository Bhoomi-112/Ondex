#!/usr/bin/env node

/**
 * Deploy script for Ondex Soroban contracts to testnet.
 *
 * Prerequisites:
 *   - stellar-cli installed (cargo install --locked stellar-cli)
 *   - wasm32-unknown-unknown target added (rustup target add wasm32-unknown-unknown)
 *   - A funded testnet account configured in stellar-cli
 *
 * Usage:
 *   node scripts/deploy.mjs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const WASM_DIR = path.join(ROOT, "contracts", "target", "wasm32-unknown-unknown", "release");
const ADDRESSES_PATH = path.join(ROOT, "packages", "sdk", "addresses.json");
const ENV_PATH = path.join(ROOT, "apps", "web", ".env.local");

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();
}

async function main() {
  console.log("=== Ondex Contract Deployment ===\n");

  // 1. Build contracts
  console.log("Building contracts...");
  run("cargo build --target wasm32-unknown-unknown --release");
  console.log("Build complete.\n");

  // 2. Deploy platform contract
  console.log("Deploying platform contract...");
  const platformWasm = path.join(WASM_DIR, "ondex_platform.wasm");
  const platformAddr = run(
    `stellar contract deploy --wasm ${platformWasm} --network testnet`
  );
  console.log(`Platform contract: ${platformAddr}\n`);

  // 3. Deploy escrow contract
  console.log("Deploying escrow contract...");
  const escrowWasm = path.join(WASM_DIR, "ondex_escrow.wasm");
  const escrowAddr = run(
    `stellar contract deploy --wasm ${escrowWasm} --network testnet`
  );
  console.log(`Escrow contract: ${escrowAddr}\n`);

  // 4. Save addresses
  const addresses = {
    platform: platformAddr,
    escrow: escrowAddr,
    network: "testnet",
  };
  fs.writeFileSync(ADDRESSES_PATH, JSON.stringify(addresses, null, 2));
  console.log(`Addresses saved to ${ADDRESSES_PATH}`);

  // 5. Update .env.local
  const envContent = [
    `NEXT_PUBLIC_PLATFORM_CONTRACT_ID=${platformAddr}`,
    `NEXT_PUBLIC_ESCROW_CONTRACT_ID=${escrowAddr}`,
    `NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org`,
    `NEXT_PUBLIC_STELLAR_NETWORK=testnet`,
    "",
  ].join("\n");
  fs.writeFileSync(ENV_PATH, envContent);
  console.log(`Environment updated at ${ENV_PATH}`);

  console.log("\n=== Deployment Complete ===");
  console.log(`Platform: ${platformAddr}`);
  console.log(`Escrow:   ${escrowAddr}`);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
