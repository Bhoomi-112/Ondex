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

    const { challenge, network_passphrase } = await fetchChallenge(wallet);
    const signed = await signTransaction(challenge, {
      networkPassphrase:
        network_passphrase || getNetworkConfig().networkPassphrase,
    });

    const { user: authed } = await verifyWalletAuth({
      wallet,
      challenge,
      signedTx: signed.signedTxXdr,
    });
    setUser(authed);
    return authed;
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
