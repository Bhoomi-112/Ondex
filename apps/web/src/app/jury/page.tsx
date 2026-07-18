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
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Gavel,
} from "lucide-react";
import { formatXLM, formatAddress, timeAgo } from "@/lib/utils";
import { getPlatformClient } from "@/lib/contracts";
import { submitTransaction, getExplorerUrl } from "@/lib/tx";
import { Networks } from "@stellar/stellar-sdk";

interface Application {
  id: number;
  name: string;
  pitch: string;
  askAmount: number;
  status: "Submitted" | "UnderReview" | "Approved" | "Rejected";
  maskName: boolean;
  maskAddress: boolean;
  milestones: { description: string; amount: number }[];
}

interface VoteRecord {
  appId: number;
  approve: boolean;
  timestamp: number;
}

export default function JuryDashboard() {
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [myVotes, setMyVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, votesRes] = await Promise.all([
        fetch("/api/jury/applications"),
        address
          ? fetch(`/api/jury/my-votes/${address}`)
          : Promise.resolve(new Response(JSON.stringify({ votes: [] }))),
      ]);

      const appsData = await appsRes.json();
      const votesData = await votesRes.json();

      setApplications(appsData.applications || []);
      setMyVotes(votesData.votes || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVote = async (appId: number, approve: boolean) => {
    if (!address) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      const platform = getPlatformClient();

      const tx = await platform.cast_vote({
        voter: address,
        app_id: BigInt(appId),
        approve,
        comment_hash: approve ? "approved" : "rejected",
      });

      setTxStatus("submitting");

      const { signedTxXdr } = await signTransaction(tx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });

      setTxStatus("confirming");
      const result = await submitTransaction(signedTxXdr);

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Vote Recorded",
        description: `Your ${approve ? "approval" : "rejection"} has been recorded on-chain.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      fetchData();
    } catch (err: any) {
      setTxStatus("error");
      setTxError(err.message || "Failed to cast vote");
      addToast({
        title: "Vote Failed",
        description: err.message || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const displayApp = (app: Application) => {
    return {
      name: app.maskName ? "Anonymous Startup" : app.name,
      address: app.maskAddress ? "Hidden" : formatAddress(app.id.toString()),
      pitch: app.pitch,
      askAmount: app.askAmount,
      milestones: app.milestones,
    };
  };

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to access the Jury Dashboard
            </h2>
            <p className="text-text-secondary">
              Only registered jurors can review applications and cast votes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Gavel className="h-6 w-6" />
          Jury Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Review applications and cast binding votes on-chain.
        </p>
      </div>

      {txStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent>
            <TransactionStatus status={txStatus} txHash={txHash} error={txError} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({applications.filter((a) => a.status === "Submitted" || a.status === "UnderReview").length})
          </TabsTrigger>
          <TabsTrigger value="history">
            My Votes ({myVotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : applications.filter((a) => a.status === "Submitted" || a.status === "UnderReview").length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  All Caught Up
                </h3>
                <p className="text-text-secondary">
                  No applications pending review at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            applications
              .filter((a) => a.status === "Submitted" || a.status === "UnderReview")
              .map((app) => {
                const displayed = displayApp(app);
                const alreadyVoted = myVotes.some((v) => v.appId === app.id);

                return (
                  <Card key={app.id} className={selectedApp?.id === app.id ? "border-accent" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{displayed.name}</CardTitle>
                            {(app.maskName || app.maskAddress) && (
                              <Badge variant="secondary" className="text-xs">
                                {app.maskName && <EyeOff className="mr-1 h-3 w-3" />}
                                Masked
                              </Badge>
                            )}
                          </div>
                          <CardDescription>Application #{app.id}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.status === "Submitted" ? (
                            <Badge variant="warning"><Clock className="mr-1 h-3 w-3" /> New</Badge>
                          ) : (
                            <Badge variant="default"><Eye className="mr-1 h-3 w-3" /> Under Review</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-text-muted mb-1">Pitch</p>
                        <p className="text-text-primary">{displayed.pitch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted mb-1">Funding Ask</p>
                        <p className="text-2xl font-bold text-text-primary">
                          {formatXLM(displayed.askAmount)} XLM
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted mb-2">Milestones</p>
                        <div className="space-y-2">
                          {displayed.milestones.map((ms, i) => (
                            <div key={i} className="flex items-center justify-between rounded-md bg-background p-3">
                              <span className="text-sm text-text-primary">{ms.description}</span>
                              <span className="text-sm font-mono text-text-secondary">
                                {formatXLM(ms.amount)} XLM
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        {alreadyVoted ? (
                          <Badge variant="secondary" className="px-4 py-1.5">
                            Already Voted
                          </Badge>
                        ) : (
                          <>
                            <Button
                              variant="success"
                              onClick={() => handleVote(app.id, true)}
                              disabled={txStatus !== "idle"}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleVote(app.id, false)}
                              disabled={txStatus !== "idle"}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {myVotes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-text-secondary">You haven&apos;t voted yet.</p>
              </CardContent>
            </Card>
          ) : (
            myVotes.map((vote, i) => (
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
                          Application #{vote.appId}
                        </p>
                        <p className="text-xs text-text-muted">
                          {vote.approve ? "Approved" : "Rejected"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">
                      {timeAgo(vote.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
