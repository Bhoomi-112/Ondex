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
import * as investorAppService from "../../services/investor-application.service.js";
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

// ── Investor application (admin-approved) ────────────────────────────

authedRouter.get("/investor/status", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const application = await investorAppService.getApplicationStatus(userId);
  res.json({ application });
});

const investorApplySchema = z.object({
  fullName: z.string().min(2).max(200),
  entityType: z.string().max(100).optional(),
  accreditation: z.string().max(100).optional(),
  aum: z.string().max(200).optional(),
  sourceOfFunds: z.string().max(200).optional(),
  portfolioDesc: z.string().max(2000).optional(),
});

authedRouter.post(
  "/investor/apply",
  requireAuth,
  validate(investorApplySchema, "body"),
  async (req, res) => {
    const body = pickAllowed<{
      fullName: string;
      entityType?: string;
      accreditation?: string;
      aum?: string;
      sourceOfFunds?: string;
      portfolioDesc?: string;
    }>(req.body, [
      "fullName",
      "entityType",
      "accreditation",
      "aum",
      "sourceOfFunds",
      "portfolioDesc",
    ]);
    const application = await investorAppService.applyAsInvestor(
      res.locals.userId as string,
      {
        fullName: sanitizeText(body.fullName ?? "", 200),
        entityType: body.entityType
          ? sanitizeText(body.entityType, 100)
          : undefined,
        accreditation: body.accreditation
          ? sanitizeText(body.accreditation, 100)
          : undefined,
        aum: body.aum ? sanitizeText(body.aum, 200) : undefined,
        sourceOfFunds: body.sourceOfFunds
          ? sanitizeText(body.sourceOfFunds, 200)
          : undefined,
        portfolioDesc: body.portfolioDesc
          ? sanitizeText(body.portfolioDesc, 2000)
          : undefined,
      },
    );
    res.status(201).json({ application });
  },
);

// ── Admin: list/approve/reject investor applications ────────────────

authedRouter.get(
  "/admin/investor-applications",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  async (req, res) => {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const items = await investorAppService.listApplications(
      res.locals.wallet as string,
      status,
    );
    res.json({ items });
  },
);

authedRouter.post(
  "/admin/investor-applications/:id/approve",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  async (req, res) => {
    const id = String(req.params.id);
    const result = await investorAppService.approveApplication(
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

const investorRejectSchema = z.object({
  reason: z.string().max(500).optional(),
});

authedRouter.post(
  "/admin/investor-applications/:id/reject",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  validate(investorRejectSchema, "body"),
  async (req, res) => {
    const id = String(req.params.id);
    const body = pickAllowed<{ reason?: string }>(req.body, ["reason"]);
    const result = await investorAppService.rejectApplication(
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

const adminRoleSchema = z.object({
  role: z.enum(["founder", "investor"]),
});

authedRouter.post(
  "/admin/users/:userId/role",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  validate(adminRoleSchema, "body"),
  async (req, res) => {
    const targetUserId = String(req.params.userId);
    const { role } = req.body as { role: "founder" | "investor" };
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

authedRouter.get(
  "/admin/check",
  requireAuth,
  async (req, res) => {
    const wallet = res.locals.wallet as string | null;
    const isAdmin = !!wallet && wallet === config.adminAddress;
    res.json({ isAdmin });
  },
);

authedRouter.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }
    const users = await userRepo.searchUsers(q);
    res.json({
      users: users.map((u) => ({
        id: u.id,
        wallet: u.wallet,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        onboardingStatus: u.onboardingStatus,
        createdAt: u.createdAt,
      })),
    });
  },
);

const adminRoleAssignSchema = z.object({
  role: z.enum(["founder", "investor"]),
});

authedRouter.post(
  "/admin/users/:userId/role-assign",
  requireAuth,
  requireAdmin,
  validate(adminRoleAssignSchema, "body"),
  async (req, res) => {
    const targetUserId = String(req.params.userId);
    const { role } = req.body as { role: "founder" | "investor" };
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