import { prisma } from "../lib/db.js";

export async function createRoleApplication(data: {
  userId: string;
  wallet: string;
  name: string;
  pitch: string;
  askAmount: bigint;
  experience?: string | null;
  website?: string | null;
  socials?: Record<string, string> | null;
  milestones?: { description: string; amount: bigint }[];
}) {
  return prisma.application.create({
    data: {
      userId: data.userId,
      wallet: data.wallet,
      name: data.name,
      pitch: data.pitch,
      askAmount: data.askAmount,
      experience: data.experience ?? null,
      website: data.website ?? null,
      socials: data.socials ? JSON.stringify(data.socials) : null,
      status: "pending",
      milestones: data.milestones
        ? {
            create: data.milestones.map((ms, i) => ({
              idx: i,
              description: ms.description,
              amount: ms.amount,
            })),
          }
        : undefined,
    },
    include: { milestones: true, user: { select: { id: true, wallet: true, displayName: true, role: true } } },
  });
}

export async function findPendingByUser(userId: string) {
  return prisma.application.findFirst({
    where: { userId, status: "pending" },
  });
}

export async function findAnyByUser(userId: string) {
  return prisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: number) {
  return prisma.application.findUnique({
    where: { id },
    include: { milestones: true, user: { select: { id: true, wallet: true, displayName: true, role: true } } },
  });
}

export async function listRoleApplications(status?: string) {
  const where: Record<string, unknown> = { userId: { not: null } };
  if (status) where.status = status;
  return prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { milestones: true, user: { select: { id: true, wallet: true, displayName: true, role: true } } },
  });
}

export async function setRoleApplicationStatus(
  id: number,
  data: {
    status: string;
    reviewedBy: string;
    rejectReason?: string | null;
  },
) {
  return prisma.application.update({
    where: { id },
    data: {
      status: data.status,
      reviewedBy: data.reviewedBy,
      reviewedAt: new Date(),
      rejectReason: data.rejectReason ?? null,
    },
    include: { milestones: true, user: { select: { id: true, wallet: true, displayName: true, role: true } } },
  });
}

export async function upsertByOnChainId(
  onChainId: number,
  data: {
    wallet: string;
    name: string;
    pitch: string;
    askAmount: bigint;
    status?: string;
    maskName?: boolean;
    maskAddress?: boolean;
    milestones?: { description: string; amount: bigint }[];
  },
) {
  const existing = await prisma.application.findUnique({ where: { onChainId } });

  if (existing) {
    return prisma.application.update({
      where: { onChainId },
      data: {
        status: data.status ?? existing.status,
      },
    });
  }

  return prisma.application.create({
    data: {
      onChainId,
      wallet: data.wallet,
      name: data.name,
      pitch: data.pitch,
      askAmount: data.askAmount,
      status: data.status ?? "Submitted",
      maskName: data.maskName ?? true,
      maskAddress: data.maskAddress ?? true,
      milestones: data.milestones
        ? {
            create: data.milestones.map((ms, i) => ({
              idx: i,
              description: ms.description,
              amount: ms.amount,
            })),
          }
        : undefined,
    },
    include: { milestones: true },
  });
}

export async function findByOnChainId(onChainId: number) {
  return prisma.application.findUnique({
    where: { onChainId },
    include: { milestones: true, votes: true },
  });
}

export async function findByWallet(wallet: string) {
  return prisma.application.findMany({
    where: { wallet },
    orderBy: { createdAt: "desc" },
    include: { milestones: true, votes: true },
  });
}

export async function findAllPendingFunding() {
  return prisma.application.findMany({
    where: { status: { in: ["Submitted", "UnderReview"] }, onChainId: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { milestones: true },
  });
}

export async function findByStatus(status: string) {
  return prisma.application.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    include: { milestones: true },
  });
}

export async function updateStatus(onChainId: number, status: string) {
  return prisma.application.update({
    where: { onChainId },
    data: { status },
  });
}

export async function addVote(
  applicationId: number,
  voter: string,
  approve: boolean,
  commentHash: string = "",
) {
  return prisma.applicationVote.upsert({
    where: { applicationId_voter: { applicationId, voter } },
    create: { applicationId, voter, approve, commentHash },
    update: { approve, commentHash },
  });
}

export async function getVotesByApplication(applicationId: number) {
  return prisma.applicationVote.findMany({
    where: { applicationId },
    orderBy: { timestamp: "desc" },
  });
}

export async function getVotesByVoter(voter: string) {
  return prisma.applicationVote.findMany({
    where: { voter },
    orderBy: { timestamp: "desc" },
  });
}
