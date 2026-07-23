import { prisma } from "../lib/db.js";

export async function create(data: {
  userId: string;
  wallet: string;
  fullName: string;
  entityType?: string | null;
  accreditation?: string | null;
  aum?: string | null;
  sourceOfFunds?: string | null;
  portfolioDesc?: string | null;
}) {
  return prisma.investorApplication.create({
    data: {
      userId: data.userId,
      wallet: data.wallet,
      fullName: data.fullName,
      entityType: data.entityType ?? null,
      accreditation: data.accreditation ?? null,
      aum: data.aum ?? null,
      sourceOfFunds: data.sourceOfFunds ?? null,
      portfolioDesc: data.portfolioDesc ?? null,
      status: "pending",
    },
  });
}

export async function findById(id: string) {
  return prisma.investorApplication.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function findPendingByUser(userId: string) {
  return prisma.investorApplication.findFirst({
    where: { userId, status: "pending" },
  });
}

export async function findAnyByUser(userId: string) {
  return prisma.investorApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listByStatus(status?: "pending" | "approved" | "rejected") {
  return prisma.investorApplication.findMany({
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
  return prisma.investorApplication.update({
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
