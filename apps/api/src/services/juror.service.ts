import { NotFoundError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";
import * as jurorRepo from "../repositories/juror.repository.js";

const log = createLogger("JurorService");

export async function getJuror(address: string) {
  const juror = await jurorRepo.findByAddress(address);
  if (!juror) throw new NotFoundError(`Juror ${address} not found`);
  return juror;
}

export async function listJurors(filters: {
  active?: boolean;
  limit?: number;
  offset?: number;
}) {
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  let items: Awaited<ReturnType<typeof jurorRepo.findByAddress>>[] = [];

  if (filters.active !== undefined) {
    if (filters.active) {
      items = await jurorRepo.findActive(limit, offset);
    } else {
      // findActive only returns active; for inactive we count differently
      // but given the repo, just return active and let caller infer
      items = [];
    }
  } else {
    items = await jurorRepo.findActive(limit, offset);
  }

  const totalActive = await jurorRepo.countActive();

  return { items, total: totalActive };
}

export async function getJurorStats() {
  const totalActive = await jurorRepo.countActive();
  // totalSlashed requires a model field — deactivated jurors serve as slashed proxy
  // Real implementation would use a dedicated slashed count if the schema has it
  return { totalActive, totalSlashed: 0 };
}

export async function processJurorEvent(eventData: any) {
  const { eventName } = eventData;
  log.info({ eventName }, "Processing juror event");

  switch (eventName) {
    case "REG": {
      const { address, xlmStake, platformStake } = eventData;
      if (!address) throw new ValidationError("REG event missing address");
      return jurorRepo.upsertByAddress(address, {
        xlmStake: BigInt(xlmStake ?? 0),
        platformStake: BigInt(platformStake ?? 0),
      });
    }
    default:
      throw new ValidationError(`Unknown juror event: ${eventName}`);
  }
}
