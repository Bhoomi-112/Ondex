"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { Building2, FileText, Sparkles, Plus, Wallet, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface Application {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  aiScore?: number;
  aiVerdict?: string;
}

export default function AppStartupDashboard() {
  const { address } = useWallet();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Application[]; items?: Application[] }>("/api/applications")
      .then((res) => {
        const items = res.data || res.items || [];
        setApplications(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <Wallet className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Connect your wallet</h2>
          <p className="mt-2 text-sm text-slate-500">Connect your wallet to view your applications.</p>
        </div>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, label: "Approved" };
      case "rejected": return { color: "bg-red-100 text-red-700", icon: XCircle, label: "Rejected" };
      case "pending": return { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending" };
      default: return { color: "bg-blue-100 text-blue-700", icon: Clock, label: status };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Startup Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your applications and AI evaluations.</p>
          </div>
          <Link href="/startup/apply" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Application
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { label: "Total Applications", value: applications.length, icon: FileText, color: "bg-blue-100 text-blue-600" },
            { label: "AI Evaluated", value: applications.filter((a) => a.aiScore !== undefined).length, icon: Sparkles, color: "bg-emerald-100 text-emerald-600" },
            { label: "Approved", value: applications.filter((a) => a.aiVerdict === "approved").length, icon: CheckCircle, color: "bg-green-100 text-green-600" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg ${stat.color} p-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No applications yet</h3>
            <p className="mt-2 text-sm text-slate-500 mb-6">Create your first funding application.</p>
            <Link href="/startup/apply" className="btn-primary inline-flex">
              <Plus className="mr-2 h-4 w-4" /> Create Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const badge = statusBadge(app.status);
              const Icon = badge.icon;
              return (
                <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">{app.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.color}`}>
                          <Icon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Created {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      {app.aiScore !== undefined && (
                        <div className="mt-3 flex items-center gap-4">
                          <div>
                            <span className="text-xs text-slate-400">AI Score</span>
                            <p className="text-sm font-semibold text-slate-900">{app.aiScore}%</p>
                          </div>
                          {app.aiVerdict && (
                            <div>
                              <span className="text-xs text-slate-400">Verdict</span>
                              <p className={`text-sm font-semibold ${app.aiVerdict === "approved" ? "text-emerald-600" : "text-red-600"}`}>
                                {app.aiVerdict}
                              </p>
                            </div>
                          )}
                        </div>
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
