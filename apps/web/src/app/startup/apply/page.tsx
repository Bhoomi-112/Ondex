"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/providers/wallet";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionStatus } from "@/components/ui/transaction-status";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPlatformClient } from "@/lib/contracts";
import { submitTransaction, getExplorerUrl } from "@/lib/tx";
import { Networks } from "@stellar/stellar-sdk";

interface MilestoneInput {
  description: string;
  amount: string;
}

export default function ApplyPage() {
  const router = useRouter();
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [pitch, setPitch] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { description: "", amount: "" },
  ]);
  const [maskName, setMaskName] = useState(true);
  const [maskAddress, setMaskAddress] = useState(true);
  const [txStatus, setTxStatus] = useState<"idle" | "signing" | "submitting" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();

  const addMilestone = () => {
    setMilestones([...milestones, { description: "", amount: "" }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    const totalMilestoneAmount = milestones.reduce(
      (sum, ms) => sum + (parseFloat(ms.amount) || 0),
      0
    );
    const askAmountNum = parseFloat(askAmount) || 0;

    if (Math.abs(totalMilestoneAmount - askAmountNum) > 0.0000001) {
      addToast({
        title: "Validation Error",
        description: "Milestone amounts must sum to the total ask amount.",
        variant: "error",
      });
      return;
    }

    setTxStatus("signing");
    setTxError(undefined);

    try {
      const platform = getPlatformClient();

      const milestoneAmounts = milestones.map((ms) =>
        BigInt(Math.round(parseFloat(ms.amount) * 10_000_000))
      );

      const tx = await platform.submit_application({
        startup: address,
        name: companyName,
        pitch: pitch,
        ask_amount: BigInt(Math.round(askAmountNum * 10_000_000)),
        milestones: milestones.map((ms, i) => ({
          description: ms.description,
          amount: milestoneAmounts[i],
        })),
        mask_name: maskName,
        mask_address: maskAddress,
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
        title: "Application Submitted",
        description: `Your application "${companyName}" is now on-chain.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      setTimeout(() => router.push("/startup"), 2000);
    } catch (err: any) {
      setTxStatus("error");
      setTxError(err.message || "Transaction failed");
      addToast({
        title: "Transaction Failed",
        description: err.message || "Failed to submit application",
        variant: "error",
      });
    }
  };

  if (!address) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Connect your wallet to apply
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/startup" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Apply for Funding</h1>
        <p className="text-text-secondary mt-1">
          Submit your application to the Ondex platform for jury review.
        </p>
      </div>

      {txStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent>
            <TransactionStatus status={txStatus} txHash={txHash} error={txError} />
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Basic information about your startup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pitch">Pitch Description</Label>
              <textarea
                id="pitch"
                placeholder="Describe your project, its value proposition, and how you'll use the funding..."
                className="input min-h-[120px] resize-y"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="askAmount">Total Funding Ask (XLM)</Label>
              <Input
                id="askAmount"
                type="number"
                step="0.0000001"
                min="0"
                placeholder="e.g. 50000"
                value={askAmount}
                onChange={(e) => setAskAmount(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>
              Define deliverables and their funding amounts. Total must equal your ask.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map((ms, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr,120px] gap-3">
                  <Input
                    placeholder={`Milestone ${i + 1} description`}
                    value={ms.description}
                    onChange={(e) => updateMilestone(i, "description", e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    step="0.0000001"
                    min="0"
                    placeholder="XLM"
                    value={ms.amount}
                    onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                    required
                  />
                </div>
                {milestones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(i)}
                    className="text-text-muted hover:text-danger shrink-0 mt-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addMilestone} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control what jurors see about your identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maskName}
                onChange={(e) => setMaskName(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">Mask company name</p>
                <p className="text-xs text-text-muted">Jurors see your pitch but not your company name</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maskAddress}
                onChange={(e) => setMaskAddress(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">Mask wallet address</p>
                <p className="text-xs text-text-muted">Jurors cannot see your wallet address during review</p>
              </div>
            </label>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={txStatus === "signing" || txStatus === "submitting" || txStatus === "confirming"}>
          {txStatus === "signing" || txStatus === "submitting" || txStatus === "confirming"
            ? "Processing..."
            : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
