import { randomBytes, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { ForbiddenError } from "../lib/errors.js";
import { config } from "../config.js";

export const CSRF_COOKIE = "ondex_csrf";
export const CSRF_HEADER = "x-csrf-token";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function generateCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

export function setCsrfCookie(
  res: {
    cookie: (
      name: string,
      value: string,
      opts: Record<string, unknown>,
    ) => void;
  },
  token: string,
): void {
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false, // double-submit cookie pattern — readable by JS
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

/**
 * CSRF: SameSite cookies + double-submit token on all state-changing requests.
 * Header `X-CSRF-Token` must match `ondex_csrf` cookie.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  try {
    if (SAFE_METHODS.has(req.method.toUpperCase())) {
      // Ensure CSRF cookie exists for subsequent mutations
      if (!req.cookies?.[CSRF_COOKIE]) {
        const token = generateCsrfToken();
        setCsrfCookie(res, token);
      }
      return next();
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE] as string | undefined;
    const headerToken =
      (req.headers[CSRF_HEADER] as string | undefined) ||
      (req.headers["x-xsrf-token"] as string | undefined);

    if (!cookieToken || !headerToken) {
      throw new ForbiddenError("CSRF token missing");
    }

    const a = Buffer.from(cookieToken);
    const b = Buffer.from(headerToken);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new ForbiddenError("CSRF token invalid");
    }

    next();
  } catch (err) {
    next(err);
  }
};
