import { prisma } from "../lib/db.js";

export async function upsertByOnChainId(
  onChainId: number,
  data: {
    startup: string;
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
      startup: data.startup,
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

export async function findByStartup(startup: string) {
  return prisma.application.findMany({
    where: { startup },
    orderBy: { createdAt: "desc" },
    include: { milestones: true, votes: true },
  });
}

export async function findAllPending() {
  return prisma.application.findMany({
    where: { status: { in: ["Submitted", "UnderReview"] } },
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
