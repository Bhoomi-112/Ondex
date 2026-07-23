import { createLogger } from "../lib/logger.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../lib/errors.js";
import { sanitizeText, sanitizeOptional } from "../lib/sanitize.js";
import * as applicationRepo from "../repositories/application.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import * as auditRepo from "../repositories/audit.repository.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import { alertRoleEscalation } from "../lib/alerts.js";

const log = createLogger("ApplicationService");

const XLM_TO_STROOPS = 10_000_000n;

export async function applyAsFounder(
  userId: string,
  data: {
    name: string;
    pitch: string;
    askAmount: bigint;
    experience?: string;
    website?: string;
    socials?: Record<string, string>;
    milestones?: { description: string; amount: bigint }[];
  },
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

  const pending = await applicationRepo.findPendingByUser(userId);
  if (pending) {
    throw new ConflictError("A pending founder application already exists");
  }

  const pitch = sanitizeText(data.pitch ?? "", 10000);
  if (!pitch || pitch.length < 20) {
    throw new ValidationError(
      "Description must be at least 20 characters describing your startup",
    );
  }

  const name = sanitizeText(data.name ?? "", 200);
  if (!name) {
    throw new ValidationError("Startup name is required");
  }

  // Convert XLM to stroops (1 XLM = 10^7 stroops)
  const askAmountInStroops = data.askAmount * XLM_TO_STROOPS;

  const application = await applicationRepo.createRoleApplication({
    userId,
    wallet: user.wallet,
    name,
    pitch,
    askAmount: askAmountInStroops,
    experience: sanitizeOptional(data.experience, 2000),
    website: data.website ? sanitizeText(data.website, 500) : null,
    socials: data.socials,
    milestones: data.milestones?.map((m) => ({
      description: sanitizeText(m.description, 2000),
      amount: m.amount * XLM_TO_STROOPS,
    })),
  });

  log.info({ userId, applicationId: application.id }, "Founder application created");
  return application;
}

export async function getApplicationStatus(userId: string) {
  const app = await applicationRepo.findAnyByUser(userId);
  if (!app) return null;
  return {
    id: app.id,
    status: app.status,
    createdAt: app.createdAt,
    reviewedAt: app.reviewedAt,
    rejectReason: app.rejectReason,
    name: app.name,
    pitch: app.pitch,
    askAmount: app.askAmount,
  };
}

export async function listApplications(jurorWallet: string, status?: string) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can list founder applications");
  }
  return applicationRepo.listRoleApplications(status);
}

export async function approveApplication(
  jurorWallet: string,
  applicationId: number,
  meta?: { actorId?: string; ip?: string | null },
) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can approve founder applications");
  }

  const app = await applicationRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Founder application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }
  if (app.user?.role) {
    throw new ConflictError("Applicant already has an active role");
  }

  await applicationRepo.setRoleApplicationStatus(applicationId, {
    status: "approved",
    reviewedBy: jurorWallet,
  });

  const user = await userRepo.setRole(app.userId!, "founder");
  await userRepo.setOnboardingStatus(app.userId!, "role_selected");

  await auditRepo.append({
    action: "founder_approved",
    actorId: meta?.actorId ?? null,
    targetId: app.userId!,
    oldRole: null,
    newRole: "founder",
    ip: meta?.ip,
    metadata: { applicationId, jurorWallet },
  });

  await alertRoleEscalation({
    actorId: meta?.actorId ?? "juror",
    targetId: app.userId!,
    oldRole: null,
    newRole: "founder",
    ip: meta?.ip ?? null,
  });

  await refreshRepo.revokeAllForUser(app.userId!);

  log.info(
    { applicationId, userId: app.userId, jurorWallet },
    "Founder application approved",
  );
  return { applicationId, user };
}

