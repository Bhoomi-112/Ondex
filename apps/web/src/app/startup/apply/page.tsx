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
import { Plus, Trash2, ArrowLeft, Building2, Lightbulb, Zap, Users2, Coins, Eye } from "lucide-react";
import Link from "next/link";
import {
  getIdentityClient,
  getNetworkConfig,
  apiUrl,
  xlmToStroops,
} from "@/lib/contracts";
import { buildSignSubmit, getExplorerUrl } from "@/lib/tx";

interface MilestoneInput {
  description: string;
  amount: string;
}

const CATEGORIES = [
  "DeFi",
  "NFT",
  "Infrastructure",
  "DAO / Governance",
  "Gaming",
  "Social",
  "DePIN",
  "AI / ML",
  "Privacy",
  "Developer Tools",
  "Payments",
  "Other",
];

const STAGES = [
  "Idea",
  "Pre-seed",
  "Seed",
  "Series A",
  "Growth",
];

export default function ApplyPage() {
  const router = useRouter();
  const { address, signTransaction } = useWallet();
  const { addToast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");

  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [marketSize, setMarketSize] = useState("");

  const [pitch, setPitch] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [traction, setTraction] = useState("");

  const [teamBackground, setTeamBackground] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");

  const [askAmount, setAskAmount] = useState("");
  const [useOfFunds, setUseOfFunds] = useState("");
  const [revenueModel, setRevenueModel] = useState("");
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

    if (milestones.some((ms) => !ms.description.trim())) {
      addToast({
        title: "Validation Error",
        description: "Every milestone needs a description.",
        variant: "error",
      });
      return;
    }

    setTxStatus("signing");
    setTxError(undefined);

    try {
      const milestoneAmounts = milestones.map((ms) =>
        BigInt(Math.round(parseFloat(ms.amount) * 10_000_000))
      );

      setTxStatus("submitting");

      const encoder = new TextEncoder();
      const preimage = encoder.encode(
        `${address}:${companyName}:${pitch}:${Date.now()}`,
      );
      const hashBuf = new Uint8Array(
        await crypto.subtle.digest("SHA-256", preimage),
      );
      const identityBytes = hashBuf.slice(0, 16);
      const commitmentBytes = hashBuf;

      const result = await buildSignSubmit(
        () =>
          getIdentityClient(address).commit({
            identity_id: identityBytes as never,
            commitment_hash: commitmentBytes as never,
          }),
        (xdr) =>
          signTransaction(xdr, {
            networkPassphrase: getNetworkConfig().networkPassphrase,
          }),
      );

      let csrfToken = typeof document !== "undefined"
        ? document.cookie.split("; ").find((r) => r.startsWith("ondex_csrf="))?.split("=").slice(1).join("=")
        : undefined;
      if (!csrfToken) {
        try {
          const csrfRes = await fetch(apiUrl("/api/v1/auth/csrf"), { credentials: "include" });
          if (csrfRes.ok) {
            const csrfBody = await csrfRes.json() as { csrfToken?: string };
            csrfToken = csrfBody.csrfToken;
          }
        } catch { /* best effort */ }
      }

      const createRes = await fetch(apiUrl("/api/applications"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": decodeURIComponent(csrfToken) } : {}),
        },
        body: JSON.stringify({
          startup: address,
          name: companyName,
          tagline,
          website,
          logoUrl,
          category,
          stage,
          problem,
          solution,
          targetMarket,
          marketSize,
          pitch,
          currentStatus,
          traction,
          teamBackground,
          socialLinks,
          previousExperience,
          askAmount: xlmToStroops(askAmountNum).toString(),
          useOfFunds,
          revenueModel,
          maskName,
          maskAddress,
          milestones: milestones.map((ms, i) => ({
            description: ms.description,
            amount: milestoneAmounts[i].toString(),
          })),
        }),
      });

      if (!createRes.ok) {
        const errBody = await createRes.text();
        throw new Error(errBody || "Failed to store application metadata");
      }

      setTxHash(result.hash);
      setTxStatus("success");

      addToast({
        title: "Application Submitted",
        description: `Identity committed on-chain; "${companyName}" stored off-chain.`,
        variant: "success",
        txHash: result.hash,
        txUrl: getExplorerUrl(result.hash),
      });

      setTimeout(() => router.push("/startup"), 2000);
    } catch (err: any) {
      setTxStatus("error");
      const msg = err?.message || String(err);
      const isAccountMissing = msg.includes("Account not found") || msg.includes("404");
      setTxError(isAccountMissing
        ? "Your testnet account is not funded. Click 'Fund Testnet' in the navbar to get started."
        : msg || "Transaction failed"
      );
      addToast({
        title: "Transaction Failed",
        description: isAccountMissing
          ? "Account not found on testnet. Fund your wallet first."
          : msg || "Failed to submit application",
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/startup" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Apply for Funding</h1>
        <p className="text-text-secondary mt-1">
          Submit a comprehensive application for jury and investor review.
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

        {/* ─── Company Overview ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-text-secondary" />
              <CardTitle>Company Overview</CardTitle>
            </div>
            <CardDescription>Basic information about your startup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Short one-liner about your product"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category / Industry</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <select
                  id="stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select stage…</option>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Problem & Solution ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-text-secondary" />
              <CardTitle>Problem & Solution</CardTitle>
            </div>
            <CardDescription>What you&apos;re building and why it matters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problem">Problem</Label>
              <textarea
                id="problem"
                placeholder="What problem does your product solve? Who experiences it and why is it urgent?"
                className="input min-h-[100px] resize-y"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <textarea
                id="solution"
                placeholder="How does your product solve this problem? What makes your approach unique?"
                className="input min-h-[100px] resize-y"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  id="targetMarket"
                  placeholder="e.g. Web3 developers, DeFi users"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketSize">Market Size</Label>
                <Input
                  id="marketSize"
                  placeholder="e.g. TAM $5B, SAM $500M"
                  value={marketSize}
                  onChange={(e) => setMarketSize(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Product Details ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-text-secondary" />
              <CardTitle>Product Details</CardTitle>
            </div>
            <CardDescription>Detailed description of your product and current progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pitch">Detailed Description *</Label>
              <textarea
                id="pitch"
                placeholder="Describe your product in detail — features, architecture, user experience, roadmap..."
                className="input min-h-[140px] resize-y"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status</Label>
                <Input
                  id="currentStatus"
                  placeholder="e.g. MVP live, 500 users, pre-revenue"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traction">Traction & Metrics</Label>
                <Input
                  id="traction"
                  placeholder="e.g. 10k MAU, $20k MRR, 3 partnerships"
                  value={traction}
                  onChange={(e) => setTraction(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Team ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-text-secondary" />
              <CardTitle>Team</CardTitle>
            </div>
            <CardDescription>Background and experience of the founding team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamBackground">Team Background</Label>
              <textarea
                id="teamBackground"
                placeholder="Who is on the team? Previous companies, education, relevant experience..."
                className="input min-h-[100px] resize-y"
                value={teamBackground}
                onChange={(e) => setTeamBackground(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialLinks">Social Links</Label>
              <Input
                id="socialLinks"
                placeholder="Twitter / GitHub / LinkedIn / Discord links"
                value={socialLinks}
                onChange={(e) => setSocialLinks(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousExperience">Previous Experience</Label>
              <textarea
                id="previousExperience"
                placeholder="Relevant prior work, open-source contributions, hackathon wins, or other ventures..."
                className="input min-h-[80px] resize-y"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── Funding ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-text-secondary" />
              <CardTitle>Funding</CardTitle>
            </div>
            <CardDescription>
              Funding request, allocation, and milestone breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="askAmount">Total Funding Ask (XLM) *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="revenueModel">Revenue Model</Label>
                <Input
                  id="revenueModel"
                  placeholder="e.g. Subscription, transaction fees, token"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="useOfFunds">Use of Funds</Label>
              <textarea
                id="useOfFunds"
                placeholder="How will you allocate the funding? e.g. 40% engineering, 30% marketing, 20% operations, 10% legal"
                className="input min-h-[80px] resize-y"
                value={useOfFunds}
                onChange={(e) => setUseOfFunds(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Milestones *</Label>
              <p className="text-xs text-text-muted">
                Define deliverables and their funding amounts. Total must equal your ask.
              </p>
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
            </div>
          </CardContent>
        </Card>

        {/* ─── Privacy Settings ─── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-text-secondary" />
              <CardTitle>Privacy Settings</CardTitle>
            </div>
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
