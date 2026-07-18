import { api } from "./api-client";

interface ChallengeResponse {
  challenge: string;
  network_passphrase: string;
}

interface Session {
  wallet: string;
  role: string;
}

export async function requestChallenge(walletAddress: string): Promise<ChallengeResponse> {
  const res = await api.post<ChallengeResponse>("/api/v1/auth/challenge", {
    wallet: walletAddress,
  });
  return res;
}

export async function verifyChallenge(
  walletAddress: string,
  challengeXdr: string,
  signedTxXdr: string
): Promise<void> {
  await api.post("/api/v1/auth/verify", {
    wallet: walletAddress,
    challenge: challengeXdr,
    signedTx: signedTxXdr,
  });
}

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const res = await api.get<Session>("/api/v1/auth/me");
    return res;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await api.del("/api/v1/auth/logout");
}
