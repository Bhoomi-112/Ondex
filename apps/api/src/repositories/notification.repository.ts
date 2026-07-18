import { prisma } from "../lib/db.js";

export async function create(data: {
  wallet: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
}) {
  return prisma.notification.create({
    data: {
      ...data,
      data: data.data as any,
    },
  });
}

export async function findByWallet(
  wallet: string,
  unreadOnly: boolean = false,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.notification.findMany({
    where: unreadOnly ? { wallet, read: false } : { wallet },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function markRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllRead(wallet: string) {
  return prisma.notification.updateMany({
    where: { wallet, read: false },
    data: { read: true },
  });
}

export async function countUnread(wallet: string) {
  return prisma.notification.count({
    where: { wallet, read: false },
  });
}
