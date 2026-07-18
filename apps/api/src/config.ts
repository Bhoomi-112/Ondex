import { randomUUID } from "node:crypto";

export const config = {
  port: parseInt(process.env.PORT ?? "3001", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
  sorobanRpcUrl:
    process.env.SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org",
  horizonUrl:
    process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org",
  networkPassphrase:
    process.env.SOROBAN_NETWORK_PASSPHRASE ??
    "Test SDF Network ; September 2015",
  sessionSecret: process.env.SESSION_SECRET ?? randomUUID(),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigins: process.env.CORS_ORIGINS ?? "*",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "900000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10),
  authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX ?? "10", 10),
} as const;

export function requiredConfig(): void {
  const required = ["DATABASE_URL"] as const;
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
