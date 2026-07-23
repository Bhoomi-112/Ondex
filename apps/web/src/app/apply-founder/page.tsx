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
import { Loader2, CheckCircle } from "lucide-react";

export default function ApplyFounderPage() {
  const { user, loginWithWallet, loading } = useAuth();
  const router = useRouter();
  const [pitch, setPitch] = useState("");
  const [experience, setExperience] = useState("");
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await ensureAuth();
      await applyAsFounder({ pitch, experience: experience || undefined });
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
              Your founder application is now pending jury review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">
              Jury members will review your pitch. You will gain dashboard
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
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Apply as Founder</CardTitle>
          <CardDescription>
            Submit your startup pitch for jury review. Only approved founders
            may access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {!user && !loading && (
              <p className="text-sm text-text-muted">
                You will sign a wallet challenge to authenticate before submitting.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="pitch">Startup Pitch</Label>
              <textarea
                id="pitch"
                className="flex min-h-[140px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
                minLength={20}
                maxLength={5000}
                placeholder="Describe your startup, what you're building, and why you need funding…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (optional)</Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                maxLength={2000}
                placeholder="Relevant background or traction"
              />
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
