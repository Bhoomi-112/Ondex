"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function SignupPage() {
  const { loginWithWallet } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignup = async () => {
    setBusy(true);
    setError(null);
    try {
      const authed = await loginWithWallet();
      if (!authed.role) {
        router.push("/signup/role");
      } else if (authed.onboardingStatus !== "active") {
        router.push("/onboarding");
      } else {
        router.push(dashboardPathForRole(authed.role));
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create your Ondex account</CardTitle>
          <CardDescription>
            One identity, one role. Verify with your Stellar wallet, then choose
            Startup/Founder or Investor. Jury is not self-selectable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handleSignup} disabled={busy}>
            {busy ? "Verifying wallet…" : "Sign up with wallet"}
          </Button>
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <p className="text-sm text-text-secondary text-center">
            Already registered?{" "}
            <Link href="/login" className="text-mint hover:underline">
              Log in
            </Link>
          </p>
          <p className="text-xs text-text-muted text-center">
            Want to serve on the jury?{" "}
            <Link href="/apply-jury" className="underline">
              Apply for approval
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
