"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  checkAdminStatus,
  searchUsers,
  adminAssignRole,
} from "@/lib/auth-api";
import { formatAddress } from "@/lib/utils";
import { Shield, Search, Loader2, Brain, Play, ExternalLink } from "lucide-react";
import type { UserRole } from "@/lib/auth-types";
import { api } from "@/lib/api-client";

interface AIEvaluation {
  id: string;
  applicationId: string;
  score: number;
  verdict: string;
  confidence: number;
  status: string;
  createdAt: string;
  completedAt?: string;
  txHash?: string;
  evidenceReport?: Record<string, string>;
}

export default function AdminPanel() {
  const { address, connect, isConnecting } = useWallet();
  const { addToast } = useToast();
  const [phase, setPhase] = useState<"loading" | "no-wallet" | "unauthorized" | "ready">("loading");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string; wallet: string | null; email: string | null;
    displayName: string | null; role: string | null; onboardingStatus: string;
  }>>([]);
  const [searching, setSearching] = useState(false);
  const [assignBusy, setAssignBusy] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>([]);
  const [loadingEvals, setLoadingEvals] = useState(false);
  const [triggeringEval, setTriggeringEval] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { isAdmin } = await checkAdminStatus();
        if (isAdmin) { setPhase("ready"); }
        else if (!address) { setPhase("no-wallet"); }
        else { setPhase("unauthorized"); }
      } catch {
        setPhase(!address ? "no-wallet" : "unauthorized");
      }
    })();
  }, [address]);

  const loadEvaluations = async () => {
    setLoadingEvals(true);
    try {
      const res = await api.get<{ data: AIEvaluation[]; items?: AIEvaluation[] }>("/api/ai/evaluations");
      setEvaluations(res.data || res.items || []);
    } catch {
      // silent
    } finally {
      setLoadingEvals(false);
    }
  };

  useEffect(() => {
    if (phase === "ready") loadEvaluations();
  }, [phase]);

  const handleTriggerEval = async () => {
    setTriggeringEval(true);
    try {
      const res = await api.post<{ ok: boolean; evaluationId?: string }>("/api/ai/evaluations/trigger");
      addToast({ title: "Evaluation triggered", description: res.evaluationId || "Processing...", variant: "success" });
      await loadEvaluations();
    } catch (err) {
      addToast({ title: "Failed to trigger evaluation", description: String(err), variant: "error" });
    } finally {
      setTriggeringEval(false);
    }
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 2) return;
    setSearching(true);
    try {
      const { users } = await searchUsers(q);
      setSearchResults(users);
    } catch (err) {
      addToast({ title: "Search failed", description: String(err), variant: "error" });
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (userId: string, role: UserRole) => {
    setAssignBusy(userId);
    try {
      await adminAssignRole(userId, role);
      addToast({ title: "Role assigned", description: `User is now ${role}`, variant: "success" });
      setSearchResults((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      addToast({ title: "Assignment failed", description: String(err), variant: "error" });
    } finally {
      setAssignBusy(null);
    }
  };

  if (phase === "loading") {
    return <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  if (phase === "no-wallet") {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full"><CardContent className="py-12 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Connect Wallet</h2>
          <Button onClick={connect} disabled={isConnecting}>{isConnecting ? "Connecting..." : "Connect wallet"}</Button>
        </CardContent></Card>
      </div>
    );
  }

  if (phase === "unauthorized") {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full"><CardContent className="py-12 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 mt-2">Admin access only.</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Shield className="h-6 w-6 text-blue-600" /> Admin Panel
            </h1>
            <p className="mt-1 text-sm text-slate-500">Wallet-gated administration.</p>
          </div>
          <Badge className="font-mono text-xs">{address ? formatAddress(address) : "—"}</Badge>
        </div>

        <div className="space-y-8">
          {/* ─── AI Evaluation Panel ─── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-4 w-4 text-amber-600" /> AI Evaluation Queue
                  </CardTitle>
                  <CardDescription>Trigger and view AI evaluation results for startup applications.</CardDescription>
                </div>
                <Button onClick={handleTriggerEval} disabled={triggeringEval} variant="default" size="sm">
                  {triggeringEval ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
                  {triggeringEval ? "Triggering..." : "Trigger Evaluation"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingEvals ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
              ) : evaluations.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  <Brain className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No evaluations yet. Click &quot;Trigger Evaluation&quot; to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {evaluations.map((evalItem) => (
                    <div key={evalItem.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900">
                              Application #{evalItem.applicationId.slice(0, 8)}
                            </span>
                            <Badge variant={evalItem.status === "completed" ? "success" : evalItem.status === "failed" ? "danger" : "warning"}>
                              {evalItem.status}
                            </Badge>
                          </div>
                          {evalItem.status === "completed" && (
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <span>Score: <strong>{evalItem.score}%</strong></span>
                              <span>Confidence: <strong>{evalItem.confidence}%</strong></span>
                              <span>Verdict: <strong className={evalItem.verdict === "approved" ? "text-emerald-600" : "text-red-600"}>{evalItem.verdict}</strong></span>
                            </div>
                          )}
                          {evalItem.txHash && (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${evalItem.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-3 w-3" /> View Transaction
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ─── User Search ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Search className="h-4 w-4" /> Find User</CardTitle>
              <CardDescription>Search by wallet address, email, or display name.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} placeholder="Search wallet, email, or name..." className="font-mono text-sm" />
                <Button onClick={handleSearch} disabled={query.trim().length < 2 || searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">{searchResults.length} result(s)</p>
              {searchResults.map((u) => (
                <Card key={u.id}><CardContent className="py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium text-slate-900">{u.displayName || "Unnamed"}</p>
                      {u.wallet && <p className="truncate font-mono text-xs text-slate-500">{u.wallet}</p>}
                      {u.email && <p className="text-xs text-slate-400">{u.email}</p>}
                      <div className="flex gap-2">
                        <Badge variant={u.role ? "success" : "secondary"} className="text-[10px]">{u.role || "no role"}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{u.onboardingStatus}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {u.role !== "founder" && (
                        <Button size="sm" variant="outline" onClick={() => handleAssign(u.id, "founder")} disabled={assignBusy === u.id}>
                          {assignBusy === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Set Founder"}
                        </Button>
                      )}
                      {u.role !== "investor" && (
                        <Button size="sm" variant="outline" onClick={() => handleAssign(u.id, "investor")} disabled={assignBusy === u.id}>
                          {assignBusy === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Set Investor"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
