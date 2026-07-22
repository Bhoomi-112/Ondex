/**
 * Secrets loader abstraction.
 *
 * Production: set SECRETS_BACKEND=env|file and load keys from a secrets
 * manager injection path (e.g. mounted volume or process env populated by
 * AWS Secrets Manager / Vault agent). Never commit private keys or DB creds.
 *
 * Rotation: JWT supports current + previous key pair via JWT_*_PREVIOUS.
 */
import fs from "node:fs";
import path from "node:path";

export type SecretName =
  | "JWT_PRIVATE_KEY"
  | "JWT_PUBLIC_KEY"
  | "JWT_PRIVATE_KEY_PREVIOUS"
  | "JWT_PUBLIC_KEY_PREVIOUS"
  | "SESSION_SECRET"
  | "DATABASE_URL"
  | "CAPTCHA_SECRET_KEY"
  | "ALERT_WEBHOOK_URL"
  | "ALERT_EMAIL_TO"
  | "ALERT_EMAIL_API_URL"
  | "MFA_ENCRYPTION_KEY";

function readFileIfPath(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("-----BEGIN") || value.includes("\n")) {
    return value.replace(/\\n/g, "\n");
  }
  if (value.startsWith("file:")) {
    const filePath = value.slice(5);
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Secret file not found: ${resolved}`);
    }
    return fs.readFileSync(resolved, "utf-8");
  }
  return value;
}

export function getSecret(name: SecretName, required = false): string | undefined {
  const raw = process.env[name];
  const value = readFileIfPath(raw)?.trim();
  if (required && !value) {
    throw new Error(
      `Missing required secret: ${name}. Provide via secrets manager injection or env (see .env.example).`,
    );
  }
  return value || undefined;
}

export function requireSecret(name: SecretName): string {
  return getSecret(name, true)!;
}
