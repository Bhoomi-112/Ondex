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
  ShieldCheck,
  Rocket,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { formatXLM, stroopsToXLM, formatAddress, timeAgo } from "@/lib/utils";
import { getPlatformClient, getEscrowClient, ESCROW_CONTRACT_ID } from "@/lib/contracts";
import { buildSignSubmit, getExplorerUrl } from "@/lib/tx";
import { Networks } from "@stellar/stellar-sdk";

interface Application {
  id: number;
  name: string;
  pitch: string;
  askAmount: number;
  status: "Submitted" | "UnderReview" | "Approved" | "Rejected";
  maskName: boolean;
  maskAddress: boolean;
  startup: string;
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
  const [isJuror, setIsJuror] = useState<boolean | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [myVotes, setMyVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const safeJson = async (res: Response) => {
    if (!res.ok) return null;
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const client = getPlatformClient(address || undefined);

      if (address) {
        try {
          const jurorResult = await client.is_juror({ juror: address });
          setIsJuror(jurorResult.result);
        } catch {
          setIsJuror(false);
        }
      }

      const appsResult = await client.list_applications({ offset: BigInt(0), limit: BigInt(100) });
      const rawApps = appsResult.result;

      const mapped: Application[] = rawApps.map((app: any) => {
        const statusMap: Record<string, Application["status"]> = {
          Submitted: "Submitted",
          UnderReview: "UnderReview",
          Approved: "Approved",
          Rejected: "Rejected",
        };
        const statusTag = app.status?.tag || "Submitted";

        const milestones = app.milestones?.map((m: any, i: number) => ({
          description: m.description || `Milestone ${i + 1}`,
          amount: stroopsToXLM(m.amount),
        })) || [];

        return {
          id: Number(app.id),
          name: app.name || "Anonymous",
          pitch: app.pitch || "",
          askAmount: stroopsToXLM(app.ask_amount),
          status: statusMap[statusTag] || "Submitted",
          maskName: app.mask_name ?? true,
          maskAddress: app.mask_address ?? true,
          startup: app.startup || "",
          milestones,
        };
      });

      setAllApplications(mapped);
      setApplications(mapped.filter(a => a.status === "Submitted" || a.status === "UnderReview"));

      const votesForMe: VoteRecord[] = [];
      if (address) {
        for (const app of mapped) {
          try {
            const votesResult = await client.get_votes({ app_id: BigInt(app.id) });
            const votes = votesResult.result || [];
            for (const v of votes) {
              if (v.voter === address) {
                votesForMe.push({
                  appId: app.id,
                  approve: v.approve,
                  timestamp: Number(v.timestamp),
                });
              }
            }
          } catch {
            // vote fetch may fail for some apps
          }
        }
      }
      setMyVotes(votesForMe);
    } catch (err) {
      console.error("Failed to fetch applications from chain:", err);
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
      setTxStatus("submitting");
      const result = await buildSignSubmit(
        () => getPlatformClient(address).cast_vote({
          voter: address,
          app_id: BigInt(appId),
          approve,
          comment_hash: approve ? "approved" : "rejected",
        }),
        (xdr) => signTransaction(xdr, { networkPassphrase: Networks.TESTNET }),
      );

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
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : msg || "Failed to cast vote"
      );
      addToast({
        title: "Vote Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : msg || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const handleApproveApplication = async (appId: number) => {
    if (!address) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const result = await buildSignSubmit(
        () => getPlatformClient(address).approve_application({
          app_id: BigInt(appId),
        }),
        (xdr) => signTransaction(xdr, { networkPassphrase: Networks.TESTNET }),
      );

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Application Approved",
        description: `Application #${appId} has been approved on-chain.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      fetchData();
    } catch (err: any) {
      setTxStatus("error");
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : msg || "Failed to approve application"
      );
      addToast({
        title: "Approval Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : msg || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const handleCreateCampaign = async (app: Application) => {
    if (!address) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const result = await buildSignSubmit(
        () => getPlatformClient(address).create_campaign({
          app_id: BigInt(app.id),
          escrow_addr: ESCROW_CONTRACT_ID,
        }),
        (xdr) => signTransaction(xdr, { networkPassphrase: Networks.TESTNET }),
      );

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Campaign Created",
        description: `Escrow campaign created for Application #${app.id}. Investors can now deposit.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      fetchData();
    } catch (err: any) {
      setTxStatus("error");
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : msg || "Failed to create campaign"
      );
      addToast({
        title: "Campaign Creation Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : msg || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const handleRegisterJuror = async () => {
    if (!address) return;

    setTxStatus("signing");
    setTxError(undefined);

    try {
      setTxStatus("submitting");
      const result = await buildSignSubmit(
        () => getPlatformClient(address).register_juror({
          juror: address,
        }),
        (xdr) => signTransaction(xdr, { networkPassphrase: Networks.TESTNET }),
      );

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Juror Registered",
        description: "Your address has been registered as a juror on-chain.",
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      fetchData();
    } catch (err: any) {
      setTxStatus("error");
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      const isAuth = msg.includes("Unauthorized") || msg.includes("admin") || msg.includes("not authorized");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : isAuth
          ? "Only the contract admin can register jurors. Contact the platform admin."
          : msg || "Failed to register as juror"
      );
      addToast({
        title: "Registration Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : isAuth
            ? "Only the contract admin can register jurors."
            : msg || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const displayApp = (app: Application) => {
    return {
      name: app.maskName ? "Anonymous Startup" : app.name,
      address: app.maskAddress ? "Hidden" : formatAddress(app.startup || app.id.toString()),
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

  if (isJuror === false) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Not a Registered Juror
            </h2>
            <p className="text-text-secondary mb-6">
              Your wallet address is not registered as a juror on the Ondex platform.
              Only registered jurors can review applications and cast votes.
            </p>

            {txStatus !== "idle" && (
              <div className="mb-6">
                <TransactionStatus status={txStatus} txHash={txHash} error={txError} />
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleRegisterJuror}
                disabled={txStatus !== "idle"}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {txStatus !== "idle" ? "Processing..." : "Register as Juror (Admin)"}
              </Button>
              <p className="text-xs text-text-muted max-w-sm">
                This calls <code className="text-mint">register_juror</code> on the platform contract.
                Only the contract admin address can successfully execute this.
                If you&apos;re not the admin, ask them to register your address.
              </p>
            </div>
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
        {isJuror && (
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="success" className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              Registered Juror
            </Badge>
          </div>
        )}
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
            Pending Review ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({allApplications.filter(a => a.status === "Approved").length})
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
          ) : applications.length === 0 ? (
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
            applications.map((app) => {
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

        <TabsContent value="approved" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : allApplications.filter(a => a.status === "Approved").length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-text-secondary">No approved applications yet.</p>
              </CardContent>
            </Card>
          ) : (
            allApplications.filter(a => a.status === "Approved").map((app) => {
              const displayed = displayApp(app);

              return (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{displayed.name}</CardTitle>
                        <CardDescription>Application #{app.id}</CardDescription>
                      </div>
                      <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> Approved</Badge>
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
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="default"
                        onClick={() => handleCreateCampaign(app)}
                        disabled={txStatus !== "idle"}
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
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
