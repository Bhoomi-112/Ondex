import type { Express } from "express";
import { config } from "../config.js";
import healthRouter from "./v1/health.js";
import authRouter from "./v1/auth.js";
import campaignsRouter from "./v1/campaigns.js";
import casesRouter from "./v1/cases.js";
import jurorsRouter from "./v1/jurors.js";
import identitiesRouter from "./v1/identities.js";
import notificationsRouter from "./v1/notifications.js";
import { generalLimiter, authLimiter } from "../middleware/rate-limiter.js";

export function registerRoutes(app: Express): void {
  app.use("/", healthRouter);

  if (config.nodeEnv === "production") {
    app.use("/api/v1/auth", authLimiter, authRouter);
  } else {
    app.use("/api/v1/auth", authRouter);
  }
  app.use("/api/v1/campaigns", generalLimiter, campaignsRouter);
  app.use("/api/v1/cases", generalLimiter, casesRouter);
  app.use("/api/v1/jurors", generalLimiter, jurorsRouter);
  app.use("/api/v1/identities", generalLimiter, identitiesRouter);
  app.use("/api/v1/notifications", generalLimiter, notificationsRouter);
}
