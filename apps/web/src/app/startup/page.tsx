"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { Building2, FileText, Sparkles, Coins, Plus, Wallet } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { fetchCampaigns, type ApiCampaign } from "@/lib/api";
import { formatXLM } from "@/lib/utils";

export default function StartupDashboard() {
  const { address } = useWallet();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const items = await fetchCampaigns({ startup: address });
      setCampaigns(items);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <Wallet className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Connect your wallet</h2>
          <p className="mt-2 text-sm text-slate-500">Use the "Log in" button in the navbar to connect your Stellar wallet and access your founder dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user?.displayName || "Founder Dashboard"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-mono">{formatAddress(address)}</span>
            </p>
          </div>
          <Link href="/startup/apply" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Application
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Campaigns</p>
                <p className="text-xl font-bold text-slate-900">{campaigns.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">AI Match Score</p>
                <p className="text-xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Credits</p>
                <p className="text-xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-4 w-32 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No campaigns yet</h3>
            <p className="mt-2 text-sm text-slate-500 mb-6">
              Create your first funding campaign to start matching with investors.
            </p>
            <Link href="/startup/apply" className="btn-primary inline-flex">
              <Plus className="mr-2 h-4 w-4" /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => {
              const cid = (camp.campaignId ?? camp.id ?? 0) as number;
              return (
                <div key={cid} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {camp.name || `Campaign #${cid}`}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          camp.state === "Released" ? "bg-emerald-100 text-emerald-700" :
                          camp.state === "Refunded" ? "bg-slate-100 text-slate-600" :
                          camp.state === "MilestoneRequested" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {camp.state || "Active"}
                        </span>
                      </div>
                      {camp.pitch && (
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{camp.pitch}</p>
                      )}
                      {camp.totalAmount && (
                        <p className="mt-3 text-sm">
                          <span className="text-slate-400">Deposited: </span>
                          <span className="font-semibold text-slate-900">{formatXLM(Number(camp.totalAmount))} XLM</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
