import { NotFoundError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";
import * as identityRepo from "../repositories/identity.repository.js";

const log = createLogger("IdentityService");

export async function getIdentity(identityId: string) {
  const identity = await identityRepo.findByIdentityId(identityId);
  if (!identity) throw new NotFoundError(`Identity ${identityId} not found`);
  return identity;
}

export async function listIdentities(filters: {
  committed?: boolean;
  revealed?: boolean;
  limit?: number;
  offset?: number;
}) {
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  let items: Awaited<ReturnType<typeof identityRepo.findByIdentityId>>[] = [];

  if (filters.committed === true) {
    items = await identityRepo.findCommitted(limit, offset);
  } else if (filters.revealed === true) {
    items = await identityRepo.findRevealed(limit, offset);
  }

  // Count total — approximate based on filters
  const allCommitted = await identityRepo.findCommitted(0, 0);
  const total = allCommitted.length;

  return { items, total };
}

export async function processIdentityEvent(eventData: any) {
  const { eventName } = eventData;
  log.info({ eventName }, "Processing identity event");

  switch (eventName) {
    case "COMMIT": {
      const { identityId, commitmentHash } = eventData;
      if (!identityId || !commitmentHash) {
        throw new ValidationError("COMMIT event missing required fields");
      }
      return identityRepo.upsertByIdentityId(identityId, {
        commitmentHash,
        isCommitted: true,
      });
    }
    case "LNK_CASE": {
      const { identityId, caseId } = eventData;
      if (!identityId || !caseId) {
        throw new ValidationError("LNK_CASE event missing required fields");
      }
      return identityRepo.upsertByIdentityId(identityId, {
        linkedCaseId: caseId,
      });
    }
    case "REVEAL": {
      const { identityId, backendRef } = eventData;
      if (!identityId) {
        throw new ValidationError("REVEAL event missing identityId");
      }
      return identityRepo.updateReveal(
        identityId,
        backendRef ?? "",
      );
    }
    default:
      throw new ValidationError(`Unknown identity event: ${eventName}`);
  }
}
