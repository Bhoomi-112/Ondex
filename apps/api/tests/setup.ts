import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateKeyPairSync } from "node:crypto";
import { config as loadDotenv } from "dotenv";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const monorepoRoot = path.resolve(apiRoot, "../..");

loadDotenv({ path: path.join(monorepoRoot, ".env") });
loadDotenv({ path: path.join(apiRoot, ".env"), override: true });

process.env.PORT ||= "3001";
process.env.DATABASE_URL ||= "file:./prisma/dev.db";
process.env.SESSION_SECRET ||= "test-session-secret-at-least-32-chars!!";
process.env.SOROBAN_RPC_URL ||= "https://soroban-testnet.stellar.org";
process.env.HORIZON_URL ||= "https://horizon-testnet.stellar.org";
process.env.SOROBAN_NETWORK_PASSPHRASE ||=
  "Test SDF Network ; September 2015";
process.env.EXPLORER_BASE_URL ||=
  "https://stellar.expert/explorer/testnet";
process.env.NETWORK_NAME ||= "testnet";
process.env.ADMIN_ADDRESS ||=
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
process.env.NODE_ENV ||= "test";
process.env.MFA_ENCRYPTION_KEY ||= "test-mfa-encryption-key-32bytes!!";

if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  process.env.JWT_PRIVATE_KEY = privateKey;
  process.env.JWT_PUBLIC_KEY = publicKey;
}
