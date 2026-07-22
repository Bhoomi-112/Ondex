import { createLogger } from "../lib/logger.js";
import * as authEventRepo from "../repositories/auth-event.repository.js";
import { sendAlert } from "../lib/alerts.js";

const log = createLogger("AnomalyService");

/**
 * Detect impossible-travel: same user, different country codes within 1 hour.
 */
export async function checkImpossibleTravel(
  userId: string,
  geoHint: string | null,
): Promise<void> {
  if (!geoHint) return;
  const recent = await authEventRepo.recentForUser(userId, 10);
  const prior = recent.find(
    (e) =>
      e.success &&
      e.geoHint &&
      e.geoHint !== geoHint &&
      e.eventType === "login_success",
  );
  if (prior) {
    const ageMs = Date.now() - prior.createdAt.getTime();
    if (ageMs < 60 * 60 * 1000) {
      log.warn(
        { userId, from: prior.geoHint, to: geoHint },
        "Impossible-travel login pattern",
      );
      await sendAlert({
        title: "Impossible-travel login",
        severity: "critical",
        body: `User ${userId} appeared in ${prior.geoHint} then ${geoHint} within ${Math.round(ageMs / 60000)}m`,
        fields: { userId, from: prior.geoHint, to: geoHint },
      });
    }
  }
}

export async function checkRoleCheckBurst(ip: string): Promise<void> {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const count = await authEventRepo.countFailedRoleChecks(ip, since);
  if (count >= 20) {
    await sendAlert({
      title: "Burst of failed role-check attempts",
      severity: "warning",
      body: `${count} failed role checks from ${ip} in 5 minutes`,
      fields: { ip, count },
    });
  }
}

export async function checkRefreshReuseAnomaly(userId: string): Promise<void> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const count = await authEventRepo.countRefreshReuse(userId, since);
  if (count >= 1) {
    await sendAlert({
      title: "Refresh token reuse (session theft)",
      severity: "critical",
      body: `User ${userId} refresh family revoked after reuse detection (${count} in 24h)`,
      fields: { userId, count },
    });
  }
}
