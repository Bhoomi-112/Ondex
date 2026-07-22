"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatus } from "@/components/ui/transaction-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, CheckCircle2, XCircle, Clock, FileText, Lock } from "lucide-react";
import { formatXLM, stroopsToXLM, formatAddress, stellarExpertTxUrl } from "@/lib/utils";
import { getPlatformClient, getEscrowClient } from "@/lib/contracts";
import { buildSignSubmit, getExplorerUrl } from "@/lib/tx";
import { Networks } from "@stellar/stellar-sdk";
import Link from "next/link";
import { useCoachMarks } from "@/hooks/use-coach-marks";
import { CoachMark } from "@/components/ui/coach-mark";
import { EmptyState } from "@/components/ui/empty-state";

interface Application {
  id: number;
  name: string;
  pitch: string;
  askAmount: number;
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
  const { addToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const statsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const releaseRef = useRef<HTMLButtonElement>(null);

  const coach = useCoachMarks({
    storageKey: "startup_dashboard",
    steps: [
      {
        id: "stats",
        targetRef: statsRef,
        title: "Your Stats",
        description: "Track your applications, total ask, and jury votes at a glance.",
        position: "bottom",
      },
      {
        id: "tabs",
        targetRef: tabsRef,
        title: "Application Tabs",
        description: "Switch between Application details, Jury Feedback, and Campaign milestones.",
        position: "top",
      },
      {
        id: "release",
        targetRef: releaseRef,
        title: "Release Milestones",
        description: "Once jury-approved, click here to release escrow funds for completed milestones.",
        position: "left",
      },
    ],
    autoStart: true,
  });

  const fetchApplications = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const client = getPlatformClient(address);
      const appsResult = await client.list_applications({ offset: BigInt(0), limit: BigInt(100) });
      const rawApps = appsResult.result;

      const statusMap: Record<string, Application["status"]> = {
        Submitted: "Submitted",
        UnderReview: "UnderReview",
        Approved: "Approved",
        Rejected: "Rejected",
      };

      const myApps: Application[] = rawApps
        .filter((app: any) => app.startup === address)
        .map((app: any) => {
          const statusTag = app.status?.tag || "Submitted";
          const milestones = app.milestones?.map((m: any, i: number) => ({
            description: m.description || `Milestone ${i + 1}`,
            amount: stroopsToXLM(m.amount),
            released: false,
          })) || [];

          return {
            id: Number(app.id),
            name: app.name || "Anonymous",
            pitch: app.pitch || "",
            askAmount: stroopsToXLM(app.ask_amount),
            status: statusMap[statusTag] || "Submitted",
            milestones,
          };
        });

      if (myApps.length > 0 && myApps[0].status === "Approved") {
        try {
          const escrowClient = getEscrowClient(address);
          const milestoneCountResult = await escrowClient.get_milestone_count();
          const totalMilestones = Number(milestoneCountResult.result);

          const releasedCountResult = await escrowClient.get_released_count();
          const releasedCount = Number(releasedCountResult.result);

          const milestoneDetails = await Promise.allSettled(
            Array.from({ length: totalMilestones }, (_, i) =>
              escrowClient.get_milestone({ index: i })
            )
          );

          for (let i = 0; i < totalMilestones && i < myApps[0].milestones.length; i++) {
            const detail = milestoneDetails[i];
            if (detail.status === "fulfilled") {
              myApps[0].milestones[i].released = detail.status === "fulfilled" && (detail.value.result as any)?.released === true;
            }
          }
        } catch {
          // Escrow may not be initialized
        }
      }

      setApplications(myApps);

      if (myApps[0]) {
        try {
          const votesResult = await client.get_votes({ app_id: BigInt(myApps[0].id) });
          const votes = (votesResult.result || []).map((v: any) => ({
            voter: v.voter,
            approve: v.approve,
            commentHash: v.comment_hash || "",
            timestamp: Number(v.timestamp),
          }));
          setVotes(votes);
        } catch {
          setVotes([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applications from chain:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleReleaseMilestone = async (index: number) => {
    if (!address) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const result = await buildSignSubmit(
        () => getEscrowClient(address).release_milestone({ index }),
        (xdr) => signTransaction(xdr, { networkPassphrase: Networks.TESTNET }),
      );

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Milestone Released",
        description: `Milestone ${index + 1} funds have been released from escrow.`,
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
              Connect your wallet to view your startup dashboard
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Startup Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Manage your funding application and track milestone progress.
        </p>
      </div>

      {txStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent>
            <TransactionStatus status={txStatus} txHash={txHash} error={txError} />
          </CardContent>
        </Card>
      )}

<<<<<<< Updated upstream
=======
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
      <div ref={statsRef} className="grid gap-4 sm:grid-cols-3 mb-8">
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

>>>>>>> Stashed changes
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7 text-mint" />}
          title="No Application Yet"
          description="Submit your first funding application to get started. Jury will review it blind."
          actions={[{ label: "Apply for Funding", href: "/startup/apply" }]}
        />
      ) : (
        <Tabs defaultValue="application" className="space-y-6">
          <TabsList ref={tabsRef}>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="votes">Jury Feedback ({votes.length})</TabsTrigger>
            {applications[0]?.status === "Approved" && (
              <TabsTrigger value="campaign">Campaign</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="application" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{applications[0].name}</CardTitle>
                  {statusBadge(applications[0].status)}
                </div>
                <CardDescription>
                  Application #{applications[0].id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Pitch</p>
                  <p className="text-text-primary">{applications[0].pitch}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Funding Ask</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatXLM(applications[0].askAmount)} XLM
                  </p>
                </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            {votes.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-7 w-7 text-text-muted" />}
                title="No Votes Cast Yet"
                description="Jury members haven't voted on your application yet. Check back once they've reviewed it."
              />
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
                          ref={i === 0 ? releaseRef : undefined}
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

      {coach.isActive && coach.currentStepData && (
        <CoachMark
          isOpen={coach.isActive}
          onClose={coach.dismiss}
          onNext={coach.next}
          title={coach.currentStepData.title}
          description={coach.currentStepData.description}
          targetRef={coach.currentStepData.targetRef}
          position={coach.currentStepData.position}
          step={coach.currentStep ?? 0}
          totalSteps={coach.totalSteps}
        />
      )}
    </div>
  );
}
