import { Router } from "express";
import { z } from "zod";
import { config } from "../../config.js";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { ValidationError } from "../../lib/errors.js";
import * as authService from "../../services/auth.service.js";

const router = Router();

const challengeSchema = z.object({
  wallet: z
    .string()
    .regex(/^G[A-Za-z0-9]{55}$/, "Must be a valid Stellar address (G + 55 alphanumeric chars)"),
});

router.post(
  "/challenge",
  validate(challengeSchema, "body"),
  async (req, res) => {
    const { wallet } = req.body;
    const result = await authService.createChallenge(wallet);

    res.json({
      challenge: result.tx,
      network_passphrase: config.networkPassphrase,
    });
  },
);

const verifySchema = z.object({
  wallet: z
    .string()
    .regex(/^G[A-Za-z0-9]{55}$/, "Must be a valid Stellar address"),
  challenge: z.string().min(1, "Challenge is required"),
  signedTx: z.string().min(1, "Signed transaction is required"),
});

router.post(
  "/verify",
  validate(verifySchema, "body"),
  async (req, res) => {
    const { wallet, challenge, signedTx } = req.body;

    const verification = await authService.verifyChallenge(challenge, signedTx);

    if (!verification.isValid) {
      throw new ValidationError("Invalid SEP-10 challenge signature");
    }

    const { sessionId, expiresAt } = await authService.createSession(wallet);

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ wallet, sessionId, expiresAt: expiresAt.toISOString() });
  },
);

router.post("/logout", requireAuth, async (req, res) => {
  const sessionId = req.cookies?.session;
  if (sessionId) {
    await authService.destroySession(sessionId);
  }

  res.clearCookie("session", { path: "/" });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (_req, res) => {
  res.json({ wallet: res.locals.wallet });
});

export default router;
