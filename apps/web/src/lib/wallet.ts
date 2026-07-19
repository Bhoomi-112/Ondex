let kitReady = false;
let freighterDetected = false;

async function ensureKit() {
  if (kitReady) return;
  if (typeof window === "undefined") return;

  const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
  const { defaultModules } = await import("@creit.tech/stellar-wallets-kit/modules/utils");
  const { FREIGHTER_ID } = await import("@creit.tech/stellar-wallets-kit/modules/freighter");

  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
    selectedWalletId: FREIGHTER_ID,
  });
  kitReady = true;

  try {
    const freighterApi = await import("@creit.tech/stellar-wallets-kit/modules/freighter");
    freighterDetected = true;
  } catch {
    freighterDetected = false;
  }
}

async function tryFreighterDirect(xdr: string, passphrase: string): Promise<string> {
  const freighter = await import("@stellar/freighter-api");
  const result = await freighter.signTransaction(xdr, { networkPassphrase: passphrase });
  return result.signedTxXdr;
}

export async function connectWallet(): Promise<string> {
  await ensureKit();
  const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
  const { address } = await StellarWalletsKit.authModal();
  return address;
}

export async function disconnectWallet(): Promise<void> {
  await ensureKit();
  const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
  await StellarWalletsKit.disconnect();
}

export async function getWalletAddress(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  await ensureKit();
  try {
    const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
    const { address } = await StellarWalletsKit.getAddress();
    return address;
  } catch {
    return null;
  }
}

export async function signTransaction(xdr: string, address: string): Promise<string> {
  await ensureKit();
  const passphrase = "Test SDF Network ; September 2015";

  try {
    const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      address,
      networkPassphrase: Networks.TESTNET,
    });
    return signedTxXdr;
  } catch (kitErr) {
    console.warn("StellarWalletsKit signTransaction failed, trying Freighter direct:", kitErr);
    return tryFreighterDirect(xdr, passphrase);
  }
}

export async function signBlob(blob: string): Promise<string> {
  await ensureKit();
  const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
  const { address } = await StellarWalletsKit.getAddress();
  const { signedMessage } = await StellarWalletsKit.signMessage(blob, {
    address,
    networkPassphrase: Networks.TESTNET,
  });
  return signedMessage;
}
