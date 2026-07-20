import { apiUrl } from "./contracts";

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(apiUrl(path), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type ApiApplication = {
  id?: number;
  onChainId?: number;
  on_chain_id?: number;
  name?: string;
  pitch?: string;
  askAmount?: number | string;
  ask_amount?: number | string;
  status?: string;
  maskName?: boolean;
  mask_name?: boolean;
  maskAddress?: boolean;
  mask_address?: boolean;
  startup?: string;
  startupAddress?: string;
  startup_address?: string;
  milestones?: Array<{
    description?: string;
    amount?: number | string;
    released?: boolean;
  }>;
};

export type ApiCase = {
  id?: number;
  caseId?: number;
  case_id?: number;
  status?: string;
  forVotes?: number;
  for_votes?: number;
  againstVotes?: number;
  against_votes?: number;
  approved?: boolean;
  disputeWindowSecs?: number;
  dispute_window_secs?: number;
};

export type ApiCampaign = {
  id?: number;
  campaignId?: number;
  campaign_id?: number;
  appId?: number;
  app_id?: number;
  name?: string;
  pitch?: string;
  goal?: number | string;
  totalDeposited?: number | string;
  total_deposited?: number | string;
  totalAmount?: number | string;
  total_amount?: number | string;
  status?: string;
  state?: string;
  startup?: string;
  milestones?: Array<{ amount?: number | string; released?: boolean; description?: string }>;
};

export type ApiVote = {
  appId?: number;
  app_id?: number;
  caseId?: number;
  case_id?: number;
  voter?: string;
  approve?: boolean;
  timestamp?: number;
};

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string") return Number(v) || 0;
  return 0;
}

export function appId(a: ApiApplication): number {
  return num(a.onChainId ?? a.on_chain_id ?? a.id);
}

export async function fetchPendingApplications(): Promise<ApiApplication[]> {
  const data = await getJson<{ applications?: ApiApplication[] }>(
    "/api/jury/applications",
  );
  if (data?.applications) return data.applications;
  const alt = await getJson<{ applications?: ApiApplication[] }>(
    "/api/applications",
  );
  return alt?.applications ?? [];
}

export async function fetchApplicationsByStartup(
  startup: string,
): Promise<ApiApplication[]> {
  const data = await getJson<{ applications?: ApiApplication[] }>(
    `/api/applications?startup=${encodeURIComponent(startup)}`,
  );
  return data?.applications ?? [];
}

export async function fetchApplicationVotes(
  id: number,
): Promise<ApiVote[]> {
  const data = await getJson<{ votes?: ApiVote[] }>(
    `/api/applications/${id}/votes`,
  );
  return data?.votes ?? [];
}

export async function fetchMyVotes(address: string): Promise<ApiVote[]> {
  const data = await getJson<{ votes?: ApiVote[] }>(
    `/api/jury/my-votes/${encodeURIComponent(address)}`,
  );
  return data?.votes ?? [];
}

export async function fetchCases(): Promise<ApiCase[]> {
  const data = await getJson<{ items?: ApiCase[] }>("/api/v1/cases?limit=100");
  return data?.items ?? [];
}

export async function fetchCampaigns(params?: {
  startup?: string;
  investor?: string;
}): Promise<ApiCampaign[]> {
  const q = new URLSearchParams({ limit: "100" });
  if (params?.startup) q.set("startup", params.startup);
  if (params?.investor) q.set("investor", params.investor);
  const data = await getJson<{ items?: ApiCampaign[] }>(
    `/api/v1/campaigns?${q.toString()}`,
  );
  return data?.items ?? [];
}

export async function fetchCampaign(id: number): Promise<ApiCampaign | null> {
  return getJson<ApiCampaign>(`/api/v1/campaigns/${id}`);
}
