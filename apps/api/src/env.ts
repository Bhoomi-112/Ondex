import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(apiDir, "..");
const monorepoRoot = path.resolve(apiRoot, "../..");

// Monorepo root first, then apps/api overrides
loadDotenv({ path: path.join(monorepoRoot, ".env") });
loadDotenv({ path: path.join(apiRoot, ".env"), override: true });
