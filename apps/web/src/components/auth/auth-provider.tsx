"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/use-auth";

type UserRole = "startup" | "jury" | "investor";

interface AuthContextValue {
  session: { wallet: string; role: UserRole } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (wallet: string) => Promise<void>;
  logout: () => Promise<void>;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  const value: AuthContextValue = {
    ...auth,
    role: auth.session?.role ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
