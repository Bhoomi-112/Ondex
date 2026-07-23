import { randomUUID } from "node:crypto";
import {
  Keypair,
  TransactionBuilder,
  Operation,
  Account,
} from "@stellar/stellar-sdk";
import { config } from "../config.js";
import { createLogger } from "../lib/logger.js";
import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "../lib/errors.js";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  hashToken,
  signAccessToken,
  type AccessTokenClaims,
} from "../lib/jwt.js";
import { REFRESH_TOKEN_TTL_MS } from "../lib/cookies.js";
import {
  dashboardPathForRole,
  type UserRole,
} from "../lib/roles.js";
import { sanitizeText, sanitizeOptional } from "../lib/sanitize.js";
import * as userRepo from "../repositories/user.repository.js";
import type { UserRecord } from "../repositories/user.repository.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import * as challengeRepo from "../repositories/auth-challenge.repository.js";
import * as authEventRepo from "../repositories/auth-event.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import { alertRoleEscalation } from "../lib/alerts.js";
import {
  checkImpossibleTravel,
  checkRefreshReuseAnomaly,
} from "./anomaly.service.js";

const log = createLogger("AuthService");

/** Wallet challenge single-use, 2-minute expiry. */
export const CHALLENGE_TTL_MS = 2 * 60 * 1000;

export { ACCESS_TOKEN_TTL_SECONDS };

export type AuthUser = {
  id: string;
  wallet: string | null;
  email: string | null;
  role: UserRole | null;
  onboardingStatus: UserRecord["onboardingStatus"];
  displayName: string | null;
  bio: string | null;
  dashboardPath: string | null;
  mfaEnabled?: boolean;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
};

function toAuthUser(user: UserRecord): AuthUser {
  const role = (user.role as UserRole | null) ?? null;
  return {
    id: user.id,
    wallet: user.wallet,
    email: user.email,
    role,
    onboardingStatus: user.onboardingStatus,
    displayName: user.displayName,
    bio: user.bio,
    dashboardPath: role ? dashboardPathForRole(role) : null,
    mfaEnabled: user.mfaEnabled,
  };
}

function claimsFromUser(user: UserRecord): AccessTokenClaims {
  return {
    sub: user.id,
    wallet: user.wallet,
    email: user.email,
    role: (user.role as UserRole | null) ?? null,
    onboardingStatus: user.onboardingStatus as AccessTokenClaims["onboardingStatus"],
  };
}

/** Generic auth failure — never reveal whether wallet/email exists. */
export const GENERIC_AUTH_FAILURE = "Authentication failed";

export async function createChallenge(walletAddress: string) {
  log.info({ walletAddress }, "Creating wallet auth challenge");

  try {
    Keypair.fromPublicKey(walletAddress);
  } catch {
    throw new ValidationError("Invalid Stellar wallet address");
  }

  await challengeRepo.deleteExpired();

  const nonce = randomUUID().replace(/-/g, "").slice(0, 32);
  const serverKeypair = Keypair.random();

  const tx = new TransactionBuilder(
    new Account(serverKeypair.publicKey(), "0"),
    {
      fee: "0",
      networkPassphrase: config.networkPassphrase,
    },
  )
    .addOperation(
      Operation.manageData({
        name: `auth.client_domain`,
        value: Buffer.from(config.nodeEnv),
        source: serverKeypair.publicKey(),
      }),
    )
    .addOperation(
      Operation.manageData({
        name: `auth_nonce`,
        value: Buffer.from(nonce),
        source: serverKeypair.publicKey(),
      }),
    )
    .addOperation(
      Operation.manageData({
        name: `auth_account`,
        value: Buffer.from(walletAddress),
        source: serverKeypair.publicKey(),
      }),
    )
    .setTimeout(120)
    .build();

  const challengeB64 = tx.toXDR();
  const challengeHash = hashToken(challengeB64);
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);

  await challengeRepo.create({
    id: randomUUID(),
    wallet: walletAddress,
    nonce,
    challengeHash,
    expiresAt,
  });

  return {
    tx: challengeB64,
    network_passphrase: config.networkPassphrase,
    identity_note: "Ondex Authentication",
    expiresAt,
  };
}

