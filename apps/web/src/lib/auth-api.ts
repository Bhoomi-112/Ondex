import { apiUrl } from "./contracts";
import type { AuthUser, UserRole } from "./auth-types";

const CSRF_COOKIE = "ondex_csrf";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

async function ensureCsrf(): Promise<string | undefined> {
  let token = readCookie(CSRF_COOKIE);
  if (token) return token;
  try {
    const res = await fetch(apiUrl("/api/v1/auth/csrf"), {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const body = (await res.json()) as { csrfToken?: string };
      token = body.csrfToken || readCookie(CSRF_COOKIE);
    }
  } catch {
    // ignore — mutation may still fail closed server-side
  }
  return token;
}

async function authFetch<T>(
  path: string,
  init?: RequestInit & { mfaToken?: string },
): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const csrf = await ensureCsrf();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }

  if (init?.mfaToken) {
    headers["X-MFA-Token"] = init.mfaToken;
  }

  const { mfaToken: _m, ...rest } = init ?? {};
  const res = await fetch(apiUrl(path), {
    ...rest,
    credentials: "include",
    headers,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: { message?: string } })?.error?.message ||
      (body as { message?: string })?.message ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

export async function fetchChallenge(wallet: string) {
  return authFetch<{
    challenge: string;
    network_passphrase: string;
    expiresAt?: string;
  }>("/api/v1/auth/challenge", {
    method: "POST",
    body: JSON.stringify({ wallet }),
  });
}

