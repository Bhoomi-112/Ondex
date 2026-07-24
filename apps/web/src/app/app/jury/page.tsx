"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api-client";
import { Brain, BarChart3, ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AIEvaluation {
  id: string;
  applicationId: string;
  score: number;
  verdict: string;
  confidence: number;
  evidenceReport?: {
    webPresence?: string;
    documentAnalysis?: string;
    marketAnalysis?: string;
  };
  status: "pending" | "collecting" | "analyzing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  txHash?: string;
}

export default function JuryDashboard() {
  const { address } = useWallet();
  const { addToast } = useToast();
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: AIEvaluation[]; items?: AIEvaluation[] }>("/api/ai/evaluations")
      .then((res) => {
        const items = res.data || res.items || [];
        setEvaluations(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <Brain className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Connect your wallet</h2>
          <p className="mt-2 text-sm text-slate-500">Connect your wallet to view AI evaluation results.</p>
        </div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "failed": return "bg-red-100 text-red-700";
      case "analyzing": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      case "analyzing":
      case "collecting": return <Loader2 className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-3">
              <Brain className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Jury Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
                AI-powered startup evaluation results. No human jury needed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          {[
            { label: "Total Evaluated", value: evaluations.length, color: "text-blue-600 bg-blue-100" },
            { label: "Approved", value: evaluations.filter((e) => e.verdict === "approved").length, color: "text-emerald-600 bg-emerald-100" },
            { label: "Rejected", value: evaluations.filter((e) => e.verdict === "rejected").length, color: "text-red-600 bg-red-100" },
            { label: "Pending", value: evaluations.filter((e) => e.status !== "completed").length, color: "text-amber-600 bg-amber-100" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className={`rounded-lg ${stat.color} p-2`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-4 w-32 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : evaluations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No evaluations yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              AI evaluations will appear here once startup applications are submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evalItem) => (
              <div key={evalItem.id} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        Application #{evalItem.applicationId.slice(0, 8)}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(evalItem.status)}`}>
                        {statusIcon(evalItem.status)}
                        {evalItem.status}
                      </span>
                    </div>

                    {evalItem.status === "completed" && (
                      <>
                        <div className="mt-4 grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">{evalItem.score}%</p>
                            <p className="text-xs text-slate-500">Overall Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">
                              {evalItem.confidence}%
                            </p>
                            <p className="text-xs text-slate-500">Confidence</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-lg font-bold ${evalItem.verdict === "approved" ? "text-emerald-600" : "text-red-600"}`}>
                              {evalItem.verdict === "approved" ? "Approved" : "Rejected"}
                            </p>
                            <p className="text-xs text-slate-500">Verdict</p>
                          </div>
                        </div>

                        {evalItem.evidenceReport && (
                          <details className="mt-3">
                            <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                              View Evidence Report
                            </summary>
                            <div className="mt-3 space-y-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                              {evalItem.evidenceReport.webPresence && (
                                <p><span className="font-medium text-slate-900">Web Presence:</span> {evalItem.evidenceReport.webPresence}</p>
                              )}
                              {evalItem.evidenceReport.documentAnalysis && (
                                <p><span className="font-medium text-slate-900">Document Analysis:</span> {evalItem.evidenceReport.documentAnalysis}</p>
                              )}
                              {evalItem.evidenceReport.marketAnalysis && (
                                <p><span className="font-medium text-slate-900">Market Analysis:</span> {evalItem.evidenceReport.marketAnalysis}</p>
                              )}
                            </div>
                          </details>
                        )}

                        {evalItem.txHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${evalItem.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View on Stellar Explorer
                          </a>
                        )}
                      </>
                    )}
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