export async function verifyChallenge(
  challengeTxXdr: string,
  signedTxXdr: string,
  expectedWallet: string,
): Promise<{ wallet: string; isValid: boolean }> {
  log.info({ expectedWallet }, "Verifying wallet challenge");

  const challengeHash = hashToken(challengeTxXdr);
  const stored = await challengeRepo.findByHash(challengeHash);

  // Always delete if found — single-use even on failure after presentation
  if (stored) {
    await challengeRepo.deleteById(stored.id);
  }

  if (!stored) {
    return { wallet: "", isValid: false };
  }

  if (stored.wallet !== expectedWallet) {
    return { wallet: "", isValid: false };
  }

  if (new Date() > stored.expiresAt) {
    return { wallet: "", isValid: false };
  }

  try {
    const signedTx = TransactionBuilder.fromXDR(
      signedTxXdr,
      config.networkPassphrase,
    );

    const tx = "source" in signedTx ? signedTx : signedTx;
    const source = (tx as { source: string }).source;
    const signers = (tx as { signatures?: unknown[] }).signatures ?? [];

    if (signers.length === 0) {
      return { wallet: "", isValid: false };
    }

    if (source !== expectedWallet) {
      const ops = (
        tx as { operations?: Array<{ name?: string; value?: Buffer }> }
      ).operations;
      const accountOp = ops?.find((o) => o.name === "auth_account");
      const claimed =
        accountOp?.value != null
          ? Buffer.from(accountOp.value).toString("utf8")
          : "";
      if (claimed !== expectedWallet) {
        return { wallet: "", isValid: false };
      }
    }

    // Confirm nonce from challenge matches stored
    const challengeTx = TransactionBuilder.fromXDR(
      challengeTxXdr,
      config.networkPassphrase,
    );
    const chOps = (
      challengeTx as { operations?: Array<{ name?: string; value?: Buffer }> }
    ).operations;
    const nonceOp = chOps?.find((o) => o.name === "auth_nonce");
    const nonce =
      nonceOp?.value != null
        ? Buffer.from(nonceOp.value).toString("utf8")
        : "";
    if (nonce !== stored.nonce) {
      return { wallet: "", isValid: false };
    }

    return { wallet: expectedWallet, isValid: true };
  } catch (err) {
    log.error({ err }, "Failed to verify challenge");
    return { wallet: "", isValid: false };
  }
}

export async function issueTokens(
  user: UserRecord,
  familyId?: string,
): Promise<TokenPair> {
  const accessExpiresAt = new Date(
    Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000,
  );
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  const accessToken = await signAccessToken(
    claimsFromUser(user),
    ACCESS_TOKEN_TTL_SECONDS,
  );

  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const id = randomUUID();
  const family = familyId ?? randomUUID();

  await refreshRepo.create({
    id,
    userId: user.id,
    familyId: family,
    tokenHash,
    expiresAt: refreshExpiresAt,
  });

  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  };
}

export async function loginWithWallet(
  wallet: string,
  meta?: {
    ip?: string | null;
    fingerprint?: string | null;
    geoHint?: string | null;
  },
): Promise<{
  user: AuthUser;
  tokens: TokenPair;
  isNewUser: boolean;
}> {
  let user = await userRepo.findByWallet(wallet);
  let isNewUser = false;

  if (!user) {
    user = await userRepo.createFromWallet(wallet);
    isNewUser = true;
  }

  const tokens = await issueTokens(user);
  log.info({ userId: user.id, wallet, isNewUser }, "Wallet login");

  await authEventRepo.record({
    userId: user.id,
    eventType: "login_success",
    success: true,
    ip: meta?.ip,
    fingerprint: meta?.fingerprint,
    geoHint: meta?.geoHint,
    detail: isNewUser ? "new_user" : "returning",
  });

  if (meta?.geoHint) {
    await checkImpossibleTravel(user.id, meta.geoHint);
  }

  return { user: toAuthUser(user), tokens, isNewUser };
}

/**
 * Role self-selection is disabled. Jury is the only role and requires
 * admin approval via the application flow. This endpoint always rejects.
 */
export async function selectRole(
  _userId: string,
  _role: string,
  _meta?: { ip?: string | null },
): Promise<{ user: AuthUser; tokens: TokenPair }> {
  throw new ForbiddenError(
    "Role self-selection is disabled. Apply for jury access instead.",
  );
}

export async function completeProfile(
  userId: string,
  data: { displayName: string; bio?: string },
): Promise<{ user: AuthUser; tokens: TokenPair }> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new UnauthorizedError(GENERIC_AUTH_FAILURE);
  }
  if (!user.role) {
    throw new ValidationError("Select a role before completing profile");
  }

  const name = sanitizeText(data.displayName ?? "", 80);
  if (!name || name.length < 2) {
    throw new ValidationError("Display name must be at least 2 characters");
  }

  const bio = sanitizeOptional(data.bio, 500);

  let updated = await userRepo.updateProfile(userId, {
    displayName: name,
    bio,
  });
  updated = await userRepo.setOnboardingStatus(userId, "active");
  const tokens = await issueTokens(updated);
  return { user: toAuthUser(updated), tokens };
}

/**
 * Rotate refresh token on every use.
 * If an already-used (rotated/revoked) token is presented → theft:
 * revoke entire session family and force re-login.
 */
