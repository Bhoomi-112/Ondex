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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, TrendingUp, ExternalLink, Wallet } from "lucide-react";
import { formatXLM, formatAddress, stellarExpertTxUrl } from "@/lib/utils";
import { getEscrowClient } from "@/lib/contracts";
import { submitTransaction, getExplorerUrl } from "@/lib/tx";
import { Networks } from "@stellar/stellar-sdk";

interface Campaign {
  id: number;
  appId: number;
  goal: number;
  totalDeposited: number;
  status: string;
  milestones: { amount: number; released: boolean }[];
  myDeposit: number;
}

export default function InvestorDashboard() {
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myInvestments, setMyInvestments] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, mineRes] = await Promise.all([
        fetch("/api/campaigns"),
        address
          ? fetch(`/api/campaigns?investor=${address}`)
          : Promise.resolve(new Response(JSON.stringify({ campaigns: [] }))),
      ]);

      const allData = await allRes.json();
      const mineData = await mineRes.json();

      setCampaigns(allData.campaigns || []);
      setMyInvestments(mineData.campaigns || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDeposit = async () => {
    if (!address || !selectedCampaign || !depositAmount) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({ title: "Invalid amount", description: "Please enter a valid XLM amount.", variant: "error" });
      return;
    }

    setTxStatus("signing");
    setTxError(undefined);

    try {
      const escrow = getEscrowClient();

      const tx = await escrow.deposit({
        investor: address,
        amount: BigInt(Math.round(amount * 10_000_000)),
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
        title: "Deposit Successful",
        description: `Deposited ${amount} XLM into Campaign #${selectedCampaign.id}`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      setDepositDialogOpen(false);
      setDepositAmount("");
      fetchCampaigns();
    } catch (err: any) {
      setTxStatus("error");
      setTxError(err.message || "Deposit failed");
      addToast({
        title: "Deposit Failed",
        description: err.message || "Transaction was rejected",
        variant: "error",
      });
    }
  };

  const totalInvested = myInvestments.reduce((sum, c) => sum + c.myDeposit, 0);

  if (!address) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to access the Investor Dashboard
            </h2>
            <p className="text-text-secondary">
              Browse approved campaigns and invest in the future of innovation.
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
          <Coins className="h-6 w-6" />
          Investor Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Browse approved campaigns and invest via Soroban escrow contracts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-accent/10 p-2">
                <Coins className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Invested</p>
                <p className="text-lg font-bold text-text-primary">{formatXLM(totalInvested)} XLM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Active Campaigns</p>
                <p className="text-lg font-bold text-text-primary">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-warning/10 p-2">
                <Wallet className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">My Campaigns</p>
                <p className="text-lg font-bold text-text-primary">{myInvestments.length}</p>
              </div>
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

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Campaigns</TabsTrigger>
          <TabsTrigger value="portfolio">My Investments ({myInvestments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : campaigns.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Coins className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No Campaigns Available
                </h3>
                <p className="text-text-secondary">
                  Check back later for approved campaigns to invest in.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {campaigns.map((campaign) => {
                const progress = campaign.goal > 0 ? (campaign.totalDeposited / campaign.goal) * 100 : 0;
                const milestonesReleased = campaign.milestones?.filter((m) => m.released).length || 0;
                const milestonesTotal = campaign.milestones?.length || 0;

                return (
                  <Card key={campaign.id} className="hover:border-accent/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Campaign #{campaign.id}</CardTitle>
                          <CardDescription>Application #{campaign.appId}</CardDescription>
                        </div>
                        <Badge variant={campaign.status === "Active" ? "active" : "success"}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text-secondary">Progress</span>
                          <span className="text-text-primary font-mono">
                            {formatXLM(campaign.totalDeposited)} / {formatXLM(campaign.goal)} XLM
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-card-hover overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-muted mt-1">{progress.toFixed(1)}% funded</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Milestones</span>
                        <span className="text-text-primary">
                          {milestonesReleased}/{milestonesTotal} released
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setDepositDialogOpen(true);
                          }}
                          disabled={campaign.status !== "Active"}
                        >
                          Deposit
                        </Button>
                        <Button variant="secondary" size="icon" asChild>
                          <a
                            href={`https://stellar.expert/explorer/testnet/contract/${campaign.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          {myInvestments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-text-secondary">You haven&apos;t invested in any campaigns yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myInvestments.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-primary">
                          Campaign #{campaign.id}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Your deposit: {formatXLM(campaign.myDeposit)} XLM
                        </p>
                      </div>
                      <Badge variant={campaign.status === "Active" ? "active" : "success"}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to Campaign #{selectedCampaign?.id}</DialogTitle>
            <DialogDescription>
              Funds are locked in a Soroban escrow contract until milestones are completed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedCampaign && (
              <div className="rounded-md bg-background p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Goal</span>
                  <span className="text-text-primary">{formatXLM(selectedCampaign.goal)} XLM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Raised</span>
                  <span className="text-text-primary">{formatXLM(selectedCampaign.totalDeposited)} XLM</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (XLM)</Label>
              <Input
                id="deposit-amount"
                type="number"
                step="0.0000001"
                min="0"
                placeholder="Enter amount to deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDepositDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleDeposit}
                disabled={!depositAmount || txStatus !== "idle"}
              >
                {txStatus !== "idle" ? "Processing..." : "Confirm Deposit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
