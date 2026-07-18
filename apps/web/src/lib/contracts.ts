import { Client as PlatformClient } from "./bindings/platform/client";
import { Client as EscrowClient } from "./bindings/escrow/client";

export { PlatformClient, EscrowClient };

export const PLATFORM_CONTRACT_ID = "CB3X25J5HTYZJT5YETSU7EJDL237L7DFBKPQNC3ZMKVNDR7RTZDD2BEV";
export const ESCROW_CONTRACT_ID = "CC5YIIBETTIJ2DTYK5H5V4MIM574QH6KL3INPDTSFA5O43LRUVN6H3C3";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

let _platformClient: PlatformClient | null = null;
let _escrowClient: EscrowClient | null = null;

export function getPlatformClient(contractId?: string): PlatformClient {
  if (!_platformClient || contractId) {
    _platformClient = new PlatformClient({
      contractId: contractId || PLATFORM_CONTRACT_ID,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
  }
  return _platformClient;
}

export function getEscrowClient(contractId?: string): EscrowClient {
  if (!_escrowClient || contractId) {
    _escrowClient = new EscrowClient({
      contractId: contractId || ESCROW_CONTRACT_ID,
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
  }
  return _escrowClient;
}
