"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthUser } from "@/lib/auth-types";
import {
  fetchMe,
  verifyWalletAuth,
  logoutSession,
  fetchChallenge,
} from "@/lib/auth-api";
import { useWallet } from "@/providers/wallet";
import { getNetworkConfig } from "@/lib/contracts";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, signTransaction, connect } = useWallet();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (walletAddress: string) => {
    const { challenge, network_passphrase } = await fetchChallenge(walletAddress);
    const passphrase = network_passphrase || getNetworkConfig().networkPassphrase;
    const signed = await signTransaction(challenge, { networkPassphrase: passphrase });
    const { user: authUser } = await verifyWalletAuth({
      wallet: walletAddress,
      challenge,
      signedTx: signed.signedTxXdr,
    });
    setUser(authUser);
  }, [signTransaction]);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role: user?.role || null, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
