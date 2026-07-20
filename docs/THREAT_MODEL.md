# Ondex Threat Model & Security Controls

This document maps each attack class to the concrete control implemented in the codebase.
It is the authoritative inventory for auth hardening deliverables.

> **TODO (external smart contract audit):** Before mainnet deployment or handling real funds,
> commission a third-party security audit of all Soroban contracts under `/contracts`.
> Code review and unit tests are **not** a substitute for a professional audit.
> Tracked in-source as `// TODO(security-audit)` in:
> - `contracts/escrow_contract/src/lib.rs`
> - `contracts/jury_registry/src/lib.rs`

---

## 1. Authentication & Tokens

| Attack class | Control | Implementation |
|---|---|---|
| JWT alg confusion / weak HS256 | **RS256 only**; server validates `alg` against allowlist `["RS256"]` and never trusts the token header alone | `apps/api/src/lib/jwt.ts` — `JWT_ALG_ALLOWLIST`, `decodeProtectedHeader` pre-check + `jose.jwtVerify({ algorithms })` |
| Long-lived access tokens | **15-minute** access token TTL | `ACCESS_TOKEN_TTL_SECONDS = 15 * 60` in `jwt.ts` / `auth.service.ts` |
| Key compromise | **Signing key rotation** via current + previous RSA key pair | `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` + `JWT_*_PREVIOUS`; `kid` header; verify tries current then previous |
| Refresh token theft / replay | **Rotate on every use**; reuse of rotated token **revokes entire session family** and forces re-login | `auth.service.ts` `refreshSession`; `RefreshToken.familyId`; `refreshRepo.revokeFamily` |
| Challenge replay | Wallet challenge = **single-use nonce**, server-stored, **2-minute expiry**, deleted immediately after verification | `AuthChallenge` model; `CHALLENGE_TTL_MS = 2 * 60 * 1000`; delete-before-complete in `verifyChallenge` |

## 2. Request-Level Protection

| Attack class | Control | Implementation |
|---|---|---|
| CSRF | `SameSite=strict` cookies + **double-submit CSRF token** on all POST/PUT/DELETE | `middleware/csrf.ts`; `cookies.ts` SameSite; `GET /api/v1/auth/csrf` |
| Brute force / credential stuffing | Per-IP **and** per-account rate limits; **exponential backoff**; **CAPTCHA** after ≥3 failures | `middleware/rate-limiter.ts` `authLimiter`, `authFailureGuard`, `AuthFailureBucket` |
| User enumeration | **Generic auth error messages** — never reveal whether email/wallet exists | `GENERIC_AUTH_FAILURE` in `auth.service.ts` |
| Mass assignment | Explicit **field whitelist** server-side; `role` / `isAdmin` / `onboarding_status` rejected from user-facing bodies | `lib/sanitize.ts` `pickAllowed`, `FORBIDDEN_USER_FIELDS`; admin role only via `POST /admin/users/:userId/role` |

## 3. Authorization

| Attack class | Control | Implementation |
|---|---|---|
| IDOR | Every resource fetch/update checks owner/wallet against **authenticated session**, not URL/body alone | `assertResourceOwner`; applications routes force `startup`/`voter` from session |
| Client-side route guard bypass | Route guards **re-verified server-side on every request**; role from **signed JWT claim only** | `middleware/auth.ts` `requireAuth` / `requireRole`; never reads role from body |

## 4. Admin & Jury Approval

| Attack class | Control | Implementation |
|---|---|---|
| Admin session hijack | Admin panel requires **MFA (TOTP)** on privileged endpoints | `requireAdminMfa`; enroll/confirm under `/api/v1/auth/admin/mfa/*` |
| Silent privilege escalation | Every role change written to **immutable audit log** (actor, target, old/new role, timestamp, IP) | `AuditLog` model; `audit.repository.ts`; jury approve + `adminChangeRole` |
| Undetected escalation | **Alert** (Slack webhook / email) on every role escalation | `lib/alerts.ts` `alertRoleEscalation` |

## 5. Application Hardening

| Attack class | Control | Implementation |
|---|---|---|
| XSS (stored) | Sanitize pitch text, jury comments, profiles before store | `lib/sanitize.ts` `sanitizeText` |
| XSS / injection (client) | **Strict CSP**, no inline scripts | `middleware/security-headers.ts`; Next.js `headers` CSP |
| Secret leakage | Secrets via **secrets manager abstraction** (env/file injection); never commit keys | `lib/secrets.ts`; `.env` gitignored; `.env.example` placeholders only |
| Cookie theft / MITM | **HTTPS-only**, **HSTS**, `secure` + `httpOnly` + `SameSite=strict` cookies | `security-headers.ts`; `cookies.ts` |

## 6. Smart Contract Layer (Soroban)

| Attack class | Control | Implementation |
|---|---|---|
| Unauthorized state change | **Access-control** (`require_admin` / `require_auth` on parties) on state-changing fns | `escrow_contract`, `jury_registry` |
| Reentrancy on fund moves | **Reentrancy lock** + checks-effects-interactions on deposit/release/refund/register/slash | `DataKey::ReentrancyLock`, `reentrancy_enter` / `reentrancy_exit` |
| Undiscovered contract bugs | **External audit required** before mainnet / real funds | `TODO(security-audit)` flags; this document |

## 7. Monitoring

| Attack class | Control | Implementation |
|---|---|---|
| Blind auth attacks | Log all auth events with **IP + device fingerprint** | `AuthEvent` model; login/refresh/logout/role_change/MFA |
| Impossible travel | Alert when login geo-hint jumps countries within 1h | `anomaly.service.ts` `checkImpossibleTravel` |
| Role-check probing | Alert on burst of failed role checks | `checkRoleCheckBurst` |
| Session theft | Alert on **refresh-token reuse** | `checkRefreshReuseAnomaly` + family revoke |

---

## Secrets & Rotation

| Secret | Env / mount | Rotation |
|---|---|---|
| JWT signing keys | `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` (PEM or `file:/path`) | Deploy new pair as current; move old to `JWT_*_PREVIOUS` for grace window |
| MFA encryption | `MFA_ENCRYPTION_KEY` | Rotate with re-encrypt job |
| CAPTCHA | `CAPTCHA_SECRET_KEY` | Provider rotation |
| Alerts | `ALERT_WEBHOOK_URL`, `ALERT_EMAIL_TO` | Ops-owned |
| DB | `DATABASE_URL` | Via secrets manager only |

`SECRETS_BACKEND=env|file` documents the injection mode; production should inject from AWS Secrets Manager / Vault agent into env or mounted files — **never** commit secrets to git.

---

## Key files

```
apps/api/src/lib/jwt.ts
apps/api/src/lib/secrets.ts
apps/api/src/lib/sanitize.ts
apps/api/src/lib/mfa.ts
apps/api/src/lib/alerts.ts
apps/api/src/lib/cookies.ts
apps/api/src/middleware/auth.ts
apps/api/src/middleware/csrf.ts
apps/api/src/middleware/rate-limiter.ts
apps/api/src/middleware/security-headers.ts
apps/api/src/services/auth.service.ts
apps/api/src/services/anomaly.service.ts
apps/api/src/routes/v1/auth.ts
apps/api/src/routes/applications.ts
apps/api/prisma/schema.prisma
contracts/escrow_contract/src/lib.rs
contracts/jury_registry/src/lib.rs
```
