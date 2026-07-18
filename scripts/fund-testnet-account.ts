import { Keypair } from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";

async function main(): Promise<void> {
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secret = keypair.secret();

  console.log(`Funding account: ${publicKey}`);

  const response = await fetch(
    `https://friendbot.stellar.org?addr=${publicKey}`
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Friendbot funding failed (${response.status}): ${body}`
    );
  }

  const keyPath = path.join(process.cwd(), "deployer.key");
  fs.writeFileSync(keyPath, secret, "utf-8");

  console.log("\nAccount funded successfully on Testnet.");
  console.log(`Public key: ${publicKey}`);
  console.log("\nSecret written to deployer.key (gitignored).");
  console.log("\nNext steps:");
  console.log(
    "  1. Copy the secret from deployer.key into .env as DEPLOYER_SECRET"
  );
  console.log("  2. Run pnpm deploy");
}

main().catch((err) => {
  console.error("Funding failed:", err);
  process.exit(1);
});
