import { prisma } from "../lib/db.js";

export async function record(data: {
  userId?: string | null;
  eventType: string;
  success: boolean;
  ip?: string | null;
  fingerprint?: string | null;
  geoHint?: string | null;
  detail?: string | null;
}) {
  return prisma.authEvent.create({
    data: {
      userId: data.userId ?? null,
      eventType: data.eventType,
      success: data.success,
      ip: data.ip ?? null,
      fingerprint: data.fingerprint ?? null,
      geoHint: data.geoHint ?? null,
      detail: data.detail ?? null,
    },
  });
}

export async function recentForUser(userId: string, limit = 20) {
  return prisma.authEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function countFailedRoleChecks(
  ip: string,
  since: Date,
): Promise<number> {
  return prisma.authEvent.count({
    where: {
      ip,
      eventType: "role_check_failed",
      success: false,
      createdAt: { gte: since },
    },
  });
}

export async function countRefreshReuse(
  userId: string,
  since: Date,
): Promise<number> {
  return prisma.authEvent.count({
    where: {
      userId,
      eventType: "refresh_reuse_detected",
      createdAt: { gte: since },
    },
  });
}
