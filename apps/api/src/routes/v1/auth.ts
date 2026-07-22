import { Router } from "express";
import { z } from "zod";
import { config } from "../../config.js";
import {
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  optionalAuth,
} from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
  ValidationError,
  UnauthorizedError,
} from "../../lib/errors.js";
import {
  setAuthCookies,
  clearAuthCookies,
  REFRESH_COOKIE,
} from "../../lib/cookies.js";
import {
  generateCsrfToken,
  setCsrfCookie,
  CSRF_COOKIE,
} from "../../middleware/csrf.js";
import {
  walletAuthFailureGuard,
  recordAuthFailure,
  clearAuthFailures,
} from "../../middleware/rate-limiter.js";
import { clientIp, deviceFingerprint, geoHint } from "../../lib/request-meta.js";
import { pickAllowed, sanitizeText } from "../../lib/sanitize.js";
import {
  generateTotpSecret,
  encryptMfaSecret,
  decryptMfaSecret,
  verifyTotp,
  totpUri,
} from "../../lib/mfa.js";
import * as authService from "../../services/auth.service.js";
import * as juryAppService from "../../services/jury-application.service.js";
import * as userRepo from "../../repositories/user.repository.js";
import * as authEventRepo from "../../repositories/auth-event.repository.js";

const router = Router();
const authedRouter = Router();

const GENERIC = authService.GENERIC_AUTH_FAILURE;

const challengeSchema = z.object({
  wallet: z
    .string()
    .regex(
      /^G[A-Za-z0-9]{55}$/,
      "Must be a valid Stellar address (G + 55 alphanumeric chars)",
    ),
});

router.post(
  "/challenge",
  walletAuthFailureGuard,
  validate(challengeSchema, "body"),
  async (req, res) => {
    const { wallet } = req.body;
    try {
      const result = await authService.createChallenge(wallet);
      // Issue CSRF cookie for subsequent state-changing calls
      if (!req.cookies?.[CSRF_COOKIE]) {
        setCsrfCookie(res, generateCsrfToken());
      }
      res.json({
        challenge: result.tx,
        network_passphrase: config.networkPassphrase,
        expiresAt: result.expiresAt.toISOString(),
      });
    } catch (err) {
      await recordAuthFailure(res.locals.authFailureKeys as string[] | undefined);
      throw err;
    }
  },
);

const verifySchema = z.object({
  wallet: z
    .string()
    .regex(/^G[A-Za-z0-9]{55}$/, "Must be a valid Stellar address"),
  challenge: z.string().min(1, "Challenge is required"),
  signedTx: z.string().min(1, "Signed transaction is required"),
  captchaToken: z.string().optional(),
});

router.post(
  "/verify",
  walletAuthFailureGuard,
  validate(verifySchema, "body"),
  async (req, res) => {
    const { wallet, challenge, signedTx } = req.body;
    const ip = clientIp(req);
    const fingerprint = deviceFingerprint(req);
    const geo = geoHint(req);

    try {
      const verification = await authService.verifyChallenge(
        challenge,
        signedTx,
        wallet,
      );

      if (!verification.isValid) {
        await recordAuthFailure(
          res.locals.authFailureKeys as string[] | undefined,
        );
        await authEventRepo.record({
          eventType: "login_fail",
          success: false,
          ip,
          fingerprint,
          geoHint: geo,
          detail: "invalid_challenge",
        });
        // Generic message — do not reveal wallet existence
        throw new UnauthorizedError(GENERIC);
      }

      const { user, tokens, isNewUser } = await authService.loginWithWallet(
        wallet,
        { ip, fingerprint, geoHint: geo },
      );

      await clearAuthFailures(
        res.locals.authFailureKeys as string[] | undefined,
      );
      setAuthCookies(res, tokens);
      setCsrfCookie(res, generateCsrfToken());

      res.json({
        user,
        isNewUser,
        expiresAt: tokens.accessExpiresAt.toISOString(),
      });
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) {
        await recordAuthFailure(
          res.locals.authFailureKeys as string[] | undefined,
        );
      }
      throw err;
    }
  },
);

router.post("/refresh", async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!raw) {
    throw new UnauthorizedError(GENERIC);
  }

  const { user, tokens } = await authService.refreshSession(raw, {
    ip: clientIp(req),
    fingerprint: deviceFingerprint(req),
  });
  setAuthCookies(res, tokens);
  res.json({
    user,
    expiresAt: tokens.accessExpiresAt.toISOString(),
  });
});

router.post("/logout", optionalAuth, async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  const userId = res.locals.userId as string | undefined;
  await authService.logout(raw, userId, {
    ip: clientIp(req),
    fingerprint: deviceFingerprint(req),
  });
  clearAuthCookies(res);
  res.json({ ok: true });
});

authedRouter.get("/me", requireAuth, async (_req, res) => {
  const user = await authService.getMe(res.locals.userId as string);
  res.json({ user });
});

router.get("/csrf", (_req, res) => {
  const token = generateCsrfToken();
  setCsrfCookie(res, token);
  res.json({ csrfToken: token });
});

const selectRoleSchema = z.object({
  role: z.enum(["founder", "investor"]),
});

