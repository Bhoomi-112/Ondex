import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/identity.repository.js", () => ({
  findByIdentityId: vi.fn(),
  findCommitted: vi.fn(),
  findRevealed: vi.fn(),
  upsertByIdentityId: vi.fn(),
  updateReveal: vi.fn(),
}));

import * as identityRepo from "../../src/repositories/identity.repository.js";
import * as identityService from "../../src/services/identity.service.js";

const mockRepo = vi.mocked(identityRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("IdentityService", () => {
  describe("getIdentity", () => {
    it("returns identity when found", async () => {
      const fake = { identityId: "id-1", commitmentHash: "abc123" };
      mockRepo.findByIdentityId.mockResolvedValue(fake as any);
      const result = await identityService.getIdentity("id-1");
      expect(result).toEqual(fake);
    });

    it("throws NotFoundError", async () => {
      mockRepo.findByIdentityId.mockResolvedValue(null);
      await expect(
        identityService.getIdentity("missing"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("listIdentities", () => {
    it("returns committed identities", async () => {
      mockRepo.findCommitted.mockResolvedValue([
        { identityId: "id-1" },
      ] as any);
      const result = await identityService.listIdentities({
        committed: true,
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("returns empty when no filter", async () => {
      mockRepo.findCommitted.mockResolvedValue([]);
      const result = await identityService.listIdentities({});
      expect(result.items).toHaveLength(0);
    });
  });

  describe("processIdentityEvent", () => {
    it("handles COMMIT event", async () => {
      mockRepo.upsertByIdentityId.mockResolvedValue({} as any);
      await identityService.processIdentityEvent({
        eventName: "COMMIT",
        identityId: "id-1",
        commitmentHash: "abc123",
      });
      expect(mockRepo.upsertByIdentityId).toHaveBeenCalledWith("id-1", {
        commitmentHash: "abc123",
        isCommitted: true,
      });
    });

    it("throws for COMMIT with missing fields", async () => {
      await expect(
        identityService.processIdentityEvent({
          eventName: "COMMIT",
          identityId: "id-1",
        }),
      ).rejects.toThrow(ValidationError);
    });

    it("handles LNK_CASE event", async () => {
      mockRepo.upsertByIdentityId.mockResolvedValue({} as any);
      await identityService.processIdentityEvent({
        eventName: "LNK_CASE",
        identityId: "id-1",
        caseId: 42,
      });
      expect(mockRepo.upsertByIdentityId).toHaveBeenCalledWith("id-1", {
        linkedCaseId: 42,
      });
    });

    it("handles REVEAL event", async () => {
      mockRepo.updateReveal.mockResolvedValue({} as any);
      await identityService.processIdentityEvent({
        eventName: "REVEAL",
        identityId: "id-1",
        backendRef: "ref-abc",
      });
      expect(mockRepo.updateReveal).toHaveBeenCalledWith("id-1", "ref-abc");
    });

    it("REVEAL defaults backendRef to empty string", async () => {
      mockRepo.updateReveal.mockResolvedValue({} as any);
      await identityService.processIdentityEvent({
        eventName: "REVEAL",
        identityId: "id-1",
      });
      expect(mockRepo.updateReveal).toHaveBeenCalledWith("id-1", "");
    });

    it("throws for unknown event", async () => {
      await expect(
        identityService.processIdentityEvent({ eventName: "NOOP" }),
      ).rejects.toThrow(ValidationError);
    });
  });
});
