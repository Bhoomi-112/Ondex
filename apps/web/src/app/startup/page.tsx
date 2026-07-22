"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useAuth } from "@/providers/auth";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatus } from "@/components/ui/transaction-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, XCircle, Clock, FileText, Lock, Users2,
  Coins, Tag, Building2, Lightbulb, Zap, ExternalLink, Wallet, User,
} from "lucide-react";
import { formatXLM, stroopsToXLM, formatAddress } from "@/lib/utils";
import {
  getEscrowClient,
  getNetworkConfig,
} from "@/lib/contracts";
import {
  fetchApplicationsByStartup,
  fetchApplicationVotes,
  appId as resolveAppId,
  type ApiApplication,
} from "@/lib/api";
import { buildSignSubmit, getExplorerUrl } from "@/lib/tx";
import { completeProfile } from "@/lib/auth-api";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  tagline?: string;
  website?: string;
  logoUrl?: string;
  category?: string;
  stage?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  marketSize?: string;
  pitch: string;
  currentStatus?: string;
  traction?: string;
  teamBackground?: string;
  socialLinks?: string;
  previousExperience?: string;
  askAmount: number;
  useOfFunds?: string;
  revenueModel?: string;
  status: "Submitted" | "UnderReview" | "Approved" | "Rejected";
  milestones: { description: string; amount: number; released: boolean }[];
}

interface Vote {
  voter: string;
  approve: boolean;
  commentHash: string;
  timestamp: number;
}

