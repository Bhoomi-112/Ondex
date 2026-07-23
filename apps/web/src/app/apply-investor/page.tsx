"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { applyAsInvestor } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, Shield, Plus } from "lucide-react";

const ENTITY_TYPES = [
  "Individual",
  "Company",
  "Fund",
  "DAO",
  "Family Office",
];

const ACCREDITATION = [
  "Accredited Investor",
  "Non-Accredited",
  "Institutional",
  "Qualified Purchaser",
];

const SOURCE_OF_FUNDS = [
  "Earned Income",
  "Savings",
  "Inheritance",
  "Business Proceeds",
  "Investment Returns",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "New to Investing",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

const COMPANIES_INVESTED = ["0", "1–5", "6–20", "20+"];

const SECTORS = [
  "DeFi",
  "Infrastructure",
  "Gaming",
  "AI / ML",
  "Consumer",
  "Enterprise",
  "Social Impact",
  "Other",
];

const REFERRAL_SOURCES = [
  "Twitter / X",
  "Google Search",
  "Friend / Referral",
  "Event / Conference",
  "Newsletter",
  "Podcast",
  "Other",
];

export default function ApplyInvestorPage() {
  const { user, loginWithWallet, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role) {
      router.replace(user.role === "founder" ? "/startup" : user.role === "jury" ? "/jury" : "/investor");
    }
  }, [user, loading, router]);

  const [fullName, setFullName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [accreditation, setAccreditation] = useState("");
  const [aum, setAum] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [companiesInvested, setCompaniesInvested] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [investmentRange, setInvestmentRange] = useState("");
  const [previousPortfolio, setPreviousPortfolio] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector],
    );
  };

  const ensureAuth = async () => {
    if (user) return user;
    return loginWithWallet();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await ensureAuth();
      await applyAsInvestor({
        fullName,
        entityType: entityType || undefined,
        accreditation: accreditation || undefined,
        aum: aum || undefined,
        sourceOfFunds: sourceOfFunds || undefined,
        portfolioDesc: portfolioDesc || undefined,
        experienceLevel: experienceLevel || undefined,
        companiesInvested: companiesInvested || undefined,
        sectorFocus: selectedSectors.length > 0 ? selectedSectors : undefined,
        investmentRange: investmentRange || undefined,
        previousPortfolio: previousPortfolio || undefined,
        referralSource: referralSource || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-mint" />
              Application Submitted
            </CardTitle>
            <CardDescription>
              Your investor application is now pending admin review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">
              Our compliance team will review your application. You will gain
              investor dashboard access once approved.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button onClick={() => router.push("/login")}>
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-lavender" />
            Apply as Investor
          </CardTitle>
          <CardDescription>
            Submit your investor profile for compliance review. Only approved
            investors may deposit into campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {!user && !loading && (
              <p className="text-sm text-text-muted">
                You will sign a wallet challenge to authenticate before
                submitting.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                maxLength={200}
                placeholder="Legal name or entity name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type</Label>
              <select
                id="entityType"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select type…</option>
                {ENTITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accreditation">Accreditation Status</Label>
              <select
                id="accreditation"
                value={accreditation}
                onChange={(e) => setAccreditation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select status…</option>
                {ACCREDITATION.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aum">Assets Under Management</Label>
              <Input
                id="aum"
                value={aum}
                onChange={(e) => setAum(e.target.value)}
                maxLength={200}
                placeholder="e.g. $5M, $50M+"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceOfFunds">Source of Funds</Label>
              <select
                id="sourceOfFunds"
                value={sourceOfFunds}
                onChange={(e) => setSourceOfFunds(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select source…</option>
                {SOURCE_OF_FUNDS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioDesc">
                Portfolio Description (optional)
              </Label>
              <textarea
                id="portfolioDesc"
                className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                value={portfolioDesc}
                onChange={(e) => setPortfolioDesc(e.target.value)}
                maxLength={2000}
                placeholder="Describe your investment focus, portfolio companies, and thesis…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">
                Investment Experience
              </Label>
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select experience level…</option>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companiesInvested">
                Companies Previously Invested In
              </Label>
              <select
                id="companiesInvested"
                value={companiesInvested}
                onChange={(e) => setCompaniesInvested(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select count…</option>
                {COMPANIES_INVESTED.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Sector Focus</Label>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((sector) => {
                  const active = selectedSectors.includes(sector);
                  return (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleSector(sector)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-lavender bg-lavender/10 text-lavender"
                          : "border-border text-text-secondary hover:border-text-muted"
                      }`}
                    >
                      {active && <Plus className="mr-1 inline h-3 w-3" />}
                      {sector}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentRange">
                Preferred Investment Range
              </Label>
              <Input
                id="investmentRange"
                value={investmentRange}
                onChange={(e) => setInvestmentRange(e.target.value)}
                maxLength={200}
                placeholder="e.g. $10K–$100K per deal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousPortfolio">
                Previous Portfolio Companies (optional)
              </Label>
              <textarea
                id="previousPortfolio"
                className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                value={previousPortfolio}
                onChange={(e) => setPreviousPortfolio(e.target.value)}
                maxLength={2000}
                placeholder="List any companies you've invested in before…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralSource">
                How Did You Hear About Ondex?
              </Label>
              <select
                id="referralSource"
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Select source…</option>
                {REFERRAL_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-text-muted text-center">
            Already applied?{" "}
            <Link href="/login" className="text-mint hover:underline">
              Check your status
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
