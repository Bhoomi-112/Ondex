import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import "../env.js";
import { config } from "../config.js";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");

type PrismaAdapter = {
  provider: "sqlite" | "postgres";
  options: Record<string, unknown>;
};

function detectAdapter(databaseUrl: string): PrismaAdapter {
  if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
    return { provider: "postgres", options: { url: databaseUrl } };
  }

  if (databaseUrl.startsWith("file:")) {
    const raw = databaseUrl.slice("file:".length);
    const url = path.isAbsolute(raw) ? raw : path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../..",
      raw,
    );
    return { provider: "sqlite", options: { url } };
  }

  throw new Error(
    `Unsupported DATABASE_URL protocol. Expected postgresql:// or file:, got: ${databaseUrl.slice(0, 32)}`,
  );
}

type PrismaInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaInstance | undefined;
};

function createPrisma(): PrismaInstance {
  const adapterInfo = detectAdapter(config.databaseUrl);

  if (adapterInfo.provider === "postgres") {
    const { PrismaPg } = require("@prisma/adapter-pg") as {
      PrismaPg: new (options: { connectionString: string }) => unknown;
    };
    const adapter = new PrismaPg({ connectionString: adapterInfo.options.url as string });
    return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as {
    PrismaBetterSqlite3: new (config: { url: string }) => unknown;
  };
  const adapter = new PrismaBetterSqlite3({ url: adapterInfo.options.url as string });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (config.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
