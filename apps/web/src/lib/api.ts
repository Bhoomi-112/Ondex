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

export type ApiCampaign = {
  id?: number;
  campaignId?: number;
  campaign_id?: number;
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