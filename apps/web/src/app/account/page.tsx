"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth";
import { useWallet } from "@/providers/wallet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Wallet,
  Rocket,
  Scale,
  Shield,
  ExternalLink,
  Clock,
  XCircle,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchFounderStatus, fetchJuryStatus, fetchInvestorStatus } from "@/lib/auth-api";

type AppStatus = {
  status: "pending" | "approved" | "rejected";
  rejectReason?: string | null;
};

const ROLE_CONFIG = {
  founder: {
    label: "Founder",
    icon: Rocket,
    color: "text-lavender",
    dashboard: "/startup",
    apply: "/apply-founder",
  },
  jury: {
    label: "Jury",
    icon: Scale,
    color: "text-coral",
    dashboard: "/jury",
    apply: "/apply-jury",
  },
  investor: {
    label: "Investor",
    icon: Shield,
    color: "text-mint",
    dashboard: "/investor",
    apply: "/apply-investor",
  },
} as const;

export default function AccountPage() {
  const { user } = useAuth();
  const { address } = useWallet();
  const [founderApp, setFounderApp] = useState<AppStatus | null>(null);
  const [juryApp, setJuryApp] = useState<AppStatus | null>(null);
  const [investorApp, setInvestorApp] = useState<AppStatus | null>(null);

  useEffect(() => {
    if (!user || user.role) return;
    Promise.allSettled([
      fetchFounderStatus(),
      fetchJuryStatus(),
      fetchInvestorStatus(),
    ]).then(([f, j, i]) => {
      setFounderApp(
        f.status === "fulfilled" ? f.value.application ?? null : null,
      );
      setJuryApp(
        j.status === "fulfilled" ? j.value.application ?? null : null,
      );
      setInvestorApp(
        i.status === "fulfilled" ? i.value.application ?? null : null,
      );
    });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Card>
          <CardContent className="py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Log in to view your account
            </h2>
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleConfig = user.role ? ROLE_CONFIG[user.role] : null;
  const hasAnyApplication = founderApp || juryApp || investorApp;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Account</h1>
        <p className="text-text-secondary mt-1">
          Your profile, role, and application status.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-mint/20 to-accent/20 flex items-center justify-center border border-white/10">
              <User className="h-8 w-8 text-mint" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-text-primary">
                {user.displayName || "Anonymous"}
              </h2>
              {address && (
                <div className="flex items-center gap-1.5 text-sm text-text-muted mt-0.5">
                  <Wallet className="h-3.5 w-3.5" />
                  <span className="font-mono">{formatAddress(address)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Card */}
      {roleConfig ? (
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <roleConfig.icon className={`h-5 w-5 ${roleConfig.color}`} />
                <div>
                  <p className="text-sm text-text-muted">Active Role</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {roleConfig.label}
                  </p>
                </div>
              </div>
              <Link href={roleConfig.dashboard}>
                <Button>
                  Go to Dashboard
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>No Active Role</CardTitle>
            <CardDescription>
              Apply for a role to access the platform. Each role requires
              approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["founder", "jury", "investor"] as const).map((role) => {
              const config = ROLE_CONFIG[role];
              const app =
                role === "founder"
                  ? founderApp
                  : role === "jury"
                    ? juryApp
                    : investorApp;

              return (
                <Link key={role} href={config.apply} className="block">
                  <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                    <config.icon className={`h-5 w-5 ${config.color} shrink-0`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        Apply as {config.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {role === "founder" && "Submit your startup pitch. Approved by jury."}
                        {role === "jury" && "Review proposals. Approved by admin."}
                        {role === "investor" && "KYC verification. Approved by admin."}
                      </p>
                    </div>
                    {app?.status === "pending" && (
                      <span className="flex items-center gap-1 text-xs text-amber">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    {app?.status === "rejected" && (
                      <span className="flex items-center gap-1 text-xs text-danger">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Application History */}
      {hasAnyApplication && (
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {founderApp && (
              <div className="flex items-center justify-between rounded-md bg-background p-3">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-lavender" />
                  <span className="text-sm text-text-primary">Founder</span>
                </div>
                <Badge
                  variant={
                    founderApp.status === "approved"
                      ? "success"
                      : founderApp.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {founderApp.status}
                </Badge>
              </div>
            )}
            {juryApp && (
              <div className="flex items-center justify-between rounded-md bg-background p-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-coral" />
                  <span className="text-sm text-text-primary">Jury</span>
                </div>
                <Badge
                  variant={
                    juryApp.status === "approved"
                      ? "success"
                      : juryApp.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {juryApp.status}
                </Badge>
              </div>
            )}
            {investorApp && (
              <div className="flex items-center justify-between rounded-md bg-background p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-mint" />
                  <span className="text-sm text-text-primary">Investor</span>
                </div>
                <Badge
                  variant={
                    investorApp.status === "approved"
                      ? "success"
                      : investorApp.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {investorApp.status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