export async function verifyWalletAuth(params: {
  wallet: string;
  challenge: string;
  signedTx: string;
  captchaToken?: string;
}) {
  return authFetch<{
    user: AuthUser;
    isNewUser: boolean;
    expiresAt: string;
  }>("/api/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function fetchMe() {
  return authFetch<{ user: AuthUser }>("/api/v1/auth/me");
}

export async function refreshSession() {
  return authFetch<{ user: AuthUser; expiresAt: string }>(
    "/api/v1/auth/refresh",
    { method: "POST", body: "{}" },
  );
}

export async function logoutSession() {
  return authFetch<{ ok: boolean }>("/api/v1/auth/logout", {
    method: "POST",
    body: "{}",
  });
}

export async function selectRole(_role: never) {
  throw new Error("Role self-selection is disabled. Apply for jury access instead.");
}

export async function completeProfile(data: {
  displayName: string;
  bio?: string;
}) {
  return authFetch<{ user: AuthUser }>("/api/v1/auth/complete-profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function applyAsJury(data: {
  statement: string;
  experience?: string;
}) {
  return authFetch<{ application: { id: string; status: string } }>(
    "/api/v1/auth/jury/apply",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function listJuryApplications(status?: string, mfaToken?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return authFetch<{
    items: Array<{
      id: string;
      wallet: string;
      status: string;
      statement: string;
      experience: string | null;
      createdAt: string;
      user: { id: string; displayName: string | null };
    }>;
  }>(`/api/v1/auth/admin/jury-applications${q}`, { mfaToken });
}

export async function approveJuryApplication(id: string, mfaToken?: string) {
  return authFetch<{ applicationId: string; user: AuthUser }>(
    `/api/v1/auth/admin/jury-applications/${id}/approve`,
    { method: "POST", body: "{}", mfaToken },
  );
}

export async function rejectJuryApplication(
  id: string,
  reason: string | undefined,
  mfaToken?: string,
) {
  return authFetch<{ application: { id: string; status: string } }>(
    `/api/v1/auth/admin/jury-applications/${id}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
      mfaToken,
    },
  );
}

export async function fetchJuryStatus() {
  return authFetch<{
    application: {
      id: string;
      status: "pending" | "approved" | "rejected";
      createdAt: string;
      reviewedAt: string | null;
      rejectReason: string | null;
    } | null;
  }>("/api/v1/auth/jury/status");
}

export async function fetchFounderStatus() {
  return authFetch<{
    application: {
      id: number;
      status: "pending" | "approved" | "rejected";
      createdAt: string;
      reviewedAt: string | null;
      rejectReason: string | null;
      name: string;
      pitch: string;
      askAmount: string;
    } | null;
  }>("/api/v1/auth/founder/status");
}

export async function applyAsFounder(data: {
  name: string;
  pitch: string;
  askAmount: string;
  experience?: string;
  website?: string;
  socials?: Record<string, string>;
  milestones?: Array<{ description: string; amount: string }>;
}) {
  return authFetch<{ application: { id: number; status: string } }>(
    "/api/v1/auth/founder/apply",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function listFounderApplications(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return authFetch<{
    items: Array<{
      id: number;
      wallet: string;
      status: string;
      name: string;
      pitch: string;
      askAmount: string;
      experience: string | null;
      website: string | null;
      socials: string | null;
      createdAt: string;
      milestones: Array<{ id: number; description: string; amount: string; idx: number }>;
      user: { id: string; displayName: string | null; wallet: string | null };
    }>;
  }>(`/api/v1/auth/jury/founder-applications${q}`);
}

export async function approveFounderApplication(id: number) {
  return authFetch<{ applicationId: number; user: AuthUser }>(
    `/api/v1/auth/jury/founder-applications/${id}/approve`,
    { method: "POST", body: "{}" },
  );
}

export async function rejectFounderApplication(
  id: number,
  reason: string | undefined,
) {
  return authFetch<{ application: { id: number; status: string } }>(
    `/api/v1/auth/jury/founder-applications/${id}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
    },
  );
}

export async function fetchInvestorStatus() {
  return authFetch<{
    application: {
      id: string;
      status: "pending" | "approved" | "rejected";
      createdAt: string;
      reviewedAt: string | null;
      rejectReason: string | null;
    } | null;
  }>("/api/v1/auth/investor/status");
}

export async function checkAdminStatus() {
  return authFetch<{ isAdmin: boolean }>("/api/v1/auth/admin/check");
}

export async function listInvestorApplications(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return authFetch<{
    items: Array<{
      id: string;
      wallet: string;
      status: string;
      fullName: string;
      entityType: string | null;
      aum: string | null;
      sourceOfFunds: string | null;
      portfolioDesc: string | null;
      createdAt: string;
      user: { id: string; displayName: string | null };
    }>;
  }>(`/api/v1/auth/admin/investor-applications${q}`);
}

export async function approveInvestorApplication(id: string) {
  return authFetch<{ applicationId: string; user: AuthUser }>(
    `/api/v1/auth/admin/investor-applications/${id}/approve`,
    { method: "POST", body: "{}" },
  );
}

export async function rejectInvestorApplication(id: string, reason?: string) {
  return authFetch<{ application: { id: string; status: string } }>(
    `/api/v1/auth/admin/investor-applications/${id}/reject`,
    { method: "POST", body: JSON.stringify({ reason }) },
  );
}

export async function searchUsers(q: string) {
  return authFetch<{
    users: Array<{
      id: string;
      wallet: string | null;
      email: string | null;
      displayName: string | null;
      role: string | null;
      onboardingStatus: string;
      createdAt: string;
    }>;
  }>(`/api/v1/auth/admin/users?q=${encodeURIComponent(q)}`);
}

export async function adminAssignRole(userId: string, role: "founder" | "jury" | "investor") {
  return authFetch<{
    user: { id: string; role: string; onboardingStatus: string };
  }>(`/api/v1/auth/admin/users/${userId}/role-assign`, {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}

export async function applyAsInvestor(data: {
  fullName: string;
  entityType?: string;
  accreditation?: string;
  aum?: string;
  sourceOfFunds?: string;
  portfolioDesc?: string;
  experienceLevel?: string;
  companiesInvested?: string;
  sectorFocus?: string[];
  investmentRange?: string;
  previousPortfolio?: string;
  referralSource?: string;
}) {
  return authFetch<{ application: { id: string; status: string } }>(
    "/api/v1/auth/investor/apply",
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        sectorFocus: data.sectorFocus?.join(", "),
      }),
    },
  );
}
