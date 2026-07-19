"use client";

import { useState, useCallback, useEffect } from "react";
import { requestChallenge, verifyChallenge, getCurrentSession, logout as authLogout } from "@/lib/auth";
import { useWalletContext } from "@/components/wallet/wallet-provider";
import { useToast } from "@/components/ui/toast";

type UserRole = "startup" | "jury" | "investor";

export function useAuth() {
  const [session, setSession] = useState<{ wallet: string; role: UserRole } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { signXdr } = useWalletContext();
  const { toast } = useToast();

  const isAuthenticated = session !== null;

  useEffect(() => {
    let cancelled = false;
    getCurrentSession()
      .then((s: { wallet: string; role: string } | null) => {
        if (!cancelled) setSession(s as { wallet: string; role: UserRole } | null);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (wallet: string) => {
      try {
        setIsLoading(true);
        const challenge = await requestChallenge(wallet);
        const signedTxXdr = await signXdr(challenge.challenge);
        await verifyChallenge(wallet, challenge.challenge, signedTxXdr);
        const currentSession = await getCurrentSession();
        setSession(currentSession as { wallet: string; role: UserRole } | null);
        toast({ title: "Signed in successfully", variant: "success" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Sign in failed";
        toast({ title: message, variant: "error" });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [signXdr, toast]
  );

  const logout = useCallback(async () => {
    try {
      await authLogout();
      setSession(null);
      toast({ title: "Signed out", variant: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      toast({ title: message, variant: "error" });
      throw err;
    }
  }, [toast]);

  return {
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}
