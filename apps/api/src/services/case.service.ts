import { NotFoundError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";
import * as caseRepo from "../repositories/case.repository.js";

const log = createLogger("CaseService");

export async function getCase(caseId: number) {
  const c = await caseRepo.findByCaseId(caseId);
  if (!c) throw new NotFoundError(`Case ${caseId} not found`);
  return c;
}

export async function listCases(filters: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  const items = await caseRepo.findByStatus(
    filters.status ?? "Voting",
    limit,
    offset,
  );

  const total = await caseRepo.countByStatus(filters.status ?? "Voting");

  return { items, total, limit, offset };
}

export async function getCaseStats() {
  const statuses = ["Voting", "Resolved", "Disputed", "Slashed"];
  const counts: Record<string, number> = {};
  for (const s of statuses) {
    counts[s] = await caseRepo.countByStatus(s);
  }
  return counts;
}

export async function processCaseEvent(eventData: any) {
  const { eventName } = eventData;
  log.info({ eventName }, "Processing case event");

  switch (eventName) {
    case "ASSIGN": {
      const { caseId, jurors } = eventData;
      if (!caseId) {
        throw new ValidationError("ASSIGN event missing caseId");
      }
      const existing = await caseRepo.findByCaseId(caseId);
      if (!existing) {
        await caseRepo.upsertByCaseId(caseId, {
          status: "Voting",
          forVotes: 0,
          againstVotes: 0,
          totalVotes: 0,
        });
      }
      if (Array.isArray(jurors)) {
        for (const juror of jurors) {
          await caseRepo.addJuror(caseId, juror);
        }
      }
      return;
    }
    case "VOTE": {
      const { caseId, jurorAddr, vote } = eventData;
      if (!caseId || !jurorAddr || !vote) {
        throw new ValidationError("VOTE event missing required fields");
      }
      const isFor = vote === "For";
      const current = await caseRepo.findByCaseId(caseId);
      const forVotes = (current?.forVotes ?? 0) + (isFor ? 1 : 0);
      const againstVotes = (current?.againstVotes ?? 0) + (isFor ? 0 : 1);
      const totalVotes = forVotes + againstVotes;

      await caseRepo.updateStatus(caseId, "Voting", {
        forVotes,
        againstVotes,
        totalVotes,
      });
      return caseRepo.addVote(caseId, jurorAddr, vote);
    }
    case "RESOLVE": {
      const { caseId, forVotes, againstVotes } = eventData;
      if (!caseId) throw new ValidationError("RESOLVE event missing caseId");
      return caseRepo.updateStatus(caseId, "Resolved", {
        forVotes: forVotes ?? 0,
        againstVotes: againstVotes ?? 0,
        totalVotes: (forVotes ?? 0) + (againstVotes ?? 0),
        resolvedAt: new Date(),
      });
    }
    case "DISPUTE": {
      const { caseId } = eventData;
      if (!caseId) throw new ValidationError("DISPUTE event missing caseId");
      return caseRepo.updateStatus(caseId, "Disputed");
    }
    case "SLASH": {
      const { caseId } = eventData;
      if (!caseId) throw new ValidationError("SLASH event missing caseId");
      return caseRepo.updateStatus(caseId, "Slashed", {
        resolvedAt: new Date(),
      });
    }
    default:
      throw new ValidationError(`Unknown case event: ${eventName}`);
  }
}
