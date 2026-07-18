"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatus } from "@/components/ui/transaction-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { formatXLM, formatAddress, stellarExpertTxUrl } from "@/lib/utils";
import { PLATFORM_CONTRACT_ID, ESCROW_CONTRACT_ID } from "@/lib/contracts";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  pitch: string;
  askAmount: number;
  status: "Submitted" | "UnderReview" | "Approved" | "Rejected";
  milestones: { description: string; amount: number }[];
}

interface Vote {
  voter: string;
  approve: boolean;
  commentHash: string;
  timestamp: number;
}

interface Milestone {
  amount: number;
  released: boolean;
}

export default function StartupDashboard() {
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();

  const fetchApplications = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?startup=${address}`);
      const data = await res.json();
      setApplications(data.applications || []);

      if (data.applications?.[0]) {
        const votesRes = await fetch(`/api/applications/${data.applications[0].id}/votes`);
        const votesData = await votesRes.json();
        setVotes(votesData.votes || []);

        if (data.applications[0].status === "Approved") {
          const campRes = await fetch(`/api/campaigns?app_id=${data.applications[0].id}`);
          const campData = await campRes.json();
          if (campData.campaigns?.[0]) {
            const detailRes = await fetch(`/api/campaigns/${campData.campaigns[0].id}`);
            const detail = await detailRes.json();
            setMilestones(detail.milestones || []);
          }
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
            <TransactionStatus status={txStatus} txHash={txHash} />
          </CardContent>
        </Card>
      )}

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
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.length === 0 ? (
                    <p className="text-text-secondary">Campaign not yet created.</p>
                  ) : (
                    milestones.map((ms, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">
                            Milestone {i + 1}
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
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
