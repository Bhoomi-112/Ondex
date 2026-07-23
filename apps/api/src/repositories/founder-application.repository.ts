import { prisma } from "../lib/db.js";

export async function create(data: {
  userId: string;
  wallet: string;
  pitch: string;
  experience?: string | null;
}) {
  return prisma.founderApplication.create({
    data: {
      userId: data.userId,
      wallet: data.wallet,
      pitch: data.pitch,
      experience: data.experience ?? null,
      status: "pending",
    },
  });
}

export async function findById(id: string) {
  return prisma.founderApplication.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function findPendingByUser(userId: string) {
  return prisma.founderApplication.findFirst({
    where: { userId, status: "pending" },
  });
}

export async function findAnyByUser(userId: string) {
  return prisma.founderApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listByStatus(status?: "pending" | "approved" | "rejected") {
  return prisma.founderApplication.findMany({
    where: status ? { status } : undefined,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function setStatus(
  id: string,
  data: {
    status: "pending" | "approved" | "rejected";
    reviewedBy: string;
    rejectReason?: string | null;
  },
) {
  return prisma.founderApplication.update({
    where: { id },
    data: {
      status: data.status,
      reviewedBy: data.reviewedBy,
      reviewedAt: new Date(),
      rejectReason: data.rejectReason ?? null,
    },
    include: { user: true },
  });
}
