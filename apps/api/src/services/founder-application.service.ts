import { createLogger } from "../lib/logger.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../lib/errors.js";
import { sanitizeText, sanitizeOptional } from "../lib/sanitize.js";
import * as founderAppRepo from "../repositories/founder-application.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import { alertRoleEscalation } from "../lib/alerts.js";

const log = createLogger("FounderApplicationService");

export async function applyAsFounder(
  userId: string,
  data: { pitch: string; experience?: string },
) {
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  if (!user.wallet) {
    throw new ValidationError("A connected Stellar wallet is required");
  }
  if (user.role === "founder") {
    throw new ConflictError("You are already a founder");
  }
  if (user.role) {
    throw new ConflictError("Identity already has an active role");
  }

  const pending = await founderAppRepo.findPendingByUser(userId);
  if (pending) {
    throw new ConflictError("A pending founder application already exists");
  }

  const pitch = sanitizeText(data.pitch ?? "", 5000);
  if (!pitch || pitch.length < 20) {
    throw new ValidationError(
      "Pitch must be at least 20 characters describing your startup",
    );
  }

  const application = await founderAppRepo.create({
    userId,
    wallet: user.wallet,
    pitch,
    experience: sanitizeOptional(data.experience, 2000),
  });

  log.info({ userId, applicationId: application.id }, "Founder application created");
  return application;
}

export async function getApplicationStatus(userId: string) {
  const app = await founderAppRepo.findAnyByUser(userId);
  if (!app) return null;
  return {
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    reviewedAt: app.reviewedAt,
    rejectReason: app.rejectReason,
  };
}

export async function listApplications(jurorWallet: string, status?: string) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can list founder applications");
  }
  const allowed = ["pending", "approved", "rejected"] as const;
  const filter =
    status && (allowed as readonly string[]).includes(status)
      ? (status as (typeof allowed)[number])
      : undefined;
  return founderAppRepo.listByStatus(filter);
}

export async function approveApplication(
  jurorWallet: string,
  applicationId: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can approve founder applications");
  }

  const app = await founderAppRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Founder application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }
  if (app.user.role) {
    throw new ConflictError("Applicant already has an active role");
  }

  await founderAppRepo.setStatus(applicationId, {
    status: "approved",
    reviewedBy: jurorWallet,
  });

  const user = await userRepo.setRole(app.userId, "founder");
  await userRepo.setOnboardingStatus(app.userId, "role_selected");

  await auditRepo.append({
    action: "founder_approved",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole: null,
    newRole: "founder",
    ip: meta?.ip,
    metadata: { applicationId, jurorWallet },
  });

  await alertRoleEscalation({
    actorId: meta?.actorId ?? "juror",
    targetId: app.userId,
    oldRole: null,
    newRole: "founder",
    ip: meta?.ip ?? null,
  });

  await refreshRepo.revokeAllForUser(app.userId);

  log.info(
    { applicationId, userId: app.userId, jurorWallet },
    "Founder application approved",
  );
  return { applicationId, user };
}

export async function rejectApplication(
  jurorWallet: string,
  applicationId: string,
  reason?: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can reject founder applications");
  }

  const app = await founderAppRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Founder application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }

  const updated = await founderAppRepo.setStatus(applicationId, {
    status: "rejected",
    reviewedBy: jurorWallet,
    rejectReason: reason ? sanitizeText(reason, 500) : null,
  });

  await auditRepo.append({
    action: "founder_rejected",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole: null,
    newRole: null,
    ip: meta?.ip,
    metadata: { applicationId, reason: reason ?? null },
  });

  log.info({ applicationId, jurorWallet }, "Founder application rejected");
  return updated;
}
