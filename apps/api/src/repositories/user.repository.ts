import { prisma } from "../lib/db.js";
import type { OnboardingStatus, UserRole } from "../lib/roles.js";

export type UserRecord = {
  id: string;
  wallet: string | null;
  email: string | null;
  role: string | null;
  onboardingStatus: string;
  displayName: string | null;
  bio: string | null;
  mfaSecret: string | null;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function findById(id: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function findByWallet(wallet: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { wallet } });
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function createFromWallet(wallet: string): Promise<UserRecord> {
  return prisma.user.create({
    data: {
      wallet,
      onboardingStatus: "role_selected",
    },
  });
}

export async function createFromEmail(email: string): Promise<UserRecord> {
  return prisma.user.create({
    data: {
      email,
      onboardingStatus: "role_selected",
    },
  });
}

export async function setRole(
  userId: string,
  role: UserRole,
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
      onboardingStatus: "role_selected",
    },
  });
}

export async function adminSetRole(
  userId: string,
  role: UserRole,
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function updateProfile(
  userId: string,
  data: { displayName: string; bio?: string | null },
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      displayName: data.displayName,
      bio: data.bio ?? null,
      onboardingStatus: "profile_complete",
    },
  });
}

export async function setOnboardingStatus(
  userId: string,
  status: OnboardingStatus,
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingStatus: status },
  });
}

export async function promoteToJury(userId: string): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role: "jury",
      onboardingStatus: "active",
    },
  });
}

export async function setMfaSecret(
  userId: string,
  encryptedSecret: string,
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      mfaSecret: encryptedSecret,
      mfaEnabled: false,
    },
  });
}

export async function searchUsers(q: string, limit = 20): Promise<UserRecord[]> {
  return prisma.user.findMany({
    where: {
      OR: [
        { wallet: { contains: q } },
        { email: { contains: q } },
        { displayName: { contains: q } },
      ],
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function enableMfa(userId: string): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: { mfaEnabled: true },
  });
}

export async function disableMfa(userId: string): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: { mfaEnabled: false, mfaSecret: null },
  });
}
