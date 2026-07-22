import { getSecret } from "./secrets.js";
import { ValidationError } from "./errors.js";

/**
 * Verify CAPTCHA token (hCaptcha / Turnstile compatible).
 * When CAPTCHA_SECRET_KEY is unset (local dev), accepts token "dev-bypass" only in non-production.
 */
export async function verifyCaptcha(
  token: string | undefined,
  remoteIp?: string,
): Promise<void> {
  const secret = getSecret("CAPTCHA_SECRET_KEY");
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new ValidationError("CAPTCHA configuration missing");
    }
    if (token === "dev-bypass") return;
    // In dev without captcha key, still require a non-empty token when demanded
    if (!token) throw new ValidationError("CAPTCHA required");
    return;
  }

  if (!token) {
    throw new ValidationError("CAPTCHA required");
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  const provider =
    process.env.CAPTCHA_VERIFY_URL ||
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const res = await fetch(provider, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new ValidationError("CAPTCHA verification failed");
  }

  const data = (await res.json()) as { success?: boolean };
  if (!data.success) {
    throw new ValidationError("CAPTCHA verification failed");
  }
}
