"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getNetworkConfig } from "@/lib/contracts";

interface WalletContextType {
  address: string | null;
  walletName: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (
    xdr: string,
    opts?: { networkPassphrase?: string },
  ) => Promise<{ signedTxXdr: string; signerAddress: string }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

let kitReady = false;

function networkNameFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_NETWORK_NAME ||
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
    ""
  );
}

async function initKit() {
  if (kitReady || typeof window === "undefined") return;
  const { StellarWalletsKit, Networks: KitNetworks } = await import(
    "@creit.tech/stellar-wallets-kit"
  );
  const { defaultModules } = await import(
    "@creit.tech/stellar-wallets-kit/modules/utils"
  );

  let networkName = networkNameFromEnv();
  if (!networkName) {
    try {
      networkName = getNetworkConfig().networkName;
    } catch {
      throw new Error(
        "Wallet kit needs NEXT_PUBLIC_NETWORK_NAME (or full network env). Restart `pnpm dev` after editing apps/web/.env.local.",
      );
    }
  }

  const network =
    networkName.toLowerCase() === "public" ||
    networkName.toLowerCase() === "mainnet"
      ? KitNetworks.PUBLIC
      : KitNetworks.TESTNET;

  StellarWalletsKit.init({
    modules: defaultModules(),
    network,
  });
  kitReady = true;
  return StellarWalletsKit;
}

async function getKit() {
  await initKit();
  const mod = await import("@creit.tech/stellar-wallets-kit");
  return mod.StellarWalletsKit;
}

function clearLocalWalletState(
  setAddress: (v: string | null) => void,
  setWalletName: (v: string | null) => void,
) {
  setAddress(null);
  setWalletName(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("ondex_wallet_address");
    localStorage.removeItem("ondex_wallet_name");
  }
}

async function walletNameFromKit(): Promise<string> {
  try {
    const stateMod = await import("@creit.tech/stellar-wallets-kit/state");
    const id = stateMod.selectedModuleId.value;
    const wallets = stateMod.allowedWallets.value;
    return wallets.find((w: { id: string }) => w.id === id)?.name ?? "Unknown";
  } catch {
    return "Unknown";
  }
}

/**
 * After page reload the kit loses its selectedModule.  This restores it
 * from the wallet name we persisted in localStorage so signTransaction
 * works without forcing the user through the modal again.
 */
async function restoreModuleFromStorage(storedName: string | null): Promise<void> {
  if (!storedName) return;
  try {
    const StellarWalletsKit = await getKit();
    if (StellarWalletsKit.selectedModule) return;
    const stateMod = await import("@creit.tech/stellar-wallets-kit/state");
    const wallets = stateMod.allowedWallets.value as Array<{
      id: string;
      name: string;
    }>;
    const match = wallets.find(
      (w) => w.name === storedName || w.id.toLowerCase().includes(storedName.toLowerCase()),
    );
    if (match) {
      StellarWalletsKit.setWallet(match.id);
    }
  } catch {
    // Best-effort — will fall through to connect modal if this fails
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const restoredRef = useRef(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("ondex_wallet_address");
    const storedName = localStorage.getItem("ondex_wallet_name");
    if (storedAddress) {
      setAddress(storedAddress);
      setWalletName(storedName);
    }
    initKit()
      .then(() => restoreModuleFromStorage(storedName))
      .then(() => { restoredRef.current = true; })
      .catch((err) => {
        console.warn("Wallet kit init deferred:", err);
        restoredRef.current = true;
      });
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const StellarWalletsKit = await getKit();
      const result = await StellarWalletsKit.authModal();
      setAddress(result.address);
      const name = await walletNameFromKit();
      setWalletName(name);
      localStorage.setItem("ondex_wallet_address", result.address);
      localStorage.setItem("ondex_wallet_name", name);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? (err as { message: string }).message
            : String(err);
      if (message !== "The user closed the modal.") {
        console.error("Wallet connection failed:", err);
        throw err instanceof Error ? err : new Error(message);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    clearLocalWalletState(setAddress, setWalletName);
    if (!kitReady) return;
    try {
      const mod = await import("@creit.tech/stellar-wallets-kit");
      mod.StellarWalletsKit.disconnect();
    } catch (err) {
      console.warn("Wallet kit disconnect skipped:", err);
    }
  }, []);

  const signTransaction = useCallback(
    async (
      xdr: string,
      opts?: { networkPassphrase?: string },
    ): Promise<{ signedTxXdr: string; signerAddress: string }> => {
      const walletAddress = address || localStorage.getItem("ondex_wallet_address");
      if (!walletAddress) throw new Error("Wallet not connected — click 'Connect Wallet' first");

      const StellarWalletsKit = await getKit();
      let networkPassphrase = opts?.networkPassphrase;
      if (!networkPassphrase) {
        networkPassphrase = getNetworkConfig().networkPassphrase;
      }

      if (!xdr || typeof xdr !== "string" || xdr.length < 20) {
        throw new Error("Invalid challenge from server — try logging out and back in");
      }

      // If no module is selected (page reload), try to restore from storage
      if (!StellarWalletsKit.selectedModule) {
        const storedName = localStorage.getItem("ondex_wallet_name");
        await restoreModuleFromStorage(storedName);
      }

      const module = StellarWalletsKit.selectedModule;
      if (!module) {
        throw new Error(
          "No wallet module selected. Click 'Connect Wallet' and choose your wallet.",
        );
      }

      try {
        const result = await module.signTransaction(xdr, {
          networkPassphrase,
        });
        return {
          signedTxXdr: result.signedTxXdr,
          signerAddress: result.signerAddress ?? walletAddress,
        };
      } catch (e: unknown) {
        const raw = (e as { message?: string })?.message
          || (typeof e === "string" && e)
          || "Wallet rejected the signing request";
        if (raw.includes("not connected") || raw.includes("denied") || raw.includes("rejected")) {
          clearLocalWalletState(setAddress, setWalletName);
          throw new Error(
            `${raw}. Click 'Connect Wallet' to reconnect.`,
          );
        }
        console.error("signTransaction failed:", raw);
        throw new Error(raw);
      }
    },
    [address],
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