export default function StartupDashboard() {
  const { address, signTransaction } = useWallet();
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const fetchApplications = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const statusMap: Record<string, Application["status"]> = {
        Submitted: "Submitted",
        UnderReview: "UnderReview",
        Approved: "Approved",
        Rejected: "Rejected",
      };

      const rawApps = await fetchApplicationsByStartup(address);
      const myApps: Application[] = rawApps.map((app: ApiApplication) => {
        const statusTag = app.status || "Submitted";
        const ask = app.askAmount ?? app.ask_amount ?? 0;
        const askNum =
          Number(ask) > 1e6 ? stroopsToXLM(Number(ask)) : Number(ask);
        const milestones =
          app.milestones?.map((m, i) => {
            const amt = m.amount ?? 0;
            return {
              description: m.description || `Milestone ${i + 1}`,
              amount:
                Number(amt) > 1e6 ? stroopsToXLM(Number(amt)) : Number(amt),
              released: !!m.released,
            };
          }) || [];

        return {
          id: resolveAppId(app),
          name: app.name || "Anonymous",
          tagline: app.tagline,
          website: app.website,
          logoUrl: app.logoUrl ?? app.logo_url,
          category: app.category,
          stage: app.stage,
          problem: app.problem,
          solution: app.solution,
          targetMarket: app.targetMarket ?? app.target_market,
          marketSize: app.marketSize ?? app.market_size,
          pitch: app.pitch || "",
          currentStatus: app.currentStatus ?? app.current_status,
          traction: app.traction,
          teamBackground: app.teamBackground ?? app.team_background,
          socialLinks: app.socialLinks ?? app.social_links,
          previousExperience: app.previousExperience ?? app.previous_experience,
          askAmount: askNum,
          useOfFunds: app.useOfFunds ?? app.use_of_funds,
          revenueModel: app.revenueModel ?? app.revenue_model,
          status: statusMap[statusTag] || "Submitted",
          milestones,
        };
      });

      if (myApps.length > 0 && myApps[0].status === "Approved") {
        try {
          const escrowClient = getEscrowClient(address);
          const camp = await escrowClient.get_campaign({
            campaign_id: myApps[0].id,
          });
          const state = (camp.result as { state?: { tag?: string } })?.state
            ?.tag;
          if (state === "Released") {
            myApps[0].milestones = myApps[0].milestones.map((m) => ({
              ...m,
              released: true,
            }));
          }
        } catch {
          // Escrow may not be open yet
        }
      }

      setApplications(myApps);

      if (myApps[0]) {
        try {
          const votesRaw = await fetchApplicationVotes(myApps[0].id);
          setVotes(
            votesRaw.map((v) => ({
              voter: v.voter || "",
              approve: !!v.approve,
              commentHash: "",
              timestamp: Number(v.timestamp || 0),
            })),
          );
        } catch {
          setVotes([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleReleaseMilestone = async (index: number) => {
    if (!address) return;
    const campaignId = applications[0]?.id;
    if (campaignId == null) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const escrow = getEscrowClient(address);
      try {
        await buildSignSubmit(
          () => escrow.jury_approved({ campaign_id: campaignId }),
          (xdr) =>
            signTransaction(xdr, {
              networkPassphrase: getNetworkConfig().networkPassphrase,
            }),
        );
      } catch {
        // already approved or not ready — continue to release
      }

      const result = await buildSignSubmit(
        () => escrow.release({ campaign_id: campaignId }),
        (xdr) =>
          signTransaction(xdr, {
            networkPassphrase: getNetworkConfig().networkPassphrase,
          }),
      );

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Funds Released",
        description: `Campaign #${campaignId} funds released from escrow (milestone ${index + 1}).`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      fetchApplications();
    } catch (err: any) {
      setTxStatus("error");
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : msg || "Failed to release milestone"
      );
      addToast({
        title: "Release Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : msg || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const handleSaveName = async () => {
    const name = editName.trim();
    if (!name || name.length < 2) {
      addToast({ title: "Invalid name", description: "Name must be at least 2 characters.", variant: "error" });
      return;
    }
    try {
      await completeProfile({ displayName: name, bio: user?.bio ?? undefined });
      await refreshUser();
      setEditingName(false);
      addToast({ title: "Name updated", variant: "success" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ title: "Failed to update name", description: msg, variant: "error" });
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Badge variant="warning"><Clock className="mr-1 h-3 w-3" /> Submitted</Badge>;
      case "UnderReview":
        return <Badge variant="default"><FileText className="mr-1 h-3 w-3" /> Under Review</Badge>;
      case "Approved":
        return <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "Rejected":
        return <Badge variant="danger"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to view your founder profile
            </h2>
            <p className="text-text-secondary">
              Use the &quot;Connect Wallet&quot; button in the navbar to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {txStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent>
            <TransactionStatus status={txStatus} txHash={txHash} error={txError} />
          </CardContent>
        </Card>
      )}

      {/* Founder Profile Header */}
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-mint/20 to-accent/20 flex items-center justify-center shrink-0 border border-white/10">
              <User className="h-10 w-10 text-mint" />
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="max-w-xs"
                    onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveName}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditingName(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {user?.displayName || "Founder"}
                  </h1>
                  <button
                    onClick={() => { setEditName(user?.displayName || ""); setEditingName(true); }}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    title="Edit name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                </div>
              )}
              {user?.bio && (
                <p className="text-text-secondary mt-1">{user.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-text-muted">
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono">{formatAddress(address)}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Founder
                </Badge>
                {applications[0] && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Application #{applications[0].id}
                  </Badge>
                )}
              </div>
            </div>
            {applications.length === 0 && (
              <Link href="/startup/apply">
                <Button>Apply for Funding</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-mint/10 p-2">
              <FileText className="h-5 w-5 text-mint" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Applications</p>
              <p className="text-lg font-bold text-text-primary">{applications.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-accent/10 p-2">
              <Coins className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Ask</p>
              <p className="text-lg font-bold text-text-primary">
                {applications.length > 0 ? `${formatXLM(applications[0].askAmount)} XLM` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-warning/10 p-2">
              <Users2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Votes Cast</p>
              <p className="text-lg font-bold text-text-primary">{votes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Application Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Submit your first funding application to get started.
            </p>
            <Link href="/startup/apply">
              <Button>Apply for Funding</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="application" className="space-y-6">
          <TabsList>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="votes">Jury Feedback ({votes.length})</TabsTrigger>
            {applications[0]?.status === "Approved" && (
              <TabsTrigger value="campaign">Campaign</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="application" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {applications[0].logoUrl ? (
                      <img
                        src={applications[0].logoUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-card-hover flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-text-muted" />
                      </div>
                    )}
                    <div>
                      <CardTitle>{applications[0].name}</CardTitle>
                      {applications[0].tagline && (
                        <p className="text-sm text-text-secondary mt-0.5">
                          {applications[0].tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {applications[0].website && (
                      <a
                        href={applications[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {statusBadge(applications[0].status)}
                  </div>
                </div>
                <CardDescription>
                  Application #{applications[0].id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Overview badges */}
                <div className="flex flex-wrap gap-2">
                  {applications[0].category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {applications[0].category}
                    </Badge>
                  )}
                  {applications[0].stage && (
                    <Badge variant="secondary">{applications[0].stage}</Badge>
                  )}
                  {applications[0].revenueModel && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {applications[0].revenueModel}
                    </Badge>
                  )}
                </div>

                {/* Problem & Solution */}
                {(applications[0].problem || applications[0].solution) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {applications[0].problem && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-text-muted">
                          <Lightbulb className="h-4 w-4" />
                          Problem
                        </div>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">
                          {applications[0].problem}
                        </p>
                      </div>
                    )}
                    {applications[0].solution && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-text-muted">
                          <Zap className="h-4 w-4" />
                          Solution
                        </div>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">
                          {applications[0].solution}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Market info */}
                {(applications[0].targetMarket || applications[0].marketSize) && (
                  <div className="flex flex-wrap gap-6 text-sm">
                    {applications[0].targetMarket && (
                      <div>
                        <span className="text-text-muted">Target Market: </span>
                        <span className="text-text-primary">{applications[0].targetMarket}</span>
                      </div>
                    )}
                    {applications[0].marketSize && (
                      <div>
                        <span className="text-text-muted">Market Size: </span>
                        <span className="text-text-primary">{applications[0].marketSize}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Detailed Pitch */}
                <div>
                  <p className="text-sm text-text-muted mb-1">Detailed Description</p>
                  <p className="text-text-primary whitespace-pre-wrap">{applications[0].pitch}</p>
                </div>

                {/* Current Status & Traction */}
                {(applications[0].currentStatus || applications[0].traction) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {applications[0].currentStatus && (
                      <div>
                        <p className="text-sm text-text-muted mb-0.5">Current Status</p>
                        <p className="text-sm text-text-primary">{applications[0].currentStatus}</p>
                      </div>
                    )}
                    {applications[0].traction && (
                      <div>
                        <p className="text-sm text-text-muted mb-0.5">Traction & Metrics</p>
                        <p className="text-sm text-text-primary">{applications[0].traction}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Team */}
                {(applications[0].teamBackground || applications[0].socialLinks || applications[0].previousExperience) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Users2 className="h-4 w-4" />
                      Team
                    </div>
                    {applications[0].teamBackground && (
                      <p className="text-sm text-text-primary whitespace-pre-wrap">
                        {applications[0].teamBackground}
                      </p>
                    )}
                    {applications[0].socialLinks && (
                      <p className="text-xs text-text-muted break-all">
                        {applications[0].socialLinks}
                      </p>
                    )}
                    {applications[0].previousExperience && (
                      <p className="text-sm text-text-secondary whitespace-pre-wrap">
                        {applications[0].previousExperience}
                      </p>
                    )}
                  </div>
                )}

                {/* Funding */}
                <div className="border-t border-border pt-4">
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-text-muted mb-1">Funding Ask</p>
                      <p className="text-2xl font-bold text-text-primary">
                        {formatXLM(applications[0].askAmount)} XLM
                      </p>
                    </div>
                    {applications[0].revenueModel && (
                      <div>
                        <p className="text-sm text-text-muted mb-1">Revenue Model</p>
                        <p className="text-sm text-text-primary">{applications[0].revenueModel}</p>
                      </div>
                    )}
                  </div>
                  {applications[0].useOfFunds && (
                    <div className="mb-4">
                      <p className="text-sm text-text-muted mb-1">Use of Funds</p>
                      <p className="text-sm text-text-primary whitespace-pre-wrap">
                        {applications[0].useOfFunds}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-text-muted mb-2">Milestones</p>
                    <div className="space-y-2">
                      {applications[0].milestones.map((ms, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md bg-background p-3">
                          <span className="text-sm text-text-primary">{ms.description}</span>
                          <span className="text-sm font-mono text-text-secondary">
                            {formatXLM(ms.amount)} XLM
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            {votes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-text-secondary">No votes cast yet.</p>
                </CardContent>
              </Card>
            ) : (
              votes.map((vote, i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {vote.approve ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-danger" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {vote.approve ? "Approved" : "Rejected"}
                          </p>
                          <p className="text-xs text-text-muted">
                            Juror: {formatAddress(vote.voter)}
                          </p>
                        </div>
                      </div>
                      {vote.timestamp > 0 && (
                        <span className="text-xs text-text-muted">
                          {new Date(vote.timestamp * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {applications[0]?.status === "Approved" && (
            <TabsContent value="campaign" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Milestone Progress</CardTitle>
                  <CardDescription>
                    Funds are released as milestones are completed. Each release triggers escrow transfer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications[0].milestones.map((ms, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-primary">
                          Milestone {i + 1}: {ms.description}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-text-secondary">
                            {formatXLM(ms.amount)} XLM
                          </span>
                          {ms.released ? (
                            <Badge variant="success">Released</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-card-hover overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            ms.released ? "bg-success" : "bg-accent/30"
                          }`}
                          style={{ width: ms.released ? "100%" : "0%" }}
                        />
                      </div>
                      {!ms.released && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReleaseMilestone(i)}
                          disabled={txStatus !== "idle"}
                        >
                          <Lock className="mr-1.5 h-3 w-3" />
                          Release Milestone {i + 1}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
