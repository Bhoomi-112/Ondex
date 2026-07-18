import { describe, it, expect, vi, beforeEach } from "vitest";
import { ValidationError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/session.repository.js", () => ({
  create: vi.fn(),
  findById: vi.fn(),
  deleteById: vi.fn(),
}));

import * as sessionRepo from "../../src/repositories/session.repository.js";
import * as authService from "../../src/services/auth.service.js";

const mockRepo = vi.mocked(sessionRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthService", () => {
  describe("createChallenge", () => {
    it("returns a base64 XDR challenge for valid wallet", async () => {
      const result = await authService.createChallenge(
        "GCYG74K23RLXHZILCDG33ZACMZ2VO3ECTZ6H5SQR56AYPEH7AMY5YXVR",
      );
      expect(result.tx).toBeTruthy();
      expect(typeof result.tx).toBe("string");
      expect(result.network_passphrase).toBeTruthy();
      expect(result.identity_note).toBe("Ondex Authentication");
    });

    it("throws ValidationError for invalid wallet address", async () => {
      await expect(authService.createChallenge("INVALID")).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("verifyChallenge", () => {
    it("returns invalid for garbage XDR", async () => {
      const result = await authService.verifyChallenge(
        "challenge",
        "garbage-xdr",
      );
      expect(result.isValid).toBe(false);
      expect(result.wallet).toBe("");
    });
  });

  describe("createSession", () => {
    it("creates session and returns id + expiry", async () => {
      mockRepo.create.mockResolvedValue(undefined as any);
      const result = await authService.createSession("GWALLET");
      expect(result.sessionId).toBeTruthy();
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(mockRepo.create).toHaveBeenCalledWith(
        result.sessionId,
        "GWALLET",
        result.expiresAt,
      );
    });
  });

  describe("validateSession", () => {
    it("returns valid session with correct wallet", async () => {
      const futureDate = new Date(Date.now() + 3600000);
      mockRepo.findById.mockResolvedValue({
        wallet: "GWALLET",
        expiresAt: futureDate,
      } as any);
      const result = await authService.validateSession("sess-123");
      expect(result.isValid).toBe(true);
      expect(result.wallet).toBe("GWALLET");
    });

    it("returns invalid for nonexistent session", async () => {
      mockRepo.findById.mockResolvedValue(null);
      const result = await authService.validateSession("missing");
      expect(result.isValid).toBe(false);
    });

    it("expires and deletes old sessions", async () => {
      const pastDate = new Date(Date.now() - 3600000);
      mockRepo.findById.mockResolvedValue({
        wallet: "GWALLET",
        expiresAt: pastDate,
      } as any);
      mockRepo.deleteById.mockResolvedValue(undefined as any);
      const result = await authService.validateSession("old-sess");
      expect(result.isValid).toBe(false);
      expect(mockRepo.deleteById).toHaveBeenCalledWith("old-sess");
    });
  });

  describe("destroySession", () => {
    it("delegates to repo", async () => {
      mockRepo.deleteById.mockResolvedValue(undefined as any);
      await authService.destroySession("sess-456");
      expect(mockRepo.deleteById).toHaveBeenCalledWith("sess-456");
    });
  });
});
