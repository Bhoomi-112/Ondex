import { prisma } from "../lib/db.js";

export async function upsertByIdentityId(
  identityId: string,
  data: {
    commitmentHash?: string;
    isCommitted?: boolean;
    isRevealed?: boolean;
    linkedCaseId?: number;
    backendRef?: string;
    revealedAt?: Date;
  },
) {
  return prisma.identity.upsert({
    where: { identityId },
    create: { identityId, ...data },
    update: data,
  });
}

export async function findByIdentityId(identityId: string) {
  return prisma.identity.findUnique({ where: { identityId } });
}

export async function findCommitted(limit: number = 50, offset: number = 0) {
  return prisma.identity.findMany({
    where: { isCommitted: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function findRevealed(limit: number = 50, offset: number = 0) {
  return prisma.identity.findMany({
    where: { isRevealed: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function updateReveal(identityId: string, backendRef: string) {
  return prisma.identity.update({
    where: { identityId },
    data: { isRevealed: true, backendRef, revealedAt: new Date() },
  });
}
