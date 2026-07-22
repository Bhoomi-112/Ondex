import { prisma } from "../lib/db.js";

export async function getBucket(bucketKey: string) {
  return prisma.authFailureBucket.findUnique({ where: { bucketKey } });
}

export async function upsertFail(bucketKey: string) {
  const existing = await getBucket(bucketKey);
  if (!existing) {
    return prisma.authFailureBucket.create({
      data: {
        bucketKey,
        failCount: 1,
        captchaRequired: false,
      },
    });
  }

  const failCount = existing.failCount + 1;
  // Exponential backoff: 2^(n-1) seconds, cap 1 hour, after 3 fails
  const backoffSecs =
    failCount >= 3
      ? Math.min(3600, Math.pow(2, failCount - 3))
      : 0;
  const captchaRequired = failCount >= 3;

  return prisma.authFailureBucket.update({
    where: { bucketKey },
    data: {
      failCount,
      captchaRequired,
      lockedUntil:
        backoffSecs > 0
          ? new Date(Date.now() + backoffSecs * 1000)
          : null,
    },
  });
}

export async function clearBucket(bucketKey: string) {
  const existing = await getBucket(bucketKey);
  if (!existing) return;
  await prisma.authFailureBucket.delete({ where: { bucketKey } });
}
