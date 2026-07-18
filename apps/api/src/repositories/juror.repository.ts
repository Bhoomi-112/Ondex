import { prisma } from "../lib/db.js";

export async function upsertByAddress(
  address: string,
  data: { xlmStake: bigint; platformStake: bigint },
) {
  return prisma.juror.upsert({
    where: { address },
    create: { address, ...data },
    update: data,
  });
}

export async function findByAddress(address: string) {
  return prisma.juror.findUnique({ where: { address } });
}

export async function findActive(limit: number = 50, offset: number = 0) {
  return prisma.juror.findMany({
    where: { isActive: true },
    orderBy: { registeredAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function deactivate(address: string) {
  return prisma.juror.update({
    where: { address },
    data: { isActive: false },
  });
}

export async function countActive() {
  return prisma.juror.count({ where: { isActive: true } });
}
