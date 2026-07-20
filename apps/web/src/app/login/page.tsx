"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardPathForRole } from "@/lib/auth-types";

function LoginForm() {
  const { loginWithWallet, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user?.role && user.onboardingStatus === "active") {
    const next = searchParams.get("next");
    router.replace(next || dashboardPathForRole(user.role));
  }

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      const authed = await loginWithWallet();
      if (!authed.role) {
        router.push("/signup/role");
      } else if (authed.onboardingStatus !== "active") {
        router.push("/onboarding");
      } else {
        const next = searchParams.get("next");
        router.push(next || dashboardPathForRole(authed.role));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in to Ondex</CardTitle>
        <CardDescription>
          Authenticate with your Stellar wallet. Role is loaded from the server
          — you will not re-select it on login.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={handleLogin} disabled={busy}>
          {busy ? "Signing challenge…" : "Continue with wallet"}
        </Button>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <p className="text-sm text-text-secondary text-center">
          New here?{" "}
          <Link href="/signup" className="text-mint hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-xs text-text-muted text-center">
          Jury access is invite-only.{" "}
          <Link href="/apply-jury" className="underline">
            Apply as jury
          </Link>
        </p>
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
