import type { Express } from "express";
import healthRouter from "./v1/health.js";
import { router as authRouter, authedRouter } from "./v1/auth.js";
import campaignsRouter from "./v1/campaigns.js";
import casesRouter from "./v1/cases.js";
import jurorsRouter from "./v1/jurors.js";
import identitiesRouter from "./v1/identities.js";
import notificationsRouter from "./v1/notifications.js";
import applicationsRouter from "./applications.js";
import { generalLimiter, authLimiter } from "../middleware/rate-limiter.js";

export function registerRoutes(app: Express): void {
  app.use("/", healthRouter);

  // Versioned routes (existing)
  app.use("/api/v1/auth", authLimiter, authRouter);
  app.use("/api/v1/auth", generalLimiter, authedRouter);
  app.use("/api/v1/campaigns", generalLimiter, campaignsRouter);
  app.use("/api/v1/cases", generalLimiter, casesRouter);
  app.use("/api/v1/jurors", generalLimiter, jurorsRouter);
  app.use("/api/v1/identities", generalLimiter, identitiesRouter);
  app.use("/api/v1/notifications", generalLimiter, notificationsRouter);

  // Non-versioned aliases (what the frontend actually calls)
  app.use("/api/v1/applications", generalLimiter, applicationsRouter);
  app.use("/api/applications", generalLimiter, applicationsRouter);
  app.use("/api/jury", generalLimiter, applicationsRouter);
  app.use("/api/v1/campaigns", generalLimiter, campaignsRouter);
  app.use("/api/campaigns", generalLimiter, campaignsRouter);
}
