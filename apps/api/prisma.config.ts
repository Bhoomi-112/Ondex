import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(import.meta.dirname, "../..", ".env") });
config({ path: resolve(import.meta.dirname, ".env"), override: true });

const url = env("DATABASE_URL");
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
