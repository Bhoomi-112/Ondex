import pino from "pino";
import { config } from "../config.js";

const transport =
  config.nodeEnv === "development"
    ? pino.transport({ target: "pino-pretty" })
    : undefined;

const baseLogger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },
  transport,
);

export function createLogger(name: string): pino.Logger {
  return baseLogger.child({ name });
}
