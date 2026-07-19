#!/usr/bin/env node

/**
 * Generate TypeScript bindings for deployed Ondex contracts.
 *
 * Prerequisites:
 *   - Contracts deployed (run deploy.mjs first)
 *   - @stellar/stellar-sdk installed
 *
 * Usage:
 *   node scripts/generate-bindings.mjs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SDK_DIR = path.join(ROOT, "packages", "sdk");
const ADDRESSES_PATH = path.join(SDK_DIR, "addresses.json");

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();
}

async function main() {
  console.log("=== Generating TypeScript Bindings ===\n");

  if (!fs.existsSync(ADDRESSES_PATH)) {
    console.error("No addresses.json found. Deploy contracts first (node scripts/deploy.mjs)");
    process.exit(1);
  }

  const addresses = JSON.parse(fs.readFileSync(ADDRESSES_PATH, "utf8"));

  if (!addresses.platform || !addresses.escrow) {
    console.error("Contract addresses not found in addresses.json");
    process.exit(1);
  }

  // Generate bindings for platform contract
  console.log("Generating platform bindings...");
  const platformDir = path.join(SDK_DIR, "platform");
  run(
    `npx @stellar/stellar-sdk generate --contract-id ${addresses.platform} --network testnet --output-dir ${platformDir} --contract-name platform --overwrite`
  );
  console.log(`Platform bindings saved to ${platformDir}\n`);

  // Generate bindings for escrow contract
  console.log("Generating escrow bindings...");
  const escrowDir = path.join(SDK_DIR, "escrow");
  run(
    `npx @stellar/stellar-sdk generate --contract-id ${addresses.escrow} --network testnet --output-dir ${escrowDir} --contract-name escrow --overwrite`
  );
  console.log(`Escrow bindings saved to ${escrowDir}\n`);

  console.log("=== Bindings Generated ===");
  console.log("Import them in your code with:");
  console.log(`  import * as Platform from "@ondex/sdk/platform";`);
  console.log(`  import * as Escrow from "@ondex/sdk/escrow";`);
}

main().catch((err) => {
  console.error("Binding generation failed:", err);
  process.exit(1);
});