authedRouter.post(
  "/select-role",
  requireAuth,
  validate(selectRoleSchema, "body"),
  async (req, res) => {
    // Mass-assignment: only whitelist `role` from allowed self-selectable set
    const body = pickAllowed<{ role: "founder" | "investor" }>(req.body, [
      "role",
    ]);
    if (!body.role || !["founder", "investor"].includes(body.role)) {
      throw new ValidationError("Invalid role");
    }
    const { user, tokens } = await authService.selectRole(
      res.locals.userId as string,
      body.role,
      { ip: clientIp(req) },
    );
    setAuthCookies(res, tokens);
    res.json({ user });
  },
);

const profileSchema = z.object({
  displayName: z.string().min(2).max(80),
  bio: z.string().max(500).optional(),
});

authedRouter.post(
  "/complete-profile",
  requireAuth,
  validate(profileSchema, "body"),
  async (req, res) => {
    const body = pickAllowed<{ displayName: string; bio?: string }>(req.body, [
      "displayName",
      "bio",
    ]);
    const { user, tokens } = await authService.completeProfile(
      res.locals.userId as string,
      {
        displayName: body.displayName!,
        bio: body.bio,
      },
    );
    setAuthCookies(res, tokens);
    res.json({ user });
  },
);

const juryApplySchema = z.object({
  statement: z.string().min(20).max(2000),
  experience: z.string().max(2000).optional(),
});

authedRouter.post(
  "/jury/apply",
  requireAuth,
  validate(juryApplySchema, "body"),
  async (req, res) => {
    const body = pickAllowed<{ statement: string; experience?: string }>(
      req.body,
      ["statement", "experience"],
    );
    const application = await juryAppService.applyAsJury(
      res.locals.userId as string,
      {
        statement: sanitizeText(body.statement ?? "", 2000),
        experience: body.experience
          ? sanitizeText(body.experience, 2000)
          : undefined,
      },
    );
    res.status(201).json({ application });
  },
);

// ── Admin MFA enrollment ────────────────────────────────────────────

authedRouter.post(
  "/admin/mfa/enroll",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const userId = res.locals.userId as string;
    const secret = generateTotpSecret();
    await userRepo.setMfaSecret(userId, encryptMfaSecret(secret));
    const wallet = (res.locals.wallet as string) || userId;
    res.json({
      secret,
      otpauthUrl: totpUri(secret, wallet),
      message: "Confirm with /admin/mfa/confirm using a TOTP code",
    });
  },
);

const mfaConfirmSchema = z.object({
  token: z.string().regex(/^\d{6}$/),
});

authedRouter.post(
  "/admin/mfa/confirm",
  requireAuth,
  requireAdmin,
  validate(mfaConfirmSchema, "body"),
  async (req, res) => {
    const userId = res.locals.userId as string;
    const user = await userRepo.findById(userId);
    if (!user?.mfaSecret) {
      throw new ValidationError("Enroll MFA first");
    }
    const secret = decryptMfaSecret(user.mfaSecret);
    if (!verifyTotp(secret, req.body.token)) {
      throw new ValidationError("Invalid MFA token");
    }
    await userRepo.enableMfa(userId);
    await authEventRepo.record({
      userId,
      eventType: "mfa_enrolled",
      success: true,
      ip: clientIp(req),
      fingerprint: deviceFingerprint(req),
    });
    res.json({ ok: true, mfaEnabled: true });
  },
);

// ── Admin jury approval (MFA + audit) ────────────────────────────────

authedRouter.get(
  "/admin/jury-applications",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  async (req, res) => {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const items = await juryAppService.listApplications(
      res.locals.wallet as string,
      status,
    );
    res.json({ items });
  },
);

authedRouter.post(
  "/admin/jury-applications/:id/approve",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  async (req, res) => {
    const id = String(req.params.id);
    const result = await juryAppService.approveApplication(
      res.locals.wallet as string,
      id,
      {
        actorId: res.locals.userId as string,
        ip: clientIp(req),
      },
    );
    res.json(result);
  },
);

const rejectSchema = z.object({
  reason: z.string().max(500).optional(),
});

authedRouter.post(
  "/admin/jury-applications/:id/reject",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  validate(rejectSchema, "body"),
  async (req, res) => {
    const id = String(req.params.id);
    const body = pickAllowed<{ reason?: string }>(req.body, ["reason"]);
    const result = await juryAppService.rejectApplication(
      res.locals.wallet as string,
      id,
      body.reason ? sanitizeText(body.reason, 500) : undefined,
      {
        actorId: res.locals.userId as string,
        ip: clientIp(req),
      },
    );
    res.json({ application: result });
  },
);

const adminRoleSchema = z.object({
  role: z.enum(["founder", "investor", "jury"]),
});

/** Dedicated admin-only role assignment endpoint (never from user-facing bodies). */
authedRouter.post(
  "/admin/users/:userId/role",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  validate(adminRoleSchema, "body"),
  async (req, res) => {
    const targetUserId = String(req.params.userId);
    const { role } = req.body as { role: "founder" | "investor" | "jury" };
    const updated = await authService.adminChangeRole(
      res.locals.userId as string,
      res.locals.wallet as string,
      targetUserId,
      role,
      clientIp(req),
    );
    res.json({
      user: {
        id: updated.id,
        role: updated.role,
        onboardingStatus: updated.onboardingStatus,
      },
    });
  },
);

export { router, authedRouter };
