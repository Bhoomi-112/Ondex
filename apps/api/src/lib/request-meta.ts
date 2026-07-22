import type { Request } from "express";
import { createHash } from "node:crypto";

export function clientIp(req: Request): string {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0]!.trim();
  }
  if (Array.isArray(xf) && xf[0]) return xf[0].split(",")[0]!.trim();
  return req.socket.remoteAddress || "unknown";
}

export function deviceFingerprint(req: Request): string {
  const ua = req.headers["user-agent"] || "";
  const al = req.headers["accept-language"] || "";
  const raw = `${ua}|${al}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function geoHint(req: Request): string | null {
  const h =
    req.headers["cf-ipcountry"] ||
    req.headers["x-vercel-ip-country"] ||
    req.headers["x-geo-country"];
  if (typeof h === "string" && h.length > 0 && h !== "XX") return h;
  return null;
}
