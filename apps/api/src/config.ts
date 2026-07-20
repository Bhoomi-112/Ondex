import fs from "node:fs";
import path from "node:path";

export type AppConfig = {
  port: number;
  databaseUrl: string;
  sorobanRpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  explorerBaseUrl: string;
  networkName: string;
  /** @deprecated Prefer JWT_PRIVATE_KEY / JWT_PUBLIC_KEY (RS256). Kept for migration. */
  sessionSecret: string;
  nodeEnv: string;
  corsOrigins: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  authRateLimitMax: number;
  adminAddress: string;
  secretsBackend: string;
  contracts: {
    escrow?: string;
    juryRegistry?: string;
    identityRegistry?: string;
    platformToken?: string;
    xlmToken?: string;
  };
};

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. See .env.example.`,
    );
  }
  return value;
}

function optionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

function resolveContractsJsonPath(): string {
  if (process.env.CONTRACTS_JSON_PATH) {
    const fromEnv = process.env.CONTRACTS_JSON_PATH;
    if (path.isAbsolute(fromEnv)) return fromEnv;
    // Prefer monorepo root (apps/api/../..) then cwd
    const monorepo = path.resolve(process.cwd(), "../..", fromEnv);
    if (fs.existsSync(monorepo)) return monorepo;
    return path.resolve(process.cwd(), fromEnv);
  }
  const candidates = [
    path.join(process.cwd(), "contracts.json"),
    path.join(process.cwd(), "../..", "contracts.json"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function loadContractsFromJson(): AppConfig["contracts"] {
  const jsonPath = resolveContractsJsonPath();
  if (!fs.existsSync(jsonPath)) {
    return {};
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as {
    contracts?: Record<string, string>;
  };
  const c = raw.contracts ?? {};
  return {
    escrow: c.escrow_contract,
    juryRegistry: c.jury_registry,
    identityRegistry: c.identity_registry,
    platformToken: c.platform_token,
    xlmToken: c.xlm_token,
  };
}

export function loadConfig(): AppConfig {
  const fromJson = loadContractsFromJson();

  return {
    port: parseInt(requireEnv("PORT"), 10),
    databaseUrl: requireEnv("DATABASE_URL"),
    sorobanRpcUrl: requireEnv("SOROBAN_RPC_URL"),
    horizonUrl: requireEnv("HORIZON_URL"),
    networkPassphrase: requireEnv("SOROBAN_NETWORK_PASSPHRASE"),
    explorerBaseUrl: requireEnv("EXPLORER_BASE_URL"),
    networkName: requireEnv("NETWORK_NAME"),
    sessionSecret: process.env.SESSION_SECRET || "unused-with-rs256",
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigins: process.env.CORS_ORIGINS || "*",
    rateLimitWindowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || "900000",
      10,
    ),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "30", 10),
    adminAddress: requireEnv("ADMIN_ADDRESS"),
    secretsBackend: process.env.SECRETS_BACKEND || "env",
    contracts: {
      escrow:
        optionalEnv("ESCROW_CONTRACT_ID") || fromJson.escrow,
      juryRegistry:
        optionalEnv("JURY_REGISTRY_CONTRACT_ID") || fromJson.juryRegistry,
      identityRegistry:
        optionalEnv("IDENTITY_REGISTRY_CONTRACT_ID") ||
        fromJson.identityRegistry,
      platformToken:
        optionalEnv("PLATFORM_TOKEN_CONTRACT_ID") || fromJson.platformToken,
      xlmToken: optionalEnv("XLM_TOKEN_CONTRACT_ID") || fromJson.xlmToken,
    },
  };
}

/** Lazy singleton — call loadConfig at boot so missing env fails early. */
let cachedConfig: AppConfig | null = null;

export const config = new Proxy({} as AppConfig, {
  get(_target, prop: keyof AppConfig) {
    if (!cachedConfig) {
      cachedConfig = loadConfig();
    }
    return cachedConfig[prop];
  },
});

export function requiredConfig(): void {
  loadConfig();
}
