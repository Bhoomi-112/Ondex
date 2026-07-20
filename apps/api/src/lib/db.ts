import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import "../env.js";
import { config } from "../config.js";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as {
  PrismaBetterSqlite3: new (config: { url: string }) => unknown;
};

function resolveSqliteFile(databaseUrl: string): string {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error(
      `DATABASE_URL must be a SQLite file: URL (got ${databaseUrl.slice(0, 32)})`,
    );
  }
  const raw = databaseUrl.slice("file:".length);
  if (path.isAbsolute(raw)) return raw;
  const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  return path.resolve(apiRoot, raw);
}

type PrismaInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaInstance | undefined;
};

function createPrisma(): PrismaInstance {
  const filePath = resolveSqliteFile(config.databaseUrl);
  const adapter = new PrismaBetterSqlite3({ url: filePath });
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
