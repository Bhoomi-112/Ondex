import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";
import { config } from "../config.js";

const logger = createLogger("error-handler");

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.error({ code: err.code, message: err.message, stack: err.stack });
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues });
    const details = Object.fromEntries(
      err.issues.map((issue) => [issue.path.join("."), issue.message]),
    );
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    });
    return;
  }

  logger.error({ err });
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        config.nodeEnv === "production"
          ? "Internal server error"
          : (err as Error).message ?? "Internal server error",
      ...(config.nodeEnv !== "production" && (err as Error).stack
        ? { stack: (err as Error).stack }
        : {}),
    },
  });
};
