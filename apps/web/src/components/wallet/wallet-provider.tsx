"use client";

import { createContext, useContext } from "react";
import { useWallet } from "@/hooks/use-wallet";

interface WalletContextValue {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signXdr: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return ctx;
}
