"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { Shield, Wallet, TrendingUp, Coins, ArrowRight } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export default function InvestorDashboard() {
  const { address } = useWallet();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ active: 0, totalDeployed: 0, returns: 0 });

  useEffect(() => {
    // Stats would come from /api/v1/campaigns
  }, []);

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <Shield className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Connect your wallet</h2>
          <p className="mt-2 text-sm text-slate-500">Use the "Log in" button in the navbar to connect your Stellar wallet and access your investor dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investor Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Browse AI-matched startups and manage your investments.</p>
          </div>
          <Link href="/startups" className="btn-primary inline-flex items-center gap-2">
            Browse Startups <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Investments</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</p>
              </div>
              <Coins className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Deployed</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDeployed} XLM</p>
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
              <Wallet className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No active investments yet</h3>
          <p className="mt-2 text-sm text-slate-500">Browse AI-matched startups and make your first deposit.</p>
          <Link href="/startups" className="btn-primary mt-6 inline-flex">
            Browse Startups
          </Link>
        </div>
      </div>
    </div>
  );
}
