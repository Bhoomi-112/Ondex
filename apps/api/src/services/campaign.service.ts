import { NotFoundError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";
import * as campaignRepo from "../repositories/campaign.repository.js";

const log = createLogger("CampaignService");

export async function getCampaign(campaignId: number) {
  const campaign = await campaignRepo.findByCampaignId(campaignId);
  if (!campaign) throw new NotFoundError(`Campaign ${campaignId} not found`);
  return campaign;
}

export async function listCampaigns(filters: {
  state?: string;
  startup?: string;
  investor?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  let items: Awaited<ReturnType<typeof campaignRepo.findByCampaignId>>[] = [];

  if (filters.state) {
    items = await campaignRepo.findByState(filters.state, limit, offset);
  } else if (filters.startup) {
    items = await campaignRepo.findByStartup(filters.startup, limit, offset);
  } else if (filters.investor) {
    items = await campaignRepo.findByInvestor(filters.investor, limit, offset);
  } else {
    // No filter — return all by state counts for total, paginated listing
    items = await campaignRepo.findByState("DEPOSITED", limit, offset);
  }

  const states = ["DEPOSITED", "APPROVED", "DISPUTED", "RELEASED", "REFUNDED"];
  let total = 0;
  for (const s of states) {
    total += await campaignRepo.countByState(s);
  }

  return { items, total };
}

export async function getCampaignStats() {
  const states = ["DEPOSITED", "APPROVED", "DISPUTED", "RELEASED", "REFUNDED"];
  const counts: Record<string, number> = {};
  for (const s of states) {
    counts[s] = await campaignRepo.countByState(s);
  }
  return counts;
}

export async function processCampaignEvent(eventData: any) {
  const { eventName } = eventData;
  log.info({ eventName }, "Processing campaign event");

  switch (eventName) {
    case "DEPOSIT": {
      const { campaignId, startup, investor, amount, asset } = eventData;
      if (!campaignId || !startup || !investor || !amount || !asset) {
        throw new ValidationError("DEPOSIT event missing required fields");
      }
      return campaignRepo.upsertByCampaignId(campaignId, {
        startupAddress: startup,
        investorAddress: investor,
        amount: BigInt(amount),
        asset,
        state: "DEPOSITED",
      });
    }
    case "APPROVED": {
      const { campaignId } = eventData;
      if (!campaignId) throw new ValidationError("APPROVED event missing campaignId");
      return campaignRepo.updateState(campaignId, "APPROVED", {
        approvedAt: new Date(),
      });
    }
    case "DISPUTE": {
      const { campaignId, disputeDeadline } = eventData;
      if (!campaignId) throw new ValidationError("DISPUTE event missing campaignId");
      return campaignRepo.updateState(campaignId, "DISPUTED", {
        disputeDeadline: disputeDeadline ? new Date(disputeDeadline) : undefined,
      });
    }
    case "INV_VOTE": {
      // Investor vote on dispute — campaign stays DISPUTED until resolution
      const { campaignId, vote } = eventData;
      if (!campaignId) throw new ValidationError("INV_VOTE event missing campaignId");
      log.info({ campaignId, vote }, "Investor vote recorded");
      return campaignRepo.findByCampaignId(campaignId);
    }
    case "RELEASE": {
      const { campaignId } = eventData;
      if (!campaignId) throw new ValidationError("RELEASE event missing campaignId");
      return campaignRepo.updateState(campaignId, "RELEASED");
    }
    case "REFUND": {
      const { campaignId } = eventData;
      if (!campaignId) throw new ValidationError("REFUND event missing campaignId");
      return campaignRepo.updateState(campaignId, "REFUNDED");
    }
    default:
      throw new ValidationError(`Unknown campaign event: ${eventName}`);
  }
}
