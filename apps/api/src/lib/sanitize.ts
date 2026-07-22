/**
 * Sanitize user-generated content before storage/render (stored XSS prevention).
 * Strips HTML tags, null bytes, and control characters; escapes remaining entities.
 */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAG = /<\/?[^>]+>/g;
const SCRIPTISH =
  /javascript\s*:|data\s*:|vbscript\s*:|on\w+\s*=/gi;

export function sanitizeText(input: string, maxLen = 10_000): string {
  let s = String(input ?? "");
  s = s.replace(CONTROL_CHARS, "");
  s = s.replace(HTML_TAG, "");
  s = s.replace(SCRIPTISH, "");
  s = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s.trim();
}

export function sanitizeOptional(
  input: string | null | undefined,
  maxLen = 10_000,
): string | null {
  if (input == null || input === "") return null;
  return sanitizeText(input, maxLen);
}

/** Whitelist-pick only allowed keys from a body object (mass-assignment protection). */
export function pickAllowed<T extends Record<string, unknown>>(
  body: unknown,
  allowed: readonly (keyof T)[],
): Partial<T> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  const src = body as Record<string, unknown>;
  const out: Partial<T> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(src, key as string)) {
      out[key] = src[key as string] as T[keyof T];
    }
  }
  return out;
}

/** Fields that must never be accepted from client input on user-facing endpoints. */
export const FORBIDDEN_USER_FIELDS = [
  "role",
  "isAdmin",
  "is_admin",
  "onboardingStatus",
  "onboarding_status",
  "mfaSecret",
  "mfa_secret",
  "mfaEnabled",
  "mfa_enabled",
  "id",
  "wallet",
  "email",
] as const;

export function assertNoForbiddenFields(body: unknown): void {
  if (!body || typeof body !== "object") return;
  const keys = Object.keys(body as object);
  for (const k of keys) {
    if ((FORBIDDEN_USER_FIELDS as readonly string[]).includes(k)) {
      throw new Error(`Field not allowed: ${k}`);
    }
  }
}
