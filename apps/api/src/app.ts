import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { generalLimiter } from "./middleware/rate-limiter.js";
import { errorHandler } from "./middleware/error-handler.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(requestIdMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

registerRoutes(app);

app.use(errorHandler);

export default app;
