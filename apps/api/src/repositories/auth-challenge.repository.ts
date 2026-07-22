import { prisma } from "../lib/db.js";

export async function create(data: {
  id: string;
  wallet: string;
  nonce: string;
  challengeHash: string;
  expiresAt: Date;
}) {
  return prisma.authChallenge.create({ data });
}

export async function findByHash(challengeHash: string) {
  return prisma.authChallenge.findUnique({ where: { challengeHash } });
}

export async function findByNonce(nonce: string) {
  return prisma.authChallenge.findUnique({ where: { nonce } });
}

/** Delete immediately after use (single-use). */
export async function deleteById(id: string) {
  return prisma.authChallenge.delete({ where: { id } });
}

export async function deleteExpired() {
  return prisma.authChallenge.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
