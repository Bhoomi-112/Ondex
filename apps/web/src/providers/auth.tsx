"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/providers/wallet";
import type { AuthUser } from "@/lib/auth-types";
import {
  fetchChallenge,
  fetchMe,
  logoutSession,
  refreshSession,
  verifyWalletAuth,
} from "@/lib/auth-api";
import { getNetworkConfig } from "@/lib/contracts";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  loginWithWallet: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, connect, disconnect, signTransaction } = useWallet();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await fetchMe();
      setUser(me);
      return me;
    } catch {
      try {
        const { user: me } = await refreshSession();
        setUser(me);
        return me;
      } catch {
        setUser(null);
        return null;
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!cancelled) {
          setLoading(true);
          await refreshUser();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const loginWithWallet = useCallback(async () => {
    let wallet = address;
    if (!wallet) {
      await connect();
      wallet = localStorage.getItem("ondex_wallet_address");
    }
    if (!wallet) {
      throw new Error("Wallet connection cancelled");
    }

    let challengeRes;
    try {
      challengeRes = await fetchChallenge(wallet);
    } catch (err) {
      console.error("fetchChallenge failed:", err);
      throw new Error(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Failed to get challenge from server",
      );
    }

    const { challenge, network_passphrase } = challengeRes;
    const passphrase = network_passphrase || getNetworkConfig().networkPassphrase;

    console.debug("login challenge:", {
      challengePrefix: challenge?.slice(0, 40),
      challengeLength: challenge?.length,
      passphrase,
    });

    let signed;
    try {
      signed = await signTransaction(challenge, {
        networkPassphrase: passphrase,
      });
    } catch (err) {
      console.error("signTransaction failed:", err);
      const msg =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Wallet signing cancelled or failed";
      if (msg.includes("internal error") || msg.includes("parse")) {
        console.warn(
          "Challenge XDR may be invalid. Prefix (40 chars):",
          challenge?.slice(0, 40),
          "Length:",
          challenge?.length,
          "Network:",
          passphrase,
        );
      }
      throw new Error(msg);
    }

    try {
      const { user: authed } = await verifyWalletAuth({
        wallet,
        challenge,
        signedTx: signed.signedTxXdr,
      });
      setUser(authed);
      return authed;
    } catch (err) {
      console.error("verifyWalletAuth failed:", err);
      throw new Error(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Server rejected authentication",
      );
    }
  }, [address, connect, signTransaction]);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await logoutSession();
    } catch {
      /* cookies may already be cleared */
    }
    try {
      await disconnect();
    } catch (err) {
      console.warn("Wallet disconnect during logout:", err);
    }
    router.push("/login");
  }, [disconnect, router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithWallet,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, loginWithWallet, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
