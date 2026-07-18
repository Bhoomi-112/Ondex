import { createLogger } from "../lib/logger.js";
import * as applicationRepo from "../repositories/application.repository.js";

const log = createLogger("ApplicationService");

export async function getApplication(onChainId: number) {
  return applicationRepo.findByOnChainId(onChainId);
}

export async function listByStartup(startup: string) {
  return applicationRepo.findByStartup(startup);
}

export async function listPending() {
  return applicationRepo.findAllPending();
}

export async function getVotes(applicationId: number) {
  return applicationRepo.getVotesByApplication(applicationId);
}

export async function getVotesByVoter(voter: string) {
  return applicationRepo.getVotesByVoter(voter);
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
        startup: startup || "",
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
