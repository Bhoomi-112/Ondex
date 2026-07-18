import { prisma } from "../lib/db.js";

export async function upsertByCaseId(
  caseId: number,
  data: {
    status: string;
    forVotes: number;
    againstVotes: number;
    totalVotes: number;
    resolvedAt?: Date;
  },
) {
  return prisma.juryCase.upsert({
    where: { caseId },
    create: { caseId, ...data },
    update: data,
  });
}

export async function findByCaseId(caseId: number) {
  return prisma.juryCase.findUnique({
    where: { caseId },
    include: { jurors: true, votes: true },
  });
}

export async function findByStatus(
  status: string,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.juryCase.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function updateStatus(
  caseId: number,
  status: string,
  extra?: {
    forVotes?: number;
    againstVotes?: number;
    totalVotes?: number;
    resolvedAt?: Date;
  },
) {
  return prisma.juryCase.update({
    where: { caseId },
    data: { status, ...extra },
  });
}

export async function addJuror(caseId: number, jurorAddr: string) {
  return prisma.caseJuror.create({
    data: { caseId, jurorAddr },
  });
}

export async function getJurors(caseId: number) {
  return prisma.caseJuror.findMany({ where: { caseId } });
}

export async function addVote(caseId: number, jurorAddr: string, vote: string) {
  return prisma.caseVote.create({
    data: { caseId, jurorAddr, vote },
  });
}

export async function getVotes(caseId: number) {
  return prisma.caseVote.findMany({ where: { caseId } });
}

export async function countByStatus(status: string) {
  return prisma.juryCase.count({ where: { status } });
}
