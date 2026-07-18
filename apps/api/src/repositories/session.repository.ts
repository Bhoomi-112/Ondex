import { prisma } from "../lib/db.js";

export async function create(id: string, wallet: string, expiresAt: Date) {
  return prisma.session.create({
    data: { id, wallet, expiresAt },
  });
}

export async function findById(id: string) {
  return prisma.session.findUnique({ where: { id } });
}

export async function deleteExpired() {
  return prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}

export async function deleteByWallet(wallet: string) {
  return prisma.session.deleteMany({ where: { wallet } });
}

export async function deleteById(id: string) {
  return prisma.session.delete({ where: { id } });
}
