import { prisma } from "../lib/db.js";

export async function create(data: {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.refreshToken.create({ data });
}

export async function findByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
}

export async function revoke(id: string, replacedBy?: string) {
  return prisma.refreshToken.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      ...(replacedBy ? { replacedBy } : {}),
    },
  });
}

export async function revokeAllForUser(userId: string) {
  return prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Revoke entire session family (theft detection). */
export async function revokeFamily(familyId: string) {
  return prisma.refreshToken.updateMany({
    where: { familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function deleteExpired() {
  return prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
