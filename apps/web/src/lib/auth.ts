import { api } from "./api-client";

interface ChallengeResponse {
  tx: string;
  network_passphrase: string;
}

interface Session {
  wallet: string;
  role: string;
}

export async function requestChallenge(walletAddress: string): Promise<ChallengeResponse> {
  const res = await api.post<{ data: ChallengeResponse }>("/api/v1/auth/challenge", {
    wallet: walletAddress,
  });
  return res.data;
}

export async function verifyChallenge(
  walletAddress: string,
  signedTxXdr: string
): Promise<void> {
  await api.post<{ data: null }>("/api/v1/auth/verify", {
    wallet: walletAddress,
    signedTx: signedTxXdr,
  });
}

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const res = await api.get<{ data: Session }>("/api/v1/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await api.del<{ data: null }>("/api/v1/auth/logout");
}
