import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

config({ path: resolve(import.meta.dirname, "../..", ".env") });
config({ path: resolve(import.meta.dirname, ".env"), override: true });

// During build, DATABASE_URL may not be set (Render injects it at runtime).
// Fall back to a local SQLite URL so prisma generate can produce the client.
const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const provider = url.startsWith("postgresql://") || url.startsWith("postgres://")
  ? "postgresql"
  : "sqlite";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
    provider,
  },
});
