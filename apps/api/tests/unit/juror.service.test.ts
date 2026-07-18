import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/juror.repository.js", () => ({
  findByAddress: vi.fn(),
  findActive: vi.fn(),
  countActive: vi.fn(),
  upsertByAddress: vi.fn(),
}));

import * as jurorRepo from "../../src/repositories/juror.repository.js";
import * as jurorService from "../../src/services/juror.service.js";

const mockRepo = vi.mocked(jurorRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JurorService", () => {
  describe("getJuror", () => {
    it("returns juror when found", async () => {
      const fake = { address: "GABC", xlmStake: BigInt(100) };
      mockRepo.findByAddress.mockResolvedValue(fake as any);
      const result = await jurorService.getJuror("GABC");
      expect(result).toEqual(fake);
    });

    it("throws NotFoundError", async () => {
      mockRepo.findByAddress.mockResolvedValue(null);
      await expect(jurorService.getJuror("GMISSING")).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("listJurors", () => {
    it("returns active jurors", async () => {
      mockRepo.findActive.mockResolvedValue([{ address: "GABC" }] as any);
      mockRepo.countActive.mockResolvedValue(5);
      const result = await jurorService.listJurors({ active: true });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(5);
    });

    it("returns all when no filter", async () => {
      mockRepo.findActive.mockResolvedValue([]);
      mockRepo.countActive.mockResolvedValue(0);
      await jurorService.listJurors({});
      expect(mockRepo.findActive).toHaveBeenCalledWith(50, 0);
    });
  });

  describe("getJurorStats", () => {
    it("returns active count", async () => {
      mockRepo.countActive.mockResolvedValue(12);
      const stats = await jurorService.getJurorStats();
      expect(stats.totalActive).toBe(12);
      expect(stats.totalSlashed).toBe(0);
    });
  });

  describe("processJurorEvent", () => {
    it("handles REG event", async () => {
      mockRepo.upsertByAddress.mockResolvedValue({} as any);
      await jurorService.processJurorEvent({
        eventName: "REG",
        address: "GNEW",
        xlmStake: "500",
        platformStake: "1000",
      });
      expect(mockRepo.upsertByAddress).toHaveBeenCalledWith("GNEW", {
        xlmStake: BigInt(500),
        platformStake: BigInt(1000),
      });
    });

    it("REG defaults stake to 0 if not provided", async () => {
      mockRepo.upsertByAddress.mockResolvedValue({} as any);
      await jurorService.processJurorEvent({
        eventName: "REG",
        address: "GNEW",
      });
      expect(mockRepo.upsertByAddress).toHaveBeenCalledWith("GNEW", {
        xlmStake: BigInt(0),
        platformStake: BigInt(0),
      });
    });

    it("throws for REG without address", async () => {
      await expect(
        jurorService.processJurorEvent({ eventName: "REG" }),
      ).rejects.toThrow(ValidationError);
    });

    it("throws for unknown event", async () => {
      await expect(
        jurorService.processJurorEvent({ eventName: "UNKNOWN" }),
      ).rejects.toThrow(ValidationError);
    });
  });
});
