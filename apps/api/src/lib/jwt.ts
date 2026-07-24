import { createHash, createPublicKey, randomBytes } from "node:crypto";
import * as jose from "jose";
import { getSecret, requireSecret } from "./secrets.js";

const PKCS8_HEADER = "-----BEGIN PRIVATE KEY-----";
const PKCS1_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
import type { UserRole, OnboardingStatus } from "./roles.js";

/** Allowed JWT algorithms — never trust the token's own `alg` header alone. */
export const JWT_ALG_ALLOWLIST = ["RS256"] as const;
export type JwtAlg = (typeof JWT_ALG_ALLOWLIST)[number];

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export type AccessTokenClaims = {
  sub: string;
  wallet: string | null;
  email: string | null;
  role: UserRole | null;
  onboardingStatus: OnboardingStatus;
};

type KeyPair = {
  kid: string;
  privateKey: jose.CryptoKey | Uint8Array;
  publicKey: jose.CryptoKey | Uint8Array;
};

let currentKeys: KeyPair | null = null;
let previousKeys: KeyPair | null = null;

function kidFromPem(pem: string): string {
  return createHash("sha256").update(pem).digest("hex").slice(0, 16);
}

async function importPrivate(pem: string) {
  if (pem.startsWith(PKCS1_HEADER)) {
    throw new Error(
      "JWT_PRIVATE_KEY is PKCS#1 format (-----BEGIN RSA PRIVATE KEY-----). " +
        "Convert to PKCS#8 (-----BEGIN PRIVATE KEY-----) with: " +
        "openssl pkcs8 -topk8 -inform PEM -outform PEM -in rsa_key.pem -out pkcs8_key.pem -nocrypt",
    );
  }
  if (!pem.startsWith(PKCS8_HEADER)) {
    throw new Error(
      "JWT_PRIVATE_KEY does not appear to be a valid PEM private key. " +
        "Expected -----BEGIN PRIVATE KEY----- header. " +
        "If using a file path, ensure it starts with file: " +
        "or points to an existing file (e.g. JWT_PRIVATE_KEY=file:./path/to/key.pem).",
    );
  }
  return jose.importPKCS8(pem, "RS256");
}

async function importPublic(pem: string) {
  return jose.importSPKI(pem, "RS256");
}

async function loadKeys(): Promise<void> {
  if (currentKeys) return;

  const priv = requireSecret("JWT_PRIVATE_KEY");
  const pub = requireSecret("JWT_PUBLIC_KEY");
  currentKeys = {
    kid: kidFromPem(pub),
    privateKey: await importPrivate(priv),
    publicKey: await importPublic(pub),
  };

  const prevPriv = getSecret("JWT_PRIVATE_KEY_PREVIOUS");
  const prevPub = getSecret("JWT_PUBLIC_KEY_PREVIOUS");
  if (prevPriv && prevPub) {
    previousKeys = {
      kid: kidFromPem(prevPub),
      privateKey: await importPrivate(prevPriv),
      publicKey: await importPublic(prevPub),
    };
  }
}

/** Expose public keys for JWKS / web middleware verification. */
export async function getVerificationKeys(): Promise<
  Array<{ kid: string; publicKey: jose.CryptoKey | Uint8Array }>
> {
  await loadKeys();
  const keys = [{ kid: currentKeys!.kid, publicKey: currentKeys!.publicKey }];
  if (previousKeys) {
    keys.push({ kid: previousKeys.kid, publicKey: previousKeys.publicKey });
  }
  return keys;
}

export async function getCurrentPublicKeyPem(): Promise<string> {
  const pub = requireSecret("JWT_PUBLIC_KEY");
  return pub;
}

export async function signAccessToken(
  claims: AccessTokenClaims,
  expiresInSeconds: number = ACCESS_TOKEN_TTL_SECONDS,
): Promise<string> {
  await loadKeys();
  return new jose.SignJWT({
    wallet: claims.wallet,
    email: claims.email,
    role: claims.role,
    onboardingStatus: claims.onboardingStatus,
  })
    .setProtectedHeader({
      alg: "RS256",
      typ: "JWT",
      kid: currentKeys!.kid,
    })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(currentKeys!.privateKey);
}

/**
 * Verify access token with algorithm allowlist (RS256 only).
 * Tries current key then previous (rotation window).
 */
export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenClaims | null> {
  try {
    // Reject non-allowlisted alg before crypto (defense-in-depth vs alg confusion)
    const header = jose.decodeProtectedHeader(token);
    if (!header.alg || !JWT_ALG_ALLOWLIST.includes(header.alg as JwtAlg)) {
      return null;
    }

    await loadKeys();
    const candidates = [currentKeys!, previousKeys].filter(
      Boolean,
    ) as KeyPair[];

    for (const key of candidates) {
      try {
        const { payload } = await jose.jwtVerify(token, key.publicKey, {
          algorithms: [...JWT_ALG_ALLOWLIST],
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
            typeof payload.role === "string"
              ? (payload.role as UserRole)
              : null,
          onboardingStatus:
            typeof payload.onboardingStatus === "string"
              ? (payload.onboardingStatus as OnboardingStatus)
              : "role_selected",
        };
      } catch {
        // try next key
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Validate both PEM keys are parseable (boot check). */
export function assertJwtKeysConfigured(): void {
  const priv = requireSecret("JWT_PRIVATE_KEY");
  const pub = requireSecret("JWT_PUBLIC_KEY");
  if (!priv.startsWith(PKCS8_HEADER)) {
    if (priv.startsWith(PKCS1_HEADER)) {
      throw new Error(
        "JWT_PRIVATE_KEY is PKCS#1 format. Convert to PKCS#8: " +
          "openssl pkcs8 -topk8 -inform PEM -outform PEM -in rsa_key.pem -out pkcs8_key.pem -nocrypt",
      );
    }
    throw new Error(
      "JWT_PRIVATE_KEY does not start with -----BEGIN PRIVATE KEY-----. " +
        "Ensure it contains a valid PKCS#8 private key PEM string.",
    );
  }
  createPublicKey(pub);
}
