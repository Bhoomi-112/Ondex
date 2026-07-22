import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";
import { config } from "../config.js";
import { clientIp } from "../lib/request-meta.js";
import * as failureRepo from "../repositories/auth-failure.repository.js";
import { verifyCaptcha } from "../lib/captcha.js";
import { TooManyRequestsError, ValidationError } from "../lib/errors.js";

export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: "TOO_MANY_REQUESTS", message: "Too many requests" },
  },
});

export const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  keyGenerator: (req) => {
    const ip = clientIp(req);
    const wallet =
      typeof req.body?.wallet === "string" ? req.body.wallet : "";
    return `${ip}:${wallet}`;
  },
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication attempts",
    },
  },
});

/**
 * Per-IP + per-account exponential backoff and CAPTCHA after repeated failures.
 */
export function authFailureGuard(
  accountKeyFromReq: (req: {
    body?: Record<string, unknown>;
  }) => string | undefined,
): RequestHandler {
  return async (req, res, next) => {
    try {
      const ip = clientIp(req);
      const account = accountKeyFromReq(req) || "anon";
      const keys = [`ip:${ip}`, `acct:${account}`];

      for (const key of keys) {
        const bucket = await failureRepo.getBucket(key);
        if (bucket?.lockedUntil && bucket.lockedUntil > new Date()) {
          throw new TooManyRequestsError(
            "Too many failed attempts — try again later",
          );
        }
        if (bucket?.captchaRequired) {
          const captchaToken =
            (req.body?.captchaToken as string | undefined) ||
            (req.headers["x-captcha-token"] as string | undefined);
          await verifyCaptcha(captchaToken, ip);
        }
      }

      res.locals.authFailureKeys = keys;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export async function recordAuthFailure(keys: string[] | undefined): Promise<void> {
  if (!keys) return;
  await Promise.all(keys.map((k) => failureRepo.upsertFail(k)));
}

export async function clearAuthFailures(keys: string[] | undefined): Promise<void> {
  if (!keys) return;
  await Promise.all(keys.map((k) => failureRepo.clearBucket(k)));
}

export const walletAuthFailureGuard = authFailureGuard((req) => {
  const w = req.body?.wallet;
  return typeof w === "string" ? w : undefined;
});
