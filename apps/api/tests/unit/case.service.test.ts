import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/case.repository.js", () => ({
  findByCaseId: vi.fn(),
  findByStatus: vi.fn(),
  countByStatus: vi.fn(),
  upsertByCaseId: vi.fn(),
  updateStatus: vi.fn(),
  addJuror: vi.fn(),
  addVote: vi.fn(),
}));

import * as caseRepo from "../../src/repositories/case.repository.js";
import * as caseService from "../../src/services/case.service.js";

const mockRepo = vi.mocked(caseRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CaseService", () => {
  describe("getCase", () => {
    it("returns case when found", async () => {
      const fake = { caseId: 1, status: "Voting", forVotes: 0 };
      mockRepo.findByCaseId.mockResolvedValue(fake as any);
      const result = await caseService.getCase(1);
      expect(result).toEqual(fake);
    });

    it("throws NotFoundError", async () => {
      mockRepo.findByCaseId.mockResolvedValue(null);
      await expect(caseService.getCase(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("listCases", () => {
    it("returns paginated results", async () => {
      mockRepo.findByStatus.mockResolvedValue([{ caseId: 1 }] as any);
      mockRepo.countByStatus.mockResolvedValue(1);
      const result = await caseService.listCases({ status: "Voting" });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("defaults status to Voting", async () => {
      mockRepo.findByStatus.mockResolvedValue([]);
      mockRepo.countByStatus.mockResolvedValue(0);
      await caseService.listCases({});
      expect(mockRepo.findByStatus).toHaveBeenCalledWith("Voting", 50, 0);
    });
  });

  describe("getCaseStats", () => {
    it("returns counts per status", async () => {
      mockRepo.countByStatus.mockImplementation(async (s: string) => {
        const map: Record<string, number> = {
          Voting: 3,
          Resolved: 7,
          Disputed: 1,
          Slashed: 0,
        };
        return map[s] ?? 0;
      });
      const stats = await caseService.getCaseStats();
      expect(stats).toEqual({
        Voting: 3,
        Resolved: 7,
        Disputed: 1,
        Slashed: 0,
      });
    });
  });

  describe("processCaseEvent", () => {
    it("handles ASSIGN — creates case and assigns jurors", async () => {
      mockRepo.findByCaseId.mockResolvedValue(null);
      mockRepo.upsertByCaseId.mockResolvedValue({} as any);
      mockRepo.addJuror.mockResolvedValue({} as any);

      await caseService.processCaseEvent({
        eventName: "ASSIGN",
        caseId: 1,
        jurors: ["GAAA", "GBBB", "GCCC"],
      });

      expect(mockRepo.upsertByCaseId).toHaveBeenCalledWith(1, {
        status: "Voting",
        forVotes: 0,
        againstVotes: 0,
        totalVotes: 0,
      });
      expect(mockRepo.addJuror).toHaveBeenCalledTimes(3);
    });

    it("ASSIGN skips upsert if case already exists", async () => {
      mockRepo.findByCaseId.mockResolvedValue({
        caseId: 1,
        status: "Voting",
      } as any);
      mockRepo.addJuror.mockResolvedValue({} as any);

      await caseService.processCaseEvent({
        eventName: "ASSIGN",
        caseId: 1,
        jurors: ["GAAA"],
      });

      expect(mockRepo.upsertByCaseId).not.toHaveBeenCalled();
      expect(mockRepo.addJuror).toHaveBeenCalledWith(1, "GAAA");
    });

    it("throws ValidationError for ASSIGN without caseId", async () => {
      await expect(
        caseService.processCaseEvent({ eventName: "ASSIGN" }),
      ).rejects.toThrow(ValidationError);
    });

    it("handles VOTE — tallies votes correctly", async () => {
      mockRepo.findByCaseId.mockResolvedValue({
        caseId: 1,
        forVotes: 1,
        againstVotes: 0,
      } as any);
      mockRepo.updateStatus.mockResolvedValue({} as any);
      mockRepo.addVote.mockResolvedValue({} as any);

      await caseService.processCaseEvent({
        eventName: "VOTE",
        caseId: 1,
        jurorAddr: "GJUROR",
        vote: "For",
      });

      expect(mockRepo.updateStatus).toHaveBeenCalledWith(1, "Voting", {
        forVotes: 2,
        againstVotes: 0,
        totalVotes: 2,
      });
      expect(mockRepo.addVote).toHaveBeenCalledWith(1, "GJUROR", "For");
    });

    it("VOTE tracks against votes", async () => {
      mockRepo.findByCaseId.mockResolvedValue({
        caseId: 1,
        forVotes: 0,
        againstVotes: 2,
      } as any);
      mockRepo.updateStatus.mockResolvedValue({} as any);
      mockRepo.addVote.mockResolvedValue({} as any);

      await caseService.processCaseEvent({
        eventName: "VOTE",
        caseId: 1,
        jurorAddr: "GJUROR2",
        vote: "Against",
      });

      expect(mockRepo.updateStatus).toHaveBeenCalledWith(1, "Voting", {
        forVotes: 0,
        againstVotes: 3,
        totalVotes: 3,
      });
    });

    it("throws for VOTE with missing fields", async () => {
      await expect(
        caseService.processCaseEvent({
          eventName: "VOTE",
          caseId: 1,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it("handles RESOLVE", async () => {
      mockRepo.updateStatus.mockResolvedValue({} as any);
      await caseService.processCaseEvent({
        eventName: "RESOLVE",
        caseId: 1,
        forVotes: 4,
        againstVotes: 1,
      });
      expect(mockRepo.updateStatus).toHaveBeenCalledWith(
        1,
        "Resolved",
        expect.objectContaining({
          forVotes: 4,
          againstVotes: 1,
          totalVotes: 5,
        }),
      );
    });

    it("handles DISPUTE", async () => {
      mockRepo.updateStatus.mockResolvedValue({} as any);
      await caseService.processCaseEvent({
        eventName: "DISPUTE",
        caseId: 1,
      });
      expect(mockRepo.updateStatus).toHaveBeenCalledWith(1, "Disputed");
    });

    it("handles SLASH", async () => {
      mockRepo.updateStatus.mockResolvedValue({} as any);
      await caseService.processCaseEvent({
        eventName: "SLASH",
        caseId: 1,
      });
      expect(mockRepo.updateStatus).toHaveBeenCalledWith(
        1,
        "Slashed",
        expect.objectContaining({ resolvedAt: expect.any(Date) }),
      );
    });
  });
});
