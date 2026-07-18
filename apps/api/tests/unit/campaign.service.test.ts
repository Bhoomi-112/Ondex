import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/campaign.repository.js", () => ({
  findByCampaignId: vi.fn(),
  findByState: vi.fn(),
  findByStartup: vi.fn(),
  findByInvestor: vi.fn(),
  countByState: vi.fn(),
  upsertByCampaignId: vi.fn(),
  updateState: vi.fn(),
}));

import * as campaignRepo from "../../src/repositories/campaign.repository.js";
import * as campaignService from "../../src/services/campaign.service.js";

const mockRepo = vi.mocked(campaignRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CampaignService", () => {
  describe("getCampaign", () => {
    it("returns campaign when found", async () => {
      const fake = { campaignId: 1, state: "DEPOSITED" };
      mockRepo.findByCampaignId.mockResolvedValue(fake as any);
      const result = await campaignService.getCampaign(1);
      expect(result).toEqual(fake);
      expect(mockRepo.findByCampaignId).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when campaign not found", async () => {
      mockRepo.findByCampaignId.mockResolvedValue(null);
      await expect(campaignService.getCampaign(999)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("listCampaigns", () => {
    it("returns paginated results by state", async () => {
      mockRepo.findByState.mockResolvedValue([{ campaignId: 1 }] as any);
      mockRepo.countByState.mockResolvedValue(1);
      const result = await campaignService.listCampaigns({
        state: "DEPOSITED",
        limit: 10,
        offset: 0,
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(5);
    });

    it("defaults to limit=50 offset=0", async () => {
      mockRepo.findByState.mockResolvedValue([]);
      mockRepo.countByState.mockResolvedValue(0);
      await campaignService.listCampaigns({});
      expect(mockRepo.findByState).toHaveBeenCalledWith(
        "DEPOSITED",
        50,
        0,
      );
    });
  });

  describe("getCampaignStats", () => {
    it("returns counts per state", async () => {
      mockRepo.countByState.mockImplementation(async (s: string) => {
        const map: Record<string, number> = {
          DEPOSITED: 5,
          APPROVED: 3,
          DISPUTED: 1,
          RELEASED: 2,
          REFUNDED: 0,
        };
        return map[s] ?? 0;
      });
      const stats = await campaignService.getCampaignStats();
      expect(stats).toEqual({
        DEPOSITED: 5,
        APPROVED: 3,
        DISPUTED: 1,
        RELEASED: 2,
        REFUNDED: 0,
      });
    });
  });

  describe("processCampaignEvent", () => {
    it("handles DEPOSIT event", async () => {
      mockRepo.upsertByCampaignId.mockResolvedValue({} as any);
      await campaignService.processCampaignEvent({
        eventName: "DEPOSIT",
        campaignId: 1,
        startup: "GABC...",
        investor: "GDEF...",
        amount: "1000",
        asset: "XLM",
      });
      expect(mockRepo.upsertByCampaignId).toHaveBeenCalledWith(1, {
        startupAddress: "GABC...",
        investorAddress: "GDEF...",
        amount: BigInt(1000),
        asset: "XLM",
        state: "DEPOSITED",
      });
    });

    it("throws ValidationError for DEPOSIT missing fields", async () => {
      await expect(
        campaignService.processCampaignEvent({
          eventName: "DEPOSIT",
          campaignId: 1,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it("handles APPROVED event", async () => {
      mockRepo.updateState.mockResolvedValue({} as any);
      await campaignService.processCampaignEvent({
        eventName: "APPROVED",
        campaignId: 1,
      });
      expect(mockRepo.updateState).toHaveBeenCalledWith(1, "APPROVED", {
        approvedAt: expect.any(Date),
      });
    });

    it("throws ValidationError for unknown event", async () => {
      await expect(
        campaignService.processCampaignEvent({ eventName: "UNKNOWN" }),
      ).rejects.toThrow(ValidationError);
    });
  });
});
