import { prisma } from "../lib/db.js";
import type { JuryApplicationStatus } from "../lib/roles.js";

export async function create(data: {
  userId: string;
  wallet: string;
  statement: string;
  experience?: string | null;
}) {
  return prisma.juryApplication.create({
    data: {
      userId: data.userId,
      wallet: data.wallet,
      statement: data.statement,
      experience: data.experience ?? null,
      status: "pending",
    },
  });
}

export async function findById(id: string) {
  return prisma.juryApplication.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function findPendingByUser(userId: string) {
  return prisma.juryApplication.findFirst({
    where: { userId, status: "pending" },
  });
}

export async function listByStatus(status?: JuryApplicationStatus) {
  return prisma.juryApplication.findMany({
    where: status ? { status } : undefined,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function setStatus(
  id: string,
  data: {
    status: JuryApplicationStatus;
    reviewedBy: string;
    rejectReason?: string | null;
  },
) {
  return prisma.juryApplication.update({
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
