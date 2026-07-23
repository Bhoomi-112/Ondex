"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionStatus } from "@/components/ui/transaction-status";
import {
  Shield,
  Wallet,
  TrendingUp,
  Clock,
  Coins,
  CheckCircle2,
  ArrowRight,
  Ban,
  ThumbsUp,
  ThumbsDown,
  Gavel,
} from "lucide-react";
import { formatXLM, stroopsToXLM, formatAddress } from "@/lib/utils";
import { fetchCampaigns, type ApiCampaign } from "@/lib/api";
import { getEscrowClient, getNetworkConfig, xlmToStroops } from "@/lib/contracts";
import { buildSignSubmit, getExplorerUrl } from "@/lib/tx";

type EscrowState =
  | { tag: "Active" }
  | { tag: "JuryApproved" }
  | { tag: "DisputeOpen" }
  | { tag: "Released" }
  | { tag: "Refunded" };

type OnChainCampaign = {
  state: EscrowState;
  total_amount: bigint;
  dispute_deadline: bigint;
  dispute_window_secs: bigint;
  startup: string;
  asset: string;
  approved_at: bigint;
  created_at: bigint;
};

function stateLabel(s: EscrowState): string {
  switch (s.tag) {
    case "Active": return "Active";
    case "JuryApproved": return "Jury Approved";
    case "DisputeOpen": return "Dispute Open";
    case "Released": return "Released";
    case "Refunded": return "Refunded";
  }
}

function stateVariant(s: EscrowState): "warning" | "success" | "danger" | "secondary" | "default" {
  switch (s.tag) {
    case "Active": return "warning";
    case "JuryApproved": return "default";
    case "DisputeOpen": return "danger";
    case "Released": return "success";
    case "Refunded": return "secondary";
  }
}

function StateIcon({ state }: { state: EscrowState }) {
  switch (state.tag) {
    case "Active": return <Clock className="h-4 w-4" />;
    case "JuryApproved": return <CheckCircle2 className="h-4 w-4" />;
    case "DisputeOpen": return <Gavel className="h-4 w-4" />;
    case "Released": return <ArrowRight className="h-4 w-4" />;
    case "Refunded": return <Ban className="h-4 w-4" />;
  }
}

