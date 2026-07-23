import type { RequestHandler } from "express";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.js";
import type { UserRole } from "../lib/roles.js";
import { clientIp, deviceFingerprint } from "../lib/request-meta.js";
import { config } from "../config.js";
import * as authService from "../services/auth.service.js";
import * as userRepo from "../repositories/user.repository.js";
import * as authEventRepo from "../repositories/auth-event.repository.js";
import { decryptMfaSecret, verifyTotp } from "../lib/mfa.js";
import { checkRoleCheckBurst } from "../services/anomaly.service.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const sessionId =
      req.cookies?.session ??
      (() => {
        const header = req.headers.authorization;
        if (header?.startsWith("Bearer ")) return header.slice(7);
        return undefined;
      })();

    if (!sessionId) {
      throw new UnauthorizedError("Missing session");
    }

    const wallet = await authService.validateSession(sessionId);
    res.locals.wallet = wallet;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    const sessionId =
      req.cookies?.session ??
      (() => {
        const header = req.headers.authorization;
        if (header?.startsWith("Bearer ")) return header.slice(7);
        return undefined;
      })();

    if (sessionId) {
      const wallet = await authService.validateSession(sessionId);
      res.locals.wallet = wallet;
    }

    next();
  } catch {
    next();
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return async (req, res, next) => {
    try {
      if (!res.locals.userId) {
        throw new UnauthorizedError("Missing session");
      }
      const role = res.locals.role as UserRole | null;
      if (!role || !roles.includes(role)) {
        const ip = clientIp(req);
        await authEventRepo.record({
          userId: res.locals.userId as string,
          eventType: "role_check_failed",
          success: false,
          ip,
          fingerprint: deviceFingerprint(req),
          detail: `required=${roles.join("|")} got=${role ?? "none"}`,
        });
        await checkRoleCheckBurst(ip);
        throw new ForbiddenError("Insufficient permissions");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireActiveOnboarding(): RequestHandler {
  return (_req, res, next) => {
    try {
      if (res.locals.onboardingStatus !== "active") {
        throw new ForbiddenError(
          "Complete onboarding before accessing this resource",
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    if (!res.locals.userId) {
      throw new UnauthorizedError("Missing session");
    }
    const wallet = res.locals.wallet as string | null;
    if (!wallet || wallet !== config.adminAddress) {
      const ip = clientIp(req);
      await authEventRepo.record({
        userId: res.locals.userId as string,
        eventType: "role_check_failed",
        success: false,
        ip,
        fingerprint: deviceFingerprint(req),
        detail: "admin_wallet_required",
      });
      await checkRoleCheckBurst(ip);
      throw new ForbiddenError("Admin wallet required");
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Admin panel requires MFA (TOTP) on every privileged request.
 * Client sends `X-MFA-Token: 123456`.
 */
export const requireAdminMfa: RequestHandler = async (req, res, next) => {
  try {
    if (config.nodeEnv === "development") {
      return next();
    }

    const userId = res.locals.userId as string | undefined;
    if (!userId) throw new UnauthorizedError("Missing session");

    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");

    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new ForbiddenError(
        "Admin MFA must be enrolled before accessing admin endpoints",
      );
    }

    const token =
      (req.headers["x-mfa-token"] as string | undefined) ||
      (typeof req.body?.mfaToken === "string" ? req.body.mfaToken : undefined);

    if (!token) {
      throw new ForbiddenError("MFA token required");
    }

    const secret = decryptMfaSecret(user.mfaSecret);
    if (!verifyTotp(secret, token)) {
      await authEventRepo.record({
        userId,
        eventType: "mfa_failed",
        success: false,
        ip: clientIp(req),
        fingerprint: deviceFingerprint(req),
      });
      throw new ForbiddenError("Invalid MFA token");
    }

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * IDOR helper: ensure resource owner matches authenticated user.
 */
export function assertResourceOwner(
  resourceOwnerId: string | null | undefined,
  sessionUserId: string,
  matchWallet?: { resourceWallet?: string | null; sessionWallet?: string | null },
): void {
  if (resourceOwnerId && resourceOwnerId === sessionUserId) return;
  if (
    matchWallet?.resourceWallet &&
    matchWallet.sessionWallet &&
    matchWallet.resourceWallet === matchWallet.sessionWallet
  ) {
    return;
  }
  throw new ForbiddenError("Not authorized for this resource");
}
