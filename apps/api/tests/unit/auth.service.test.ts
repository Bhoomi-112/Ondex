import { describe, it, expect, vi, beforeEach } from "vitest";
import { ValidationError, ConflictError, UnauthorizedError, ForbiddenError } from "../../src/lib/errors.js";

vi.mock("../../src/repositories/session.repository.js", () => ({
  create: vi.fn(),
  findById: vi.fn(),
  deleteById: vi.fn(),
}));

vi.mock("../../src/repositories/user.repository.js", () => ({
  findById: vi.fn(),
  findByWallet: vi.fn(),
  findByEmail: vi.fn(),
  createFromWallet: vi.fn(),
  setRole: vi.fn(),
  updateProfile: vi.fn(),
  setOnboardingStatus: vi.fn(),
  adminSetRole: vi.fn(),
}));

vi.mock("../../src/repositories/refresh-token.repository.js", () => ({
  create: vi.fn(),
  findByHash: vi.fn(),
  revoke: vi.fn(),
  revokeAllForUser: vi.fn(),
  revokeFamily: vi.fn(),
}));

vi.mock("../../src/repositories/auth-challenge.repository.js", () => ({
  create: vi.fn(),
  findByHash: vi.fn(),
  deleteById: vi.fn(),
  deleteExpired: vi.fn(),
}));

vi.mock("../../src/repositories/auth-event.repository.js", () => ({
  record: vi.fn(),
  recentForUser: vi.fn().mockResolvedValue([]),
  countFailedRoleChecks: vi.fn().mockResolvedValue(0),
  countRefreshReuse: vi.fn().mockResolvedValue(0),
}));

vi.mock("../../src/repositories/audit.repository.js", () => ({
  append: vi.fn(),
}));

vi.mock("../../src/lib/jwt.js", () => ({
  ACCESS_TOKEN_TTL_SECONDS: 900,
  signAccessToken: vi.fn().mockResolvedValue("access.jwt"),
  verifyAccessToken: vi.fn(),
  generateRefreshToken: vi.fn().mockReturnValue("refresh-raw"),
  hashToken: vi.fn().mockReturnValue("hash"),
}));

vi.mock("../../src/services/anomaly.service.js", () => ({
  checkImpossibleTravel: vi.fn(),
  checkRefreshReuseAnomaly: vi.fn(),
  checkRoleCheckBurst: vi.fn(),
}));

vi.mock("../../src/lib/alerts.js", () => ({
  alertRoleEscalation: vi.fn(),
  sendAlert: vi.fn(),
}));

import * as userRepo from "../../src/repositories/user.repository.js";
import * as refreshRepo from "../../src/repositories/refresh-token.repository.js";
import * as challengeRepo from "../../src/repositories/auth-challenge.repository.js";
import * as authService from "../../src/services/auth.service.js";

const mockUser = vi.mocked(userRepo);
const mockRefresh = vi.mocked(refreshRepo);
const mockChallenge = vi.mocked(challengeRepo);

beforeEach(() => {
  vi.clearAllMocks();
  mockChallenge.deleteExpired.mockResolvedValue({ count: 0 } as any);
  mockChallenge.create.mockResolvedValue({} as any);
});

