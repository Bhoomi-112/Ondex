import type { Response } from "express";
import { config } from "../config.js";
import { ACCESS_TOKEN_TTL_SECONDS } from "./jwt.js";

export const ACCESS_COOKIE = "ondex_access";
export const REFRESH_COOKIE = "ondex_refresh";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** HTTPS-only in production, httpOnly, SameSite=strict for CSRF defense-in-depth. */
const baseCookie = {
  httpOnly: true as const,
  secure: config.nodeEnv === "production",
  sameSite: "strict" as const,
  path: "/",
};

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
): void {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...baseCookie,
    maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
  });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseCookie,
    maxAge: REFRESH_TOKEN_TTL_MS,
    // Refresh only sent to auth endpoints when possible
    path: "/api/v1/auth",
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { path: "/" });
  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
  res.clearCookie("session", { path: "/" });
}
