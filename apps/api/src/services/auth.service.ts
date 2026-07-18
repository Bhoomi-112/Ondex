import { Keypair, TransactionBuilder, Networks, Operation, Account } from "@stellar/stellar-sdk";
import { config } from "../config.js";
import { createLogger } from "../lib/logger.js";
import { ValidationError } from "../lib/errors.js";
import * as sessionRepo from "../repositories/session.repository.js";

const log = createLogger("AuthService");

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export async function createChallenge(walletAddress: string) {
  log.info({ walletAddress }, "Creating SEP-10 challenge");

  try {
    Keypair.fromPublicKey(walletAddress);
  } catch {
    throw new ValidationError("Invalid Stellar wallet address");
  }

  const nonce = crypto.randomUUID().replace(/-/g, "").slice(0, 32);

  const serverKeypair = Keypair.random();

  const tx = new TransactionBuilder(
    new Account(serverKeypair.publicKey(), "0"),
    {
      fee: "0",
      networkPassphrase: config.networkPassphrase,
    },
  )
    .addOperation(
      Operation.manageData({
        name: `auth.client_domain`,
        value: Buffer.from(config.nodeEnv),
        source: serverKeypair.publicKey(),
      }),
    )
    .addOperation(
      Operation.manageData({
        name: `auth_nonce`,
        value: Buffer.from(nonce),
        source: serverKeypair.publicKey(),
      }),
    )
    .addOperation(
      Operation.manageData({
        name: `auth_account`,
        value: Buffer.from(walletAddress),
        source: serverKeypair.publicKey(),
      }),
    )
    .setTimeout(300)
    .build();

  const txXdr = tx.toXDR();

  return {
    tx: Buffer.from(txXdr).toString("base64"),
    network_passphrase: config.networkPassphrase,
    identity_note: "Ondex Authentication",
  };
}

export async function verifyChallenge(
  _challengeTxXdr: string,
  signedTxXdr: string,
) {
  log.info("Verifying SEP-10 challenge");

  try {
    const { TransactionBuilder } = await import("@stellar/stellar-sdk");

    const signedTx = TransactionBuilder.fromXDR(
      signedTxXdr,
      config.networkPassphrase,
    );

    const tx = "source" in signedTx ? signedTx : signedTx;
    const wallet = (tx as { source: string }).source;
    const signers = (tx as any).signatures ?? [];

    return {
      wallet,
      isValid: signers.length > 0,
    };
  } catch (err) {
    log.error({ err }, "Failed to verify challenge");
    return { wallet: "", isValid: false };
  }
}

export async function createSession(wallet: string) {
  log.info({ wallet }, "Creating session");

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await sessionRepo.create(sessionId, wallet, expiresAt);

  return { sessionId, expiresAt };
}

export async function validateSession(sessionId: string) {
  const session = await sessionRepo.findById(sessionId);

  if (!session) {
    return { wallet: "", isValid: false };
  }

  if (new Date() > session.expiresAt) {
    await sessionRepo.deleteById(sessionId);
    return { wallet: "", isValid: false };
  }

  return { wallet: session.wallet, isValid: true };
}

export async function destroySession(sessionId: string) {
  log.info({ sessionId }, "Destroying session");
  return sessionRepo.deleteById(sessionId);
}
