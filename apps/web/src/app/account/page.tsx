"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth";
import { useWallet } from "@/providers/wallet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Wallet, Rocket, Shield, ExternalLink } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export default function AccountPage() {
  const { user } = useAuth();
  const { address } = useWallet();

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

  const roleConfig = user.role === "founder"
    ? { label: "Founder", icon: Rocket, color: "text-lavender", dashboard: "/startup" }
    : user.role === "investor"
    ? { label: "Investor", icon: Shield, color: "text-mint", dashboard: "/investor" }
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Account</h1>
        <p className="text-text-secondary mt-1">
          Your profile and role information.
        </p>
      </div>

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

      {roleConfig ? (
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>No Active Role</CardTitle>
            <CardDescription>
              Register as a founder or investor to access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/signup/founder" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                <Rocket className="h-5 w-5 text-lavender shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Register as Founder</p>
                  <p className="text-xs text-text-muted">Create your startup profile</p>
                </div>
              </div>
            </Link>
            <Link href="/signup/investor" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-mint/40 transition-colors">
                <Shield className="h-5 w-5 text-mint shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Register as Investor</p>
                  <p className="text-xs text-text-muted">Set preferences & browse</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}