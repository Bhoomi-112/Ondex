"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { fetchJuryStatus, fetchFounderStatus, fetchInvestorStatus } from "@/lib/auth-api";
import { dashboardPathForRole } from "@/lib/auth-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Clock, XCircle, Scale, Rocket, Shield } from "lucide-react";

type AppStatus = {
  status: "pending" | "approved" | "rejected";
  rejectReason?: string | null;
};

function LoginForm() {
  const { loginWithWallet, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"idle" | "choosing" | "checking">("idle");
  const [juryApp, setJuryApp] = useState<AppStatus | null>(null);
  const [founderApp, setFounderApp] = useState<AppStatus | null>(null);
  const [investorApp, setInvestorApp] = useState<AppStatus | null>(null);

  useEffect(() => {
    if (user?.role) {
      const next = searchParams.get("next");
      if (user.onboardingStatus === "active") {
        router.replace(next || dashboardPathForRole(user.role));
      } else {
        router.replace("/onboarding");
      }
      return;
    }

    if (loading || !user) return;

    if (phase === "idle") {
      setPhase("checking");
      Promise.allSettled([fetchJuryStatus(), fetchFounderStatus(), fetchInvestorStatus()]).then(
        ([jury, founder, investor]) => {
          const j =
            jury.status === "fulfilled" ? jury.value.application : null;
          const f =
            founder.status === "fulfilled" ? founder.value.application : null;
          const i =
            investor.status === "fulfilled" ? investor.value.application : null;
          setJuryApp(j ?? null);
          setFounderApp(f ?? null);
          setInvestorApp(i ?? null);
          setPhase("choosing");
        },
      );
    }
  }, [loading, user, searchParams, router, phase]);

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await loginWithWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (phase === "checking" || (user && !user.role && !juryApp && !founderApp && !investorApp && phase !== "choosing")) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </CardContent>
      </Card>
    );
  }

  if (phase === "choosing" && user && !user.role) {
    const hasAnyApp = juryApp || founderApp || investorApp;
    const allRejected =
      juryApp?.status === "rejected" &&
      founderApp?.status === "rejected" &&
      investorApp?.status === "rejected";

    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose your role</CardTitle>
          <CardDescription>
            {hasAnyApp
              ? "Your application status is shown below."
              : "Select what you want to apply for. Each role requires approval before access is granted."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!founderApp || founderApp.status === "rejected") && (
            <Link href="/apply-founder" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                <Rocket className="h-6 w-6 text-lavender shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Apply as Founder
                  </p>
                  <p className="text-xs text-text-muted">
                    Submit your startup pitch. Approved by jury members.
                  </p>
                </div>
                {founderApp?.status === "pending" && (
                  <span className="flex items-center gap-1 text-xs text-amber">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
            </Link>
          )}

          {(!juryApp || juryApp.status === "rejected") && (
            <Link href="/apply-jury" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                <Scale className="h-6 w-6 text-coral shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Apply as Jury
                  </p>
                  <p className="text-xs text-text-muted">
                    Review startup proposals. Approved by admin.
                  </p>
                </div>
                {juryApp?.status === "pending" && (
                  <span className="flex items-center gap-1 text-xs text-amber">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
            </Link>
          )}

          {(!investorApp || investorApp.status === "rejected") && (
            <Link href="/apply-investor" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                <Shield className="h-6 w-6 text-mint shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Apply as Investor
                  </p>
                  <p className="text-xs text-text-muted">
                    KYC verification. Deposit into campaigns and vote on
                    disputes.
                  </p>
                </div>
                {investorApp?.status === "pending" && (
                  <span className="flex items-center gap-1 text-xs text-amber">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
            </Link>
          )}

          {juryApp?.status === "pending" && (
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber" />
                <p className="text-sm font-medium text-text-primary">
                  Jury application under review
                </p>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Your jury application is being reviewed. You will gain access
                once approved.
              </p>
            </div>
          )}

          {founderApp?.status === "pending" && (
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber" />
                <p className="text-sm font-medium text-text-primary">
                  Founder application under review
                </p>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Your founder application is being reviewed by jury members.
              </p>
            </div>
          )}

          {investorApp?.status === "pending" && (
            <div className="rounded-lg border border-amber/20 bg-amber/5 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber" />
                <p className="text-sm font-medium text-text-primary">
                  Investor application under review
                </p>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Your investor application is being reviewed by our compliance
                team.
              </p>
            </div>
          )}

          {(juryApp?.status === "rejected" ||
            founderApp?.status === "rejected" ||
            investorApp?.status === "rejected") && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-danger" />
                <p className="text-sm font-medium text-text-primary">
                  Application not approved
                </p>
              </div>
              {juryApp?.status === "rejected" && juryApp.rejectReason && (
                <p className="mt-1 text-xs text-text-muted">
                  Jury: {juryApp.rejectReason}
                </p>
              )}
              {founderApp?.status === "rejected" && founderApp.rejectReason && (
                <p className="mt-1 text-xs text-text-muted">
                  Founder: {founderApp.rejectReason}
                </p>
              )}
              {investorApp?.status === "rejected" && investorApp.rejectReason && (
                <p className="mt-1 text-xs text-text-muted">
                  Investor: {investorApp.rejectReason}
                </p>
              )}
            </div>
          )}

          {allRejected && (
            <p className="text-xs text-text-muted text-center mt-2">
              You can reapply after addressing the feedback above.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in to Ondex</CardTitle>
        <CardDescription>
          Authenticate with your Stellar wallet. Access requires an approved
          role — founder or jury.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={handleLogin} disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing challenge…
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-center gap-4 text-xs text-text-muted">
          <Link href="/apply-founder" className="hover:text-mint transition-colors">
            Apply as Founder
          </Link>
          <span>·</span>
          <Link href="/apply-jury" className="hover:text-mint transition-colors">
            Apply as Jury
          </Link>
          <span>·</span>
          <Link href="/apply-investor" className="hover:text-mint transition-colors">
            Apply as Investor
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Suspense fallback={<p className="text-text-muted text-center">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
