"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { Networks } from "@stellar/stellar-sdk";

interface WalletContextType {
  address: string | null;
  walletName: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (
    xdr: string,
    opts?: { networkPassphrase?: string }
  ) => Promise<{ signedTxXdr: string; signerAddress: string }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

let kitReady = false;

async function initKit() {
  if (kitReady || typeof window === "undefined") return;
  const { StellarWalletsKit, Networks: KitNetworks } = await import(
    "@creit.tech/stellar-wallets-kit"
  );
  const { defaultModules } = await import(
    "@creit.tech/stellar-wallets-kit/modules/utils"
  );
  StellarWalletsKit.init({
    modules: defaultModules(),
    network: KitNetworks.TESTNET,
  });
  kitReady = true;
  return StellarWalletsKit;
}

async function getKit() {
  await initKit();
  const mod = await import("@creit.tech/stellar-wallets-kit");
  return mod.StellarWalletsKit;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("ondex_wallet_address");
    const storedName = localStorage.getItem("ondex_wallet_name");
    if (storedAddress) {
      setAddress(storedAddress);
      setWalletName(storedName);
    }
    initKit();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const StellarWalletsKit = await getKit();
      const result = await StellarWalletsKit.authModal();
      setAddress(result.address);
      const name = localStorage.getItem("ondex_wallet_name") || "Freighter";
      setWalletName(name);
      localStorage.setItem("ondex_wallet_address", result.address);
    } catch (err: any) {
      if (err?.message !== "The user closed the modal.") {
        console.error("Wallet connection failed:", err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const StellarWalletsKit = await getKit();
    StellarWalletsKit.disconnect();
    setAddress(null);
    setWalletName(null);
    localStorage.removeItem("ondex_wallet_address");
    localStorage.removeItem("ondex_wallet_name");
  }, []);

  const signTransaction = useCallback(
    async (
      xdr: string,
      opts?: { networkPassphrase?: string }
    ): Promise<{ signedTxXdr: string; signerAddress: string }> => {
      if (!address) throw new Error("Wallet not connected");
      const StellarWalletsKit = await getKit();
      const result = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase || Networks.TESTNET,
        address,
      });
      return { signedTxXdr: result.signedTxXdr, signerAddress: result.signerAddress ?? address };
    },
    [address]
  );

  return (
    <WalletContext.Provider
      value={{
        address,
        walletName,
        isConnecting,
        connect,
        disconnect,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
