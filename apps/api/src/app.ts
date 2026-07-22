import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { generalLimiter } from "./middleware/rate-limiter.js";
import { securityHeaders } from "./middleware/security-headers.js";
import { csrfProtection } from "./middleware/csrf.js";
import { errorHandler } from "./middleware/error-handler.js";
import { registerRoutes } from "./routes/index.js";
import { config } from "./config.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(requestIdMiddleware);
app.use(securityHeaders);

const origins = config.corsOrigins
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      origins.includes("*") || origins.length === 0
        ? config.nodeEnv === "production"
          ? false
          : true
        : origins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(generalLimiter);
app.use(csrfProtection);

registerRoutes(app);

app.use(errorHandler);

export default app;
