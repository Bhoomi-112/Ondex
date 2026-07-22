import { prisma } from "../lib/db.js";

export async function append(data: {
  action: string;
  actorId?: string | null;
  targetId?: string | null;
  oldRole?: string | null;
  newRole?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  return prisma.auditLog.create({
    data: {
      action: data.action,
      actorId: data.actorId ?? null,
      targetId: data.targetId ?? null,
      oldRole: data.oldRole ?? null,
      newRole: data.newRole ?? null,
      ip: data.ip ?? null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });
}

export async function listRecent(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
