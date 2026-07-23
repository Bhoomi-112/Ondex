"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { applyAsFounder } from "@/lib/auth-api";
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
import { Loader2, CheckCircle, Plus, Trash2, Globe, Twitter, Github, Linkedin } from "lucide-react";

interface Milestone {
  description: string;
  amount: string;
}

export default function ApplyFounderPage() {
  const { user, loginWithWallet, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [pitch, setPitch] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [experience, setExperience] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([{ description: "", amount: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user?.role) {
      router.replace(user.role === "founder" ? "/startup" : user.role === "jury" ? "/jury" : "/investor");
    }
  }, [user, loading, router]);

  const ensureAuth = async () => {
    if (user) return user;
    return loginWithWallet();
  };

  const addMilestone = () => {
    setMilestones([...milestones, { description: "", amount: "" }]);
  };

  const removeMilestone = (i: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, idx) => idx !== i));
  };

  const updateMilestone = (i: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[i] = { ...updated[i], [field]: value };
    setMilestones(updated);
  };

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await ensureAuth();
      const milestonesFiltered = milestones.filter(m => m.description.trim() && m.amount);
      const socials: Record<string, string> = {};
      if (twitter) socials.twitter = twitter;
      if (github) socials.github = github;
      if (linkedin) socials.linkedin = linkedin;
      await applyAsFounder({
        name,
        pitch,
        askAmount,
        experience: experience || undefined,
        website: website || undefined,
        socials: Object.keys(socials).length > 0 ? socials : undefined,
        milestones: milestonesFiltered.length > 0 ? milestonesFiltered : undefined,
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
              Your startup application is now pending jury review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">
              Jury members will review your application. You will gain dashboard
              access once approved.
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
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Apply as Founder</CardTitle>
          <CardDescription>
            Tell us about your startup. Jury members will review your application
            before granting platform access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            {!user && !loading && (
              <p className="text-sm text-text-muted">
                You will sign a wallet challenge to authenticate before submitting.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Startup / Company Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={200}
                placeholder="Your startup name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitch">Product Description</Label>
              <textarea
                id="pitch"
                className="flex min-h-[180px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
                minLength={20}
                maxLength={10000}
                placeholder="Describe your product in detail — what problem you solve, how it works, your target market, and your vision..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="askAmount">Total Funding Ask (XLM)</Label>
              <Input
                id="askAmount"
                type="number"
                min="0"
                step="0.0000001"
                value={askAmount}
                onChange={(e) => setAskAmount(e.target.value)}
                required
                placeholder="e.g. 10000"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Milestones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <Plus className="mr-1 h-3 w-3" /> Add Milestone
                </Button>
              </div>
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      value={m.description}
                      onChange={(e) => updateMilestone(i, "description", e.target.value)}
                      placeholder="Milestone description"
                      maxLength={2000}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      step="0.0000001"
                      value={m.amount}
                      onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                      placeholder="Amount (XLM)"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(i)}
                    disabled={milestones.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-text-muted">
                Milestone total: {totalMilestoneAmount.toLocaleString()} XLM
                {askAmount && Number(askAmount) > 0 && totalMilestoneAmount !== Number(askAmount) && (
                  <span className="text-amber-400 ml-1">
                    (should match ask amount: {Number(askAmount).toLocaleString()} XLM)
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience & Traction (optional)</Label>
              <textarea
                id="experience"
                className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                maxLength={2000}
                placeholder="Relevant background, traction, team, or any supporting info..."
              />
            </div>

            <div className="space-y-3">
              <Label>Links (optional)</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-text-muted shrink-0" />
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourstartup.com"
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-text-muted shrink-0" />
                  <Input
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourstartup"
                    maxLength={200}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-text-muted shrink-0" />
                  <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/yourstartup"
                    maxLength={200}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-text-muted shrink-0" />
                  <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/yourstartup"
                    maxLength={200}
                  />
                </div>
              </div>
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
