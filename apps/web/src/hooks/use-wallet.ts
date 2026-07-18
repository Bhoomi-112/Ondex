"use client";

import { useState, useCallback, useEffect } from "react";
import {
  connectWallet,
  disconnectWallet,
  getWalletAddress,
  signTransaction,
} from "@/lib/wallet";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getWalletAddress()
      .then((addr: string | null) => {
        if (!cancelled) setAddress(addr);
      })
      .catch(() => {
        if (!cancelled) setAddress(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setAddress(null);
  }, []);

  const signXdr = useCallback(async (xdr: string): Promise<string> => {
    return signTransaction(xdr);
  }, []);

  return {
    address,
    isConnected: address !== null,
    isConnecting,
    connect,
    disconnect,
    signXdr,
  };
}
