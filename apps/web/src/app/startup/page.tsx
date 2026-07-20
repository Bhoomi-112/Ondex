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
import { ArrowUpRight, CheckCircle2, XCircle, Clock, FileText, Lock } from "lucide-react";
import { formatXLM, stroopsToXLM, formatAddress, stellarExpertTxUrl } from "@/lib/utils";
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
import Link from "next/link";

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
          pitch: app.pitch || "",
          askAmount: askNum,
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
      // Layered release: mark jury approved (if not yet), then release when window allows
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
