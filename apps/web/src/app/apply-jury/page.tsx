"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth";
import { applyAsJury } from "@/lib/auth-api";
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

export default function ApplyJuryPage() {
  const { user, loginWithWallet, loading } = useAuth();
  const [statement, setStatement] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      const { application } = await applyAsJury({
        statement,
        experience: experience || undefined,
      });
      setSuccessId(application.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Apply as Jury</CardTitle>
          <CardDescription>
            Jury is not self-selectable. This creates a{" "}
            <code className="text-xs">pending_jury_application</code> only —
            admins must approve before you receive the jury role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successId ? (
            <div className="space-y-3 text-sm text-text-secondary">
              <p className="text-success">
                Application submitted ({successId.slice(0, 8)}…). Status:
                pending.
              </p>
              <p>
                You will not gain dashboard access until an admin promotes your
                account to role=jury.
              </p>
              <Link href="/" className="text-mint hover:underline">
                Back home
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {!user && !loading && (
                <p className="text-sm text-text-muted">
                  You will sign a wallet challenge before submit.
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="statement">Qualifications</Label>
                <textarea
                  id="statement"
                  className="flex min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  minLength={20}
                  maxLength={2000}
                  placeholder="Why you should review startups on Ondex…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (optional)</Label>
                <Input
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  maxLength={2000}
                />
              </div>
              {error && (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
