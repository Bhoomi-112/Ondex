import { Router } from "express";
import { config } from "../config.js";
import healthRouter from "./v1/health.js";
import { router as authRouter, authedRouter } from "./v1/auth.js";
import campaignsRouter from "./v1/campaigns.js";
import identitiesRouter from "./v1/identities.js";
import notificationsRouter from "./v1/notifications.js";
import { generalLimiter, authLimiter } from "../middleware/rate-limiter.js";

export function registerRoutes(app: Express): void {
  app.use("/", healthRouter);

  app.use("/api/v1/auth", authLimiter, authRouter);
  app.use("/api/v1/auth", generalLimiter, authedRouter);
  app.use("/api/v1/campaigns", generalLimiter, campaignsRouter);
  app.use("/api/v1/identities", generalLimiter, identitiesRouter);
  app.use("/api/v1/notifications", generalLimiter, notificationsRouter);

  app.use("/api/campaigns", generalLimiter, campaignsRouter);
}