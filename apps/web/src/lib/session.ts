import { jwtVerify, decodeProtectedHeader, importSPKI } from "jose";
import type { OnboardingStatus, UserRole } from "./auth-types";

export const ACCESS_COOKIE = "ondex_access";
export const REFRESH_COOKIE = "ondex_refresh";

export type SessionClaims = {
  sub: string;
  wallet: string | null;
  email: string | null;
  role: UserRole | null;
  onboardingStatus: OnboardingStatus;
};

const ALG_ALLOWLIST = ["RS256"] as const;

function publicKeyPems(): string[] {
  const keys: string[] = [];
  const current = process.env.JWT_PUBLIC_KEY;
  const previous = process.env.JWT_PUBLIC_KEY_PREVIOUS;
  if (current) keys.push(current.replace(/\\n/g, "\n"));
  if (previous) keys.push(previous.replace(/\\n/g, "\n"));
  return keys;
}

/**
 * Edge-safe JWT verification — RS256 only, algorithm allowlist.
 * Role is taken only from verified claims (API re-verifies on every request).
 */
export async function verifyAccessCookie(
  token: string | undefined,
): Promise<SessionClaims | null> {
  if (!token) return null;

  try {
    const header = decodeProtectedHeader(token);
    if (!header.alg || !ALG_ALLOWLIST.includes(header.alg as "RS256")) {
      return null;
    }
  } catch {
    return null;
  }

  const pems = publicKeyPems();
  if (pems.length === 0) {
    console.error(
      "JWT_PUBLIC_KEY missing in web env — middleware cannot verify RS256 JWTs. Add JWT_PUBLIC_KEY to apps/web/.env.local (same public key as API).",
    );
    return null;
  }

  for (const pem of pems) {
    try {
      const key = await importSPKI(pem, "RS256");
      const { payload } = await jwtVerify(token, key, {
        algorithms: [...ALG_ALLOWLIST],
      });
      if (!payload.sub || typeof payload.sub !== "string") return null;
      return {
        sub: payload.sub,
        wallet:
          typeof payload.wallet === "string" || payload.wallet === null
            ? (payload.wallet as string | null)
            : null,
        email:
          typeof payload.email === "string" || payload.email === null
            ? (payload.email as string | null)
            : null,
        role:
          typeof payload.role === "string" ? (payload.role as UserRole) : null,
        onboardingStatus:
          typeof payload.onboardingStatus === "string"
            ? (payload.onboardingStatus as OnboardingStatus)
            : "role_selected",
      };
    } catch {
      // try next key (rotation window)
    }
  }
  return null;
}
