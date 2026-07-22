import type { RequestHandler } from "express";
import { config } from "../config.js";

/**
 * Strict security headers: CSP (no inline scripts), HSTS, HTTPS-only posture.
 */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  // API is JSON-only; keep CSP strict. Web CSP lives in next.config.mjs
  // (must allow Next hydration scripts — do not mirror script-src 'self' alone on the web app).
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'none'",
    ].join("; "),
  );

  if (config.nodeEnv === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  next();
};
