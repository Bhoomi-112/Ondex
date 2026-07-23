import { config } from "../config.js";
import { createLogger } from "../lib/logger.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../lib/errors.js";
import { sanitizeText, sanitizeOptional } from "../lib/sanitize.js";
import * as juryAppRepo from "../repositories/jury-application.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import { alertRoleEscalation } from "../lib/alerts.js";
import * as authService from "./auth.service.js";

const log = createLogger("JuryApplicationService");

export async function applyAsJury(
  userId: string,
  data: { statement: string; experience?: string },
) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  if (!user.wallet) {
    throw new ValidationError(
      "A connected Stellar wallet is required to apply as jury",
    );
  }
  if (user.role === "jury") {
    throw new ConflictError("User is already a jury member");
  }
  if (user.role === "founder" || user.role === "investor") {
    throw new ConflictError(
      "Identity already has an active role. One identity maps to exactly one role.",
    );
  }

  const pending = await juryAppRepo.findPendingByUser(userId);
  if (pending) {
    throw new ConflictError("A pending jury application already exists");
  }

  const statement = sanitizeText(data.statement ?? "", 2000);
  if (!statement || statement.length < 20) {
    throw new ValidationError(
      "Statement must be at least 20 characters describing your qualifications",
    );
  }

  const application = await juryAppRepo.create({
    userId,
    wallet: user.wallet,
    statement,
    experience: sanitizeOptional(data.experience, 2000),
  });

  log.info({ userId, applicationId: application.id }, "Jury application created");
  return application;
}

export async function listApplications(adminWallet: string, status?: string) {
  authService.assertAdminWallet(adminWallet);
  const allowed = ["pending", "approved", "rejected"] as const;
  const filter =
    status && (allowed as readonly string[]).includes(status)
      ? (status as (typeof allowed)[number])
      : undefined;
  return juryAppRepo.listByStatus(filter);
}

export async function approveApplication(
  adminWallet: string,
  applicationId: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  authService.assertAdminWallet(adminWallet);

  const app = await juryAppRepo.findById(applicationId);
  if (!app) {
    throw new NotFoundError("Jury application not found");
  }
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }

  if (app.user.role && app.user.role !== "jury") {
    throw new ConflictError(
      "Applicant already has a non-jury role; identity conflict",
    );
  }

  const oldRole = app.user.role;

  await juryAppRepo.setStatus(applicationId, {
    status: "approved",
    reviewedBy: adminWallet,
  });

  const user = await userRepo.promoteToJury(app.userId);

  await auditRepo.append({
    action: "jury_approved",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole,
    newRole: "jury",
    ip: meta?.ip,
    metadata: { applicationId, adminWallet },
  });

  await alertRoleEscalation({
    actorId: meta?.actorId ?? "admin",
    targetId: app.userId,
    oldRole,
    newRole: "jury",
    ip: meta?.ip ?? null,
  });

  await refreshRepo.revokeAllForUser(app.userId);

  log.info(
    { applicationId, userId: app.userId, adminWallet },
    "Jury application approved — user promoted to jury",
  );
  return { applicationId, user };
}

export async function rejectApplication(
  adminWallet: string,
  applicationId: string,
  reason?: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  authService.assertAdminWallet(adminWallet);

  const app = await juryAppRepo.findById(applicationId);
  if (!app) {
    throw new NotFoundError("Jury application not found");
  }
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }

  const updated = await juryAppRepo.setStatus(applicationId, {
    status: "rejected",
    reviewedBy: adminWallet,
    rejectReason: reason ? sanitizeText(reason, 500) : null,
  });

  await auditRepo.append({
    action: "jury_rejected",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole: app.user.role,
    newRole: app.user.role,
    ip: meta?.ip,
    metadata: { applicationId, reason: reason ?? null },
  });

  log.info({ applicationId, adminWallet }, "Jury application rejected");
  return updated;
}

export function isAdminWallet(wallet: string | null | undefined): boolean {
  return !!wallet && wallet === config.adminAddress;
}

export async function getApplicationStatus(userId: string) {
  const app = await juryAppRepo.findAnyByUser(userId);
  if (!app) return null;
  return {
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    reviewedAt: app.reviewedAt,
    rejectReason: app.rejectReason,
  };
}
