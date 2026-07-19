import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { createLogger } from "../lib/logger.js";

const baseLogger = createLogger("http");

export const requestIdMiddleware: RequestHandler = (req, res, _next) => {
  const requestId =
    (req.headers["x-request-id"] as string | undefined) ?? randomUUID();

  res.setHeader("X-Request-ID", requestId);
  res.locals.requestId = requestId;
  res.locals.logger = baseLogger.child({ requestId });
  _next();
};