describe("AuthService", () => {
  describe("createChallenge", () => {
    it("returns a base64 XDR challenge for valid wallet and stores single-use nonce", async () => {
      const result = await authService.createChallenge(
        "GCYG74K23RLXHZILCDG33ZACMZ2VO3ECTZ6H5SQR56AYPEH7AMY5YXVR",
      );
      expect(result.tx).toBeTruthy();
      expect(typeof result.tx).toBe("string");
      expect(result.network_passphrase).toBeTruthy();
      expect(result.identity_note).toBe("Ondex Authentication");
      expect(mockChallenge.create).toHaveBeenCalled();
      const args = mockChallenge.create.mock.calls[0]![0];
      expect(args.nonce).toBeTruthy();
      expect(args.challengeHash).toBeTruthy();
    });

    it("throws ValidationError for invalid wallet address", async () => {
      await expect(authService.createChallenge("INVALID")).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("verifyChallenge", () => {
    it("returns invalid for garbage XDR", async () => {
      mockChallenge.findByHash.mockResolvedValue(null);
      const result = await authService.verifyChallenge(
        "challenge",
        "garbage-xdr",
        "GCYG74K23RLXHZILCDG33ZACMZ2VO3ECTZ6H5SQR56AYPEH7AMY5YXVR",
      );
      expect(result.isValid).toBe(false);
      expect(result.wallet).toBe("");
    });

    it("deletes challenge after presentation (single-use)", async () => {
      mockChallenge.findByHash.mockResolvedValue({
        id: "c1",
        wallet: "GWALLET",
        nonce: "n",
        expiresAt: new Date(Date.now() + 60_000),
      } as any);
      mockChallenge.deleteById.mockResolvedValue({} as any);

      await authService.verifyChallenge("ch", "bad", "GWALLET");
      expect(mockChallenge.deleteById).toHaveBeenCalledWith("c1");
    });
  });

  describe("loginWithWallet", () => {
    it("creates user and issues tokens for new wallet", async () => {
      mockUser.findByWallet.mockResolvedValue(null);
      mockUser.createFromWallet.mockResolvedValue({
        id: "u1",
        wallet: "GWALLET",
        email: null,
        role: null,
        onboardingStatus: "role_selected",
        displayName: null,
        bio: null,
        mfaSecret: null,
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockRefresh.create.mockResolvedValue({} as any);

      const result = await authService.loginWithWallet("GWALLET");
      expect(result.isNewUser).toBe(true);
      expect(result.user.id).toBe("u1");
      expect(result.tokens.accessToken).toBe("access.jwt");
      expect(result.tokens.refreshToken).toBe("refresh-raw");
      expect(mockRefresh.create.mock.calls[0]![0].familyId).toBeTruthy();
    });
  });

  describe("selectRole", () => {
    it("rejects all self-selection attempts", async () => {
      await expect(authService.selectRole("u1", "founder")).rejects.toThrow(
        ForbiddenError,
      );
    });

    it("rejects investor self-selection", async () => {
      await expect(authService.selectRole("u1", "investor")).rejects.toThrow(
        ForbiddenError,
      );
    });
  });

  describe("refreshSession", () => {
    it("rotates refresh token within family", async () => {
      mockRefresh.findByHash.mockResolvedValue({
        id: "rt1",
        userId: "u1",
        familyId: "fam1",
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
        user: {
          id: "u1",
          wallet: "GWALLET",
          email: null,
          role: "investor",
          onboardingStatus: "active",
          displayName: "Inv",
          bio: null,
          mfaSecret: null,
          mfaEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as any);
      mockRefresh.revoke.mockResolvedValue({} as any);
      mockRefresh.create.mockResolvedValue({} as any);

      const result = await authService.refreshSession("refresh-raw");
      expect(result.user.role).toBe("investor");
      expect(mockRefresh.revoke).toHaveBeenCalled();
      expect(mockRefresh.create).toHaveBeenCalled();
      expect(mockRefresh.create.mock.calls[0]![0].familyId).toBe("fam1");
    });

    it("revokes entire family on reuse of rotated token", async () => {
      mockRefresh.findByHash.mockResolvedValue({
        id: "rt1",
        userId: "u1",
        familyId: "fam1",
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(),
        user: { id: "u1" },
      } as any);
      mockRefresh.revokeFamily.mockResolvedValue({} as any);

      await expect(authService.refreshSession("old-token")).rejects.toThrow(
        UnauthorizedError,
      );
      expect(mockRefresh.revokeFamily).toHaveBeenCalledWith("fam1");
    });
  });

  describe("logout", () => {
    it("revokes tokens", async () => {
      mockRefresh.findByHash.mockResolvedValue({
        id: "rt1",
        familyId: "fam1",
        revokedAt: null,
      } as any);
      mockRefresh.revokeFamily.mockResolvedValue({} as any);
      mockRefresh.revokeAllForUser.mockResolvedValue({} as any);

      await authService.logout("refresh-raw", "u1");
      expect(mockRefresh.revokeFamily).toHaveBeenCalledWith("fam1");
      expect(mockRefresh.revokeAllForUser).toHaveBeenCalledWith("u1");
    });
  });
});
