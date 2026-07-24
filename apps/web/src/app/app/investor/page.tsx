"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api-client";
import { formatAddress } from "@/lib/utils";
import { Briefcase, TrendingUp, Coins, ArrowUpRight, Loader2 } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  funding_amount: string;
  status: string;
}

export default function AppInvestorDashboard() {
  const { address } = useWallet();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Campaign[] }>("/api/v1/campaigns?state=APPROVED")
      .then((res) => setCampaigns(res.data))
      .catch((err) => addToast({ title: err.message, variant: "error" }))
      .finally(() => setIsLoading(false));
  }, [addToast]);

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Connect your wallet</h2>
          <p className="mt-2 text-sm text-slate-500">Connect your wallet to browse and fund campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Investor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and fund approved campaigns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Investments</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {campaigns.filter((c) => c.status === "APPROVED").length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Deployed</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {campaigns.reduce((s, c) => s + Number(c.funding_amount), 0).toLocaleString()} XLM
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Wallet</p>
                <p className="text-lg font-mono font-bold text-slate-900 mt-1">{formatAddress(address)}</p>
              </div>
              <Coins className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-32 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No campaigns available</h3>
            <p className="mt-2 text-sm text-slate-500">There are no approved campaigns to invest in at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{campaign.title || `Campaign #${campaign.id}`}</h3>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{campaign.description}</p>
                    <p className="text-sm font-medium text-slate-900">
                      Ask: {Number(campaign.funding_amount).toLocaleString()} XLM
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