export async function refreshSession(
  rawRefreshToken: string,
  meta?: {
    ip?: string | null;
    fingerprint?: string | null;
  },
): Promise<{
  user: AuthUser;
  tokens: TokenPair;
}> {
  const tokenHash = hashToken(rawRefreshToken);
  const stored = await refreshRepo.findByHash(tokenHash);

  if (!stored) {
    throw new UnauthorizedError(GENERIC_AUTH_FAILURE);
  }

  if (stored.revokedAt) {
    // Reuse of rotated token → session theft
    await refreshRepo.revokeFamily(stored.familyId);
    await authEventRepo.record({
      userId: stored.userId,
      eventType: "refresh_reuse_detected",
      success: false,
      ip: meta?.ip,
      fingerprint: meta?.fingerprint,
      detail: `family=${stored.familyId}`,
    });
    await checkRefreshReuseAnomaly(stored.userId);
    log.warn(
      { userId: stored.userId, familyId: stored.familyId },
      "Refresh token reuse — family revoked",
    );
    throw new UnauthorizedError(GENERIC_AUTH_FAILURE);
  }

  if (new Date() > stored.expiresAt) {
    await refreshRepo.revoke(stored.id);
    throw new UnauthorizedError(GENERIC_AUTH_FAILURE);
  }

  const newRefresh = generateRefreshToken();
  const newHash = hashToken(newRefresh);
  const newId = randomUUID();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await refreshRepo.revoke(stored.id, newId);
  await refreshRepo.create({
    id: newId,
    userId: stored.userId,
    familyId: stored.familyId,
    tokenHash: newHash,
    expiresAt: refreshExpiresAt,
  });

  const user = stored.user;
  const accessExpiresAt = new Date(
    Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000,
  );
  const accessToken = await signAccessToken(
    claimsFromUser(user),
    ACCESS_TOKEN_TTL_SECONDS,
  );

  await authEventRepo.record({
    userId: user.id,
    eventType: "token_refresh",
    success: true,
    ip: meta?.ip,
    fingerprint: meta?.fingerprint,
  });

  log.info({ userId: user.id }, "Refresh token rotated");
  return {
    user: toAuthUser(user),
    tokens: {
      accessToken,
      refreshToken: newRefresh,
      accessExpiresAt,
      refreshExpiresAt,
    },
  };
}

export async function logout(
  rawRefreshToken: string | undefined,
  userId: string | undefined,
  meta?: { ip?: string | null; fingerprint?: string | null },
): Promise<void> {
  if (rawRefreshToken) {
    const stored = await refreshRepo.findByHash(hashToken(rawRefreshToken));
    if (stored && !stored.revokedAt) {
      await refreshRepo.revokeFamily(stored.familyId);
    }
  }
  if (userId) {
    await refreshRepo.revokeAllForUser(userId);
  }
  await authEventRepo.record({
    userId: userId ?? null,
    eventType: "logout",
    success: true,
    ip: meta?.ip,
    fingerprint: meta?.fingerprint,
  });
  log.info({ userId }, "Logout — tokens revoked");
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new UnauthorizedError(GENERIC_AUTH_FAILURE);
  }
  return toAuthUser(user);
}

export function assertAdminWallet(wallet: string | null | undefined): void {
  if (!wallet || wallet !== config.adminAddress) {
    throw new ForbiddenError("Admin wallet required");
  }
}

/** Admin role change with immutable audit + escalation alert. */
export async function adminChangeRole(
  actorId: string,
  actorWallet: string,
  targetUserId: string,
  newRole: UserRole,
  ip: string | null,
): Promise<UserRecord> {
  assertAdminWallet(actorWallet);

  const target = await userRepo.findById(targetUserId);
  if (!target) {
    throw new ValidationError("Target user not found");
  }

  const oldRole = target.role;
  const updated = await userRepo.adminSetRole(targetUserId, newRole);

  await auditRepo.append({
    action: "role_change",
    actorId,
    targetId: targetUserId,
    oldRole,
    newRole,
    ip,
    metadata: { actorWallet },
  });

  await authEventRepo.record({
    userId: actorId,
    eventType: "role_change",
    success: true,
    ip,
    detail: `${oldRole ?? "none"}→${newRole} target=${targetUserId}`,
  });

  // Escalation: any promotion toward jury/privileged roles
  const escalations = new Set(["jury"]);
  if (escalations.has(newRole) && oldRole !== newRole) {
    await alertRoleEscalation({
      actorId,
      targetId: targetUserId,
      oldRole,
      newRole,
      ip,
    });
  }

  // Force re-login after role change
  await refreshRepo.revokeAllForUser(targetUserId);

  return updated;
}

/** @deprecated Use JWT access validation via middleware */
export async function validateSession(_sessionId: string) {
  return { wallet: "", isValid: false };
}

/** @deprecated */
export async function createSession(wallet: string) {
  const { user, tokens } = await loginWithWallet(wallet);
  return {
    sessionId: tokens.accessToken,
    expiresAt: tokens.accessExpiresAt,
    user,
    tokens,
  };
}

/** @deprecated */
export async function destroySession(_sessionId: string) {
  return logout(undefined, undefined);
}
