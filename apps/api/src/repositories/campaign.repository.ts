import { prisma } from "../lib/db.js";

export async function upsertByCampaignId(
  campaignId: number,
  data: {
    startupAddress: string;
    investorAddress: string;
    amount: bigint;
    asset: string;
    state: string;
    approvedAt?: Date;
    disputeDeadline?: Date;
  },
) {
  return prisma.campaign.upsert({
    where: { campaignId },
    create: { campaignId, ...data },
    update: {
      startupAddress: data.startupAddress,
      investorAddress: data.investorAddress,
      amount: data.amount,
      asset: data.asset,
      state: data.state,
      approvedAt: data.approvedAt,
      disputeDeadline: data.disputeDeadline,
    },
  });
}

export async function findByCampaignId(campaignId: number) {
  return prisma.campaign.findUnique({ where: { campaignId } });
}

export async function findByState(
  state: string,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.campaign.findMany({
    where: { state },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function findByStartup(
  startupAddress: string,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.campaign.findMany({
    where: { startupAddress },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function findByInvestor(
  investorAddress: string,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.campaign.findMany({
    where: { investorAddress },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function updateState(
  campaignId: number,
  state: string,
  extra?: { approvedAt?: Date; disputeDeadline?: Date },
) {
  return prisma.campaign.update({
    where: { campaignId },
    data: { state, ...extra },
  });
}

export async function countByState(state: string) {
  return prisma.campaign.count({ where: { state } });
}
