let kitReady = false;

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

export async function signTransaction(xdr: string): Promise<string> {
  await ensureKit();
  const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
  const { address } = await StellarWalletsKit.getAddress();
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    address,
    networkPassphrase: Networks.TESTNET,
  });
  return signedTxXdr;
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