export default function InvestorDashboard() {
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [onChain, setOnChain] = useState<Record<number, OnChainCampaign>>({});
  const [deposits, setDeposits] = useState<Record<number, bigint>>({});
  const [depositModal, setDepositModal] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchCampaigns();
      setCampaigns(items);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!address || campaigns.length === 0) return;
    const escrow = getEscrowClient(address);
    (async () => {
      const stateMap: Record<number, OnChainCampaign> = {};
      const depositMap: Record<number, bigint> = {};
      for (const camp of campaigns) {
        const cid = (camp.campaignId ?? camp.id ?? 0) as number;
        try {
          const onC = await escrow.get_campaign({ campaign_id: cid });
          stateMap[cid] = onC.result;
        } catch { /* not created yet */ }
        try {
          const dep = await escrow.get_deposit({ campaign_id: cid, investor: address });
          const amt = typeof dep.result === "bigint" ? dep.result : BigInt(String(dep.result));
          if (amt > 0n) depositMap[cid] = amt;
          else depositMap[cid] = 0n;
        } catch {
          depositMap[cid] = 0n;
        }
      }
      setOnChain(stateMap);
      setDeposits(depositMap);
    })();
  }, [address, campaigns]);

  const activeCamps = campaigns.filter((c) => {
    const state = onChain[c.campaignId ?? c.id ?? 0];
    if (!state) return true;
    return state.state.tag === "Active";
  });

  const juryApprovedCamps = campaigns.filter((c) => {
    const state = onChain[c.campaignId ?? c.id ?? 0];
    return state?.state.tag === "JuryApproved";
  });

  const disputeOpenCamps = campaigns.filter((c) => {
    const state = onChain[c.campaignId ?? c.id ?? 0];
    return state?.state.tag === "DisputeOpen";
  });

  const closedCamps = campaigns.filter((c) => {
    const state = onChain[c.campaignId ?? c.id ?? 0];
    return state?.state.tag === "Released" || state?.state.tag === "Refunded";
  });

  const handleDeposit = async () => {
    if (!address || depositModal === null) return;
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      addToast({ title: "Invalid amount", variant: "error" });
      return;
    }
    setTxStatus("signing");
    setTxError(undefined);
    try {
      const escrow = getEscrowClient(address);
      const result = await buildSignSubmit(
        () => escrow.deposit({
          campaign_id: depositModal,
          investor: address,
          amount: xlmToStroops(amount),
        }),
        (xdr) => signTransaction(xdr, { networkPassphrase: getNetworkConfig().networkPassphrase }),
      );
      setTxHash(result.hash);
      setTxStatus("success");
      addToast({
        title: "Deposit submitted",
        description: `${amount} XLM deposited into campaign #${depositModal}`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });
      setDepositModal(null);
      setDepositAmount("");
      fetchData();
    } catch (err: unknown) {
      setTxStatus("error");
      const msg = err instanceof Error ? err.message : String(err);
      setTxError(msg);
      addToast({ title: "Deposit failed", description: msg, variant: "error" });
    }
  };

  const handleDispute = async (campaignId: number) => {
    if (!address) return;
    setTxStatus("signing");
    try {
      const escrow = getEscrowClient(address);
      const result = await buildSignSubmit(
        () => escrow.dispute({ campaign_id: campaignId, disputer: address }),
        (xdr) => signTransaction(xdr, { networkPassphrase: getNetworkConfig().networkPassphrase }),
      );
      setTxHash(result.hash);
      setTxStatus("success");
      addToast({
        title: "Dispute raised",
        description: `Dispute opened for campaign #${campaignId}`,
        variant: "warning",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });
      fetchData();
    } catch (err: unknown) {
      setTxStatus("error");
      addToast({ title: "Dispute failed", description: String(err), variant: "error" });
    }
  };

  const handleInvestorVote = async (campaignId: number, approve: boolean) => {
    if (!address) return;
    setTxStatus("signing");
    try {
      const escrow = getEscrowClient(address);
      const result = await buildSignSubmit(
        () => escrow.investor_vote({ campaign_id: campaignId, investor: address, approve }),
        (xdr) => signTransaction(xdr, { networkPassphrase: getNetworkConfig().networkPassphrase }),
      );
      setTxHash(result.hash);
      setTxStatus("success");
      addToast({
        title: approve ? "Voted to release" : "Voted to refund",
        description: `Campaign #${campaignId}`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });
      fetchData();
    } catch (err: unknown) {
      setTxStatus("error");
      addToast({ title: "Vote failed", description: String(err), variant: "error" });
    }
  };

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to access the Investor Dashboard
            </h2>
            <p className="text-text-secondary">
              Browse campaigns, deposit into startups, and vote on disputes.
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
          <Shield className="h-6 w-6" />
          Investor Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Deposit, dispute, and vote — all on-chain via Soroban escrow.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="success" className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Verified Investor
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-text-muted">
            <Wallet className="h-4 w-4" />
            <span className="font-mono">{formatAddress(address)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-mint/10 p-2">
              <Coins className="h-5 w-5 text-mint" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Active</p>
              <p className="text-lg font-bold text-text-primary">{activeCamps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-lavender/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-lavender" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Jury Approved</p>
              <p className="text-lg font-bold text-text-primary">{juryApprovedCamps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-danger/10 p-2">
              <Gavel className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Dispute Open</p>
              <p className="text-lg font-bold text-text-primary">{disputeOpenCamps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <div className="rounded-md bg-accent/10 p-2">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Closed</p>
              <p className="text-lg font-bold text-text-primary">{closedCamps.length}</p>
            </div>
          </CardContent>
        </Card>
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
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Coins className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Campaigns Available
            </h3>
            <p className="text-text-secondary mb-4">
              There are no open funding campaigns at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {[...activeCamps, ...juryApprovedCamps, ...disputeOpenCamps, ...closedCamps].map((camp) => {
            const cid = (camp.campaignId ?? camp.id ?? 0) as number;
            const chain = onChain[cid];
            const dep = deposits[cid];
            const state = chain?.state;

            return (
              <Card key={cid}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate">
                        {camp.name || `Campaign #${cid}`}
                      </CardTitle>
                      <CardDescription>
                        {camp.startup ? `Startup: ${formatAddress(camp.startup)}` : `ID: ${cid}`}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {state && (
                        <Badge variant={stateVariant(state)} className="flex items-center gap-1">
                          <StateIcon state={state} />
                          {stateLabel(state)}
                        </Badge>
                      )}
                      {!state && <Badge variant="secondary">No escrow</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {camp.pitch && (
                    <p className="text-sm text-text-secondary line-clamp-2">{camp.pitch}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    {camp.goal && (
                      <div>
                        <span className="text-text-muted">Goal: </span>
                        <span className="font-medium text-text-primary">
                          {formatXLM(Number(camp.goal))} XLM
                        </span>
                      </div>
                    )}
                    {(camp.totalDeposited || camp.total_deposited || chain) && (
                      <div>
                        <span className="text-text-muted">Total deposited: </span>
                        <span className="font-medium text-text-primary">
                          {chain
                            ? `${formatXLM(stroopsToXLM(chain.total_amount))} XLM`
                            : `${formatXLM(Number(camp.totalDeposited ?? camp.total_deposited ?? 0))} XLM`}
                        </span>
                      </div>
                    )}
                    {dep !== undefined && dep > 0n && (
                      <div>
                        <span className="text-text-muted">Your deposit: </span>
                        <span className="font-medium text-mint">
                          {formatXLM(stroopsToXLM(dep))} XLM
                        </span>
                      </div>
                    )}
                    {chain && chain.dispute_window_secs > 0n && (
                      <div>
                        <span className="text-text-muted">Dispute window: </span>
                        <span className="font-medium text-text-primary">
                          {Number(chain.dispute_window_secs)}s
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons per state */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(!state || state.tag === "Active") && (
                      <Button
                        size="sm"
                        onClick={() => { setDepositModal(cid); setDepositAmount(""); }}
                        disabled={txStatus !== "idle"}
                      >
                        <Coins className="mr-1 h-4 w-4" />
                        Deposit
                      </Button>
                    )}

                    {state?.tag === "JuryApproved" && (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDispute(cid)}
                          disabled={txStatus !== "idle"}
                        >
                          <Gavel className="mr-1 h-4 w-4" />
                          Raise Dispute
                        </Button>
                        <p className="text-xs text-text-muted self-center">
                          Dispute deadline: {chain ? new Date(Number(chain.dispute_deadline) * 1000).toLocaleString() : "—"}
                        </p>
                      </>
                    )}

                    {state?.tag === "DisputeOpen" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleInvestorVote(cid, true)}
                          disabled={txStatus !== "idle"}
                        >
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          Vote Release
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleInvestorVote(cid, false)}
                          disabled={txStatus !== "idle"}
                        >
                          <ThumbsDown className="mr-1 h-4 w-4" />
                          Vote Refund
                        </Button>
                      </>
                    )}

                    {state?.tag === "Released" && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Released to startup
                      </Badge>
                    )}
                    {state?.tag === "Refunded" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Ban className="h-3 w-3" />
                        Refunded
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Deposit Modal */}
      {depositModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Deposit into Campaign #{depositModal}</CardTitle>
              <CardDescription>
                Funds are locked in the Soroban escrow contract. They release only
                on jury approval + dispute window expiry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Amount (XLM)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  min="1"
                  step="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 100"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || txStatus !== "idle"}
                >
                  {txStatus !== "idle" ? "Processing..." : "Confirm Deposit"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDepositModal(null)}
                  disabled={txStatus !== "idle"}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-text-muted text-center">
                You will sign a transaction via your Stellar wallet.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