export async function rejectApplication(
  jurorWallet: string,
  applicationId: number,
  reason?: string,
  meta?: { actorId?: string; ip?: string | null },
) {
  const juror = await userRepo.findByWallet(jurorWallet);
  if (!juror || juror.role !== "jury") {
    throw new ForbiddenError("Only jury members can reject founder applications");
  }

  const app = await applicationRepo.findById(applicationId);
  if (!app) throw new NotFoundError("Founder application not found");
  if (app.status !== "pending") {
    throw new ConflictError(`Application is already ${app.status}`);
  }

  const updated = await applicationRepo.setRoleApplicationStatus(applicationId, {
    status: "rejected",
    reviewedBy: jurorWallet,
    rejectReason: reason ? sanitizeText(reason, 500) : null,
  });

  await auditRepo.append({
    action: "founder_rejected",
    actorId: meta?.actorId ?? null,
    targetId: app.userId!,
    oldRole: null,
    newRole: null,
    ip: meta?.ip,
    metadata: { applicationId, reason: reason ?? null },
  });

  log.info({ applicationId, jurorWallet }, "Founder application rejected");
  return updated;
}

export async function getApplication(onChainId: number) {
  return applicationRepo.findByOnChainId(onChainId);
}

export async function listByStartup(startup: string) {
  return applicationRepo.findByWallet(startup);
}

export async function listPending() {
  return applicationRepo.findAllPendingFunding();
}

export async function getVotes(applicationId: number) {
  return applicationRepo.getVotesByApplication(applicationId);
}

export async function getVotesByVoter(voter: string) {
  return applicationRepo.getVotesByVoter(voter);
}

export async function createApplication(input: {
  startup: string;
  name: string;
  pitch: string;
  askAmount: bigint;
  maskName?: boolean;
  maskAddress?: boolean;
  milestones?: { description: string; amount: bigint }[];
  onChainId?: number;
}) {
  const onChainId =
    input.onChainId ??
    (Number(BigInt(Date.now()) % BigInt(2_000_000_000)) || 1);

  return applicationRepo.upsertByOnChainId(onChainId, {
    wallet: input.startup,
    name: input.name,
    pitch: input.pitch,
    askAmount: input.askAmount,
    status: "Submitted",
    maskName: input.maskName,
    maskAddress: input.maskAddress,
    milestones: input.milestones,
  });
}

export async function markApproved(onChainId: number) {
  return applicationRepo.updateStatus(onChainId, "Approved");
}

export async function markRejected(onChainId: number) {
  return applicationRepo.updateStatus(onChainId, "Rejected");
}

export async function recordVote(
  onChainId: number,
  voter: string,
  approve: boolean,
  commentHash = "",
) {
  const app = await applicationRepo.findByOnChainId(onChainId);
  if (!app) {
    throw new Error(`Application ${onChainId} not found`);
  }
  await applicationRepo.addVote(app.id, voter, approve, commentHash);
  if (app.status === "Submitted") {
    await applicationRepo.updateStatus(onChainId, "UnderReview");
  }
  return applicationRepo.getVotesByApplication(app.id);
}

export async function processPlatformEvent(eventData: any) {
  const { eventName } = eventData;
  log.info({ eventName }, "Processing platform event");

  switch (eventName) {
    case "APP_SUB": {
      const { campaignId, startup, name, askAmount } = eventData;
      if (startup === undefined) {
        log.warn({ eventName }, "APP_SUB missing startup, skipping");
        return;
      }
      return applicationRepo.upsertByOnChainId(Number(campaignId), {
        wallet: startup || "",
        name: name || "",
        pitch: "",
        askAmount: BigInt(askAmount || 0),
        status: "Submitted",
      });
    }
    case "VOTE": {
      const { campaignId, voter, approve, commentHash } = eventData;
      if (campaignId === undefined || voter === undefined) {
        log.warn({ eventName }, "VOTE missing required fields, skipping");
        return;
      }
      const app = await applicationRepo.findByOnChainId(Number(campaignId));
      if (app) {
        await applicationRepo.addVote(
          app.id,
          voter,
          Boolean(approve),
          commentHash || "",
        );
      }
      return;
    }
    case "APP_APR": {
      const { campaignId } = eventData;
      if (campaignId === undefined) return;
      return applicationRepo.updateStatus(Number(campaignId), "Approved");
    }
    case "APP_REJ": {
      const { campaignId } = eventData;
      if (campaignId === undefined) return;
      return applicationRepo.updateStatus(Number(campaignId), "Rejected");
    }
    default:
      log.debug({ eventName }, "Unknown platform event, ignoring");
  }
}
