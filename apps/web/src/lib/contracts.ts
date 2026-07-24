import { Client as EscrowClient } from "./bindings/escrow/index";
import { Client as IdentityClient } from "./bindings/identity/index";

export { EscrowClient, IdentityClient };

export type PublicNetworkConfig = {
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  explorerBaseUrl: string;
  networkName: string;
  escrowContractId: string;
  identityRegistryContractId: string;
  platformTokenContractId?: string;
  xlmTokenContractId?: string;
  apiBaseUrl?: string;
};

function req(key: string, val: string | undefined): string {
  if (!val) {
    throw new Error(
      `Missing required env ${key}. Set it in .env (see .env.example).`,
    );
  }
  return val;
}

export function getNetworkConfig(): PublicNetworkConfig {
  return {
    rpcUrl: req("NEXT_PUBLIC_SOROBAN_RPC_URL", process.env.NEXT_PUBLIC_SOROBAN_RPC_URL),
    horizonUrl: req("NEXT_PUBLIC_HORIZON_URL", process.env.NEXT_PUBLIC_HORIZON_URL),
    networkPassphrase: req("NEXT_PUBLIC_NETWORK_PASSPHRASE", process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE),
    explorerBaseUrl: req("NEXT_PUBLIC_EXPLORER_BASE_URL", process.env.NEXT_PUBLIC_EXPLORER_BASE_URL),
    networkName: req("NEXT_PUBLIC_NETWORK_NAME", process.env.NEXT_PUBLIC_NETWORK_NAME),
    escrowContractId: req("NEXT_PUBLIC_ESCROW_CONTRACT_ID", process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID),
    identityRegistryContractId: req(
      "NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID",
      process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID,
    ),
    platformTokenContractId:
      process.env.NEXT_PUBLIC_PLATFORM_TOKEN_CONTRACT_ID || undefined,
    xlmTokenContractId:
      process.env.NEXT_PUBLIC_XLM_TOKEN_CONTRACT_ID || undefined,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || undefined,
  };
}

export function getEscrowContractId(): string {
  return getNetworkConfig().escrowContractId;
}

export function getIdentityRegistryContractId(): string {
  return getNetworkConfig().identityRegistryContractId;
}

function clientOpts(publicKey?: string, contractId?: string, defaultId?: string) {
  const cfg = getNetworkConfig();
  return {
    contractId: contractId || defaultId || "",
    rpcUrl: cfg.rpcUrl,
    networkPassphrase: cfg.networkPassphrase,
    ...(publicKey ? { publicKey } : {}),
  };
}

export function getEscrowClient(
  publicKey?: string,
  contractId?: string,
): EscrowClient {
  const cfg = getNetworkConfig();
  return new EscrowClient(
    clientOpts(publicKey, contractId, cfg.escrowContractId),
  );
}

export function getIdentityClient(
  publicKey?: string,
  contractId?: string,
): IdentityClient {
  const cfg = getNetworkConfig();
  return new IdentityClient(
    clientOpts(publicKey, contractId, cfg.identityRegistryContractId),
  );
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return p;
  }
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return `${configured.replace(/\/$/, "")}${p}`;
  }
  return `http://localhost:3001${p}`;
}

export function explorerTxUrl(
  hash: string,
  config?: PublicNetworkConfig,
): string {
  const base = (config ?? getNetworkConfig()).explorerBaseUrl.replace(
    /\/$/,
    "",
  );
  return `${base}/tx/${hash}`;
}

export function explorerContractUrl(
  contractId: string,
  config?: PublicNetworkConfig,
): string {
  const base = (config ?? getNetworkConfig()).explorerBaseUrl.replace(
    /\/$/,
    "",
  );
  return `${base}/contract/${contractId}`;
}

export function xlmToStroops(xlm: number): bigint {
  return BigInt(Math.round(xlm * 10_000_000));
}