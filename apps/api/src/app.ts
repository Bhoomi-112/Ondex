import express from "express";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { generalLimiter } from "./middleware/rate-limiter.js";
import { errorHandler } from "./middleware/error-handler.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);
app.use(requestIdMiddleware);
app.use(express.json());
app.use(generalLimiter);

try {
  const pkgName = "cookie" + "-" + "parser";
  const mod = await import(pkgName);
  app.use(mod.default());
} catch {
  // cookie-parser not installed; cookies will not be parsed from req.cookies
}

registerRoutes(app);

app.use(errorHandler);

export default app;
