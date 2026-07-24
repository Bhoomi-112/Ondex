import { prisma } from "../lib/db.js";

export async function create(data: {
  caseId: number;
  applicationId: number;
  aiAgentAddress: string;
}) {
  return prisma.aiEvaluation.create({ data });
}

export async function findByCaseId(caseId: number) {
  return prisma.aiEvaluation.findUnique({ where: { caseId } });
}

export async function findByApplicationId(applicationId: number) {
  return prisma.aiEvaluation.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateStatus(
  caseId: number,
  data: {
    status?: string;
    score?: number | null;
    verdict?: string | null;
    confidenceScore?: number | null;
    webPresenceScore?: number | null;
    newsSentiment?: string | null;
    companyVerified?: boolean | null;
    documentScore?: number | null;
    evidenceReport?: string | null;
    errorMessage?: string | null;
    txHash?: string | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
  },
) {
  return prisma.aiEvaluation.update({
    where: { caseId },
    data,
  });
}

export async function listByStatus(status: string) {
  return prisma.aiEvaluation.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}