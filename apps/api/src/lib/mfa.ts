import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getSecret } from "./secrets.js";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(input: string): Buffer {
  const cleaned = input.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

function hotp(secret: Buffer, counter: bigint): string {
  const buf = Buffer.alloc(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    buf[i] = Number(c & 0xffn);
    c >>= 8n;
  }
  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const code =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return String(code % 1_000_000).padStart(6, "0");
}

export function verifyTotp(
  secretBase32: string,
  token: string,
  window = 1,
): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const secret = base32Decode(secretBase32);
  const step = 30;
  const counter = BigInt(Math.floor(Date.now() / 1000 / step));
  for (let w = -window; w <= window; w++) {
    const expected = hotp(secret, counter + BigInt(w));
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

/** Simple XOR obfuscation with MFA_ENCRYPTION_KEY — secrets manager holds the key. */
export function encryptMfaSecret(plain: string): string {
  const key = getSecret("MFA_ENCRYPTION_KEY") || "dev-mfa-key-rotate-in-prod!!";
  const keyBuf = Buffer.from(key);
  const data = Buffer.from(plain, "utf8");
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i]! ^ keyBuf[i % keyBuf.length]!;
  }
  return out.toString("base64");
}

export function decryptMfaSecret(cipher: string): string {
  const key = getSecret("MFA_ENCRYPTION_KEY") || "dev-mfa-key-rotate-in-prod!!";
  const keyBuf = Buffer.from(key);
  const data = Buffer.from(cipher, "base64");
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i]! ^ keyBuf[i % keyBuf.length]!;
  }
  return out.toString("utf8");
}

export function totpUri(secret: string, account: string): string {
  const issuer = encodeURIComponent("Ondex Admin");
  const label = encodeURIComponent(account);
  return `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}
