import { createLogger } from "../lib/logger.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../lib/errors.js";
import { sanitizeText, sanitizeOptional } from "../lib/sanitize.js";
import * as investorAppRepo from "../repositories/investor-application.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import { alertRoleEscalation } from "../lib/alerts.js";

const log = createLogger("InvestorApplicationService");

export async function applyAsInvestor(
  userId: string,
  data: {
    fullName: string;
    entityType?: string;
    accreditation?: string;
    aum?: string;
    sourceOfFunds?: string;
    portfolioDesc?: string;
  },
) {
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  if (!user.wallet) {
    throw new ValidationError("A connected Stellar wallet is required");
  }
  if (user.role === "investor") {
    throw new ConflictError("You are already an investor");
  }
  if (user.role) {
    throw new ConflictError("Identity already has an active role");
  }

  const pending = await investorAppRepo.findPendingByUser(userId);
  if (pending) {
    throw new ConflictError("A pending investor application already exists");
  }

  const fullName = sanitizeText(data.fullName ?? "", 200);
  if (!fullName || fullName.length < 2) {
    throw new ValidationError("Full name is required (at least 2 characters)");
  }

  const application = await investorAppRepo.create({
    userId,
    wallet: user.wallet,
    fullName,
    entityType: sanitizeOptional(data.entityType, 100),
    accreditation: sanitizeOptional(data.accreditation, 100),
    aum: sanitizeOptional(data.aum, 200),
    sourceOfFunds: sanitizeOptional(data.sourceOfFunds, 200),
    portfolioDesc: sanitizeOptional(data.portfolioDesc, 2000),
  });

  log.info({ userId, applicationId: application.id }, "Investor application created");
  return application;
}

export async function getApplicationStatus(userId: string) {
  const app = await investorAppRepo.findAnyByUser(userId);
  if (!app) return null;
  return {
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    reviewedAt: app.reviewedAt,
    rejectReason: app.rejectReason,
  };
}

export async function listApplications(adminWallet: string, status?: string) {
  const admin = await userRepo.findByWallet(adminWallet);
  if (!admin || admin.role !== "jury") {
    throw new ForbiddenError("Only admins can list investor applications");
  }
  const allowed = ["pending", "approved", "rejected"] as const;
  const filter =
    status && (allowed as readonly string[]).includes(status)
      ? (status as (typeof allowed)[number])
      : undefined;
  return investorAppRepo.listByStatus(filter);
}

export async function approveApplication(
  adminWallet: string,
  applicationId: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  const admin = await userRepo.findByWallet(adminWallet);
  if (!admin || admin.role !== "jury") {
    throw new ForbiddenError("Only admins can approve investor applications");
  }

  const app = await investorAppRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Investor application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }
  if (app.user.role) {
    throw new ConflictError("Applicant already has an active role");
  }

  await investorAppRepo.setStatus(applicationId, {
    status: "approved",
    reviewedBy: adminWallet,
  });

  const user = await userRepo.setRole(app.userId, "investor");
  await userRepo.setOnboardingStatus(app.userId, "role_selected");

  await auditRepo.append({
    action: "investor_approved",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole: null,
    newRole: "investor",
    ip: meta?.ip,
    metadata: { applicationId, adminWallet },
  });

  await alertRoleEscalation({
    actorId: meta?.actorId ?? "admin",
    targetId: app.userId,
    oldRole: null,
    newRole: "investor",
    ip: meta?.ip ?? null,
  });

  await refreshRepo.revokeAllForUser(app.userId);

  log.info(
    { applicationId, userId: app.userId, adminWallet },
    "Investor application approved",
  );
  return { applicationId, user };
}

export async function rejectApplication(
  adminWallet: string,
  applicationId: string,
  reason?: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  const admin = await userRepo.findByWallet(adminWallet);
  if (!admin || admin.role !== "jury") {
    throw new ForbiddenError("Only admins can reject investor applications");
  }

  const app = await investorAppRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Investor application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }

  const updated = await investorAppRepo.setStatus(applicationId, {
    status: "rejected",
    reviewedBy: adminWallet,
    rejectReason: reason ? sanitizeText(reason, 500) : null,
  });

  await auditRepo.append({
    action: "investor_rejected",
    actorId: meta?.actorId ?? null,
    targetId: app.userId,
    oldRole: null,
    newRole: null,
    ip: meta?.ip,
    metadata: { applicationId, reason: reason ?? null },
  });

  log.info({ applicationId, adminWallet }, "Investor application rejected");
  return updated;
}
