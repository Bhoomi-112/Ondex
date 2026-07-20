# Ondex session lifecycle

Wallet auth proves identity; Ondex then issues its own short-lived **RS256 JWT** + rotating refresh token family. There is no native Freighter “server logout” — logout is application-side only.

See also: [THREAT_MODEL.md](./THREAT_MODEL.md) for attack classes and controls.

## Cookies

| Cookie           | Contents                 | TTL        | Flags                                              |
|------------------|--------------------------|------------|----------------------------------------------------|
| `ondex_access`   | RS256 JWT                | 15 minutes | `httpOnly`, `SameSite=Strict`, `Secure` (prod)     |
| `ondex_refresh`  | opaque refresh secret    | 30 days    | `httpOnly`, `SameSite=Strict`, path `/api/v1/auth` |
| `ondex_csrf`     | double-submit CSRF token | 24 hours   | readable by JS, `SameSite=Strict`                  |

JWT payload claims (signed — never trust client-supplied role):

- `sub` — user id  
- `wallet` / `email` — identity anchors  
- `role` — `founder` \| `investor` \| `jury` \| null  
- `onboardingStatus` — `role_selected` \| `profile_complete` \| `active`  
- Header: `alg=RS256`, `kid` for key rotation  

## Login (wallet)

1. Client `POST /api/v1/auth/challenge` with Stellar public key.  
2. Server stores **single-use nonce** (2 min TTL), returns challenge XDR.  
3. User signs the challenge XDR in Freighter / wallet kit.  
4. Client `POST /api/v1/auth/verify` with `{ wallet, challenge, signedTx }` + CSRF header.  
5. API verifies signature, **deletes challenge immediately**, upserts user, creates refresh-token row (SHA-256 hash + `familyId`), sets cookies.  
6. Failed attempts: exponential backoff + CAPTCHA after 3 fails. Errors are **generic** (no wallet enumeration).

## Signup / role

1. Same verify flow for first-time wallet.  
2. If `role` is null → UI `/signup/role` → `POST /api/v1/auth/select-role` with `{ role: "founder" | "investor" }` only (whitelisted).  
3. Role is immutable for the user. Admin-only change via `POST /admin/users/:userId/role` (+ MFA).  
4. Incomplete profile → `/onboarding` → `POST /api/v1/auth/complete-profile` (sanitized fields).  
5. Redirect to role dashboard.

## Jury path

1. `POST /api/v1/auth/jury/apply` creates pending application (sanitized statement).  
2. Admin enrolls MFA, then lists/approves with `X-MFA-Token`.  
3. Approve: audit log + escalation alert + `role=jury` + revoke target refresh tokens.  
4. Login redirects to `/jury-dashboard`.

## Refresh

1. Access JWT expires (~15 min).  
2. `POST /api/v1/auth/refresh` with `ondex_refresh` cookie.  
3. Server **rotates** within the same `familyId`.  
4. **Reuse of a rotated refresh token** → revoke **entire family** → force re-login + alert.

## Authorization

- **API**: `requireAuth` verifies RS256 JWT with alg allowlist; `requireRole` / `requireAdmin` / `requireAdminMfa`; role only from signed claim.  
- **IDOR**: resource owner/wallet checked against session (e.g. applications, jury votes).  
- **Web**: Next middleware verifies RS256 with `JWT_PUBLIC_KEY`, enforces role match on dashboard prefixes.

## Logout

1. `POST /api/v1/auth/logout` revokes family / all user refresh tokens, clears cookies, logs event.  
2. Client disconnects wallet kit.

## Env / secrets

- API: `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY` (PEM or `file:…`), optional `JWT_*_PREVIOUS`, `ADMIN_ADDRESS`, `DATABASE_URL`, network vars, `MFA_ENCRYPTION_KEY`, captcha/alert secrets.  
- Web: `JWT_PUBLIC_KEY` (and optional previous) for middleware.  
- Production: inject via secrets manager (`SECRETS_BACKEND=env|file`) — never commit keys.  
- Local: leave `NEXT_PUBLIC_API_URL` empty so same-origin `/api/*` keeps cookies on the Next origin.
