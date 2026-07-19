"use client";

import {
  WalletProvider as BaseWalletProvider,
  useWallet,
} from "@/providers/wallet";

export { BaseWalletProvider as WalletProvider };

interface WalletContextValue {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void> | void;
  signXdr: (xdr: string) => Promise<string>;
}

/** Compatibility adapter over the single root WalletProvider. */
export function useWalletContext(): WalletContextValue {
  const wallet = useWallet();

  return {
    address: wallet.address,
    isConnected: wallet.address !== null,
    isConnecting: wallet.isConnecting,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    signXdr: async (xdr: string) => {
      const result = await wallet.signTransaction(xdr);
      return result.signedTxXdr;
    },
  };
}
