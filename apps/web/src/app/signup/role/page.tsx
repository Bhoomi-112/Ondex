"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { selectRole } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, LineChart } from "lucide-react";

export default function RoleSelectPage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"founder" | "investor" | null>(null);

  useEffect(() => {
    if (loading) return;
    if (user?.role) {
      router.replace(
        user.onboardingStatus === "active"
          ? user.dashboardPath || "/onboarding"
          : "/onboarding",
      );
    }
  }, [loading, user, router]);

  const choose = async (role: "founder" | "investor") => {
    setBusy(role);
    setError(null);
    try {
      const { user: updated } = await selectRole(role);
      setUser(updated);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not set role");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">
          Choose your role
        </h1>
        <p className="mt-2 text-text-secondary">
          This is permanent for your identity. Only an admin can change it
          later. Jury is not available here — use Apply as Jury.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border hover:border-mint/40 transition-colors">
          <CardHeader>
            <Building2 className="h-8 w-8 text-lavender mb-2" />
            <CardTitle>Startup / Founder</CardTitle>
            <CardDescription>
              Submit proposals, manage milestones, and receive escrowed funding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => choose("founder")}
              disabled={!!busy}
            >
              {busy === "founder" ? "Saving…" : "Continue as Founder"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-mint/40 transition-colors">
          <CardHeader>
            <LineChart className="h-8 w-8 text-amber mb-2" />
            <CardTitle>Investor</CardTitle>
            <CardDescription>
              Deposit capital, track campaigns, and vote on disputed releases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => choose("investor")}
              disabled={!!busy}
            >
              {busy === "investor" ? "Saving…" : "Continue as Investor"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
