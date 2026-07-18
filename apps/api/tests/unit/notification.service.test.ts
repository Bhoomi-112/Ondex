import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/repositories/notification.repository.js", () => ({
  create: vi.fn(),
  findByWallet: vi.fn(),
  countUnread: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
}));

import * as notificationRepo from "../../src/repositories/notification.repository.js";
import * as notificationService from "../../src/services/notification.service.js";

const mockRepo = vi.mocked(notificationRepo);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("NotificationService", () => {
  describe("notify", () => {
    it("delegates to repo with correct params", async () => {
      mockRepo.create.mockResolvedValue({} as any);
      await notificationService.notify({
        wallet: "GWALLET",
        type: "TEST",
        title: "Hello",
        body: "World",
        data: { key: "value" },
      });
      expect(mockRepo.create).toHaveBeenCalledWith({
        wallet: "GWALLET",
        type: "TEST",
        title: "Hello",
        body: "World",
        data: { key: "value" },
      });
    });
  });

  describe("getNotifications", () => {
    it("returns items and counts", async () => {
      mockRepo.findByWallet.mockResolvedValue([
        { id: "1", read: false },
      ] as any);
      mockRepo.countUnread.mockResolvedValue(3);
      const result = await notificationService.getNotifications(
        "GWALLET",
        true,
      );
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.unreadCount).toBe(3);
    });

    it("defaults to all notifications, limit 50", async () => {
      mockRepo.findByWallet.mockResolvedValue([]);
      mockRepo.countUnread.mockResolvedValue(0);
      await notificationService.getNotifications("GWALLET");
      expect(mockRepo.findByWallet).toHaveBeenCalledWith(
        "GWALLET",
        false,
        50,
        0,
      );
    });
  });

  describe("notifyJuryAssigned", () => {
    it("creates correct notification", async () => {
      mockRepo.create.mockResolvedValue({} as any);
      await notificationService.notifyJuryAssigned("GJUROR", 42);
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          wallet: "GJUROR",
          type: "JURY_ASSIGNED",
          body: "You have been assigned to case #42",
        }),
      );
    });
  });

  describe("notifyVoteReceived", () => {
    it("includes vote in body", async () => {
      mockRepo.create.mockResolvedValue({} as any);
      await notificationService.notifyVoteReceived(
        "GSTARTUP",
        7,
        "For",
      );
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          wallet: "GSTARTUP",
          type: "VOTE_RECEIVED",
          body: "A juror voted For on case #7",
        }),
      );
    });
  });

  describe("notifyEscrowReleased", () => {
    it("creates release notification", async () => {
      mockRepo.create.mockResolvedValue({} as any);
      await notificationService.notifyEscrowReleased(
        "GINVESTOR",
        3,
        "5000",
      );
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ESCROW_RELEASED",
          body: "Escrow of 5000 released for campaign #3",
        }),
      );
    });
  });

  describe("notifyDisputeOpened", () => {
    it("creates dispute notification", async () => {
      mockRepo.create.mockResolvedValue({} as any);
      await notificationService.notifyDisputeOpened(
        "GINVESTOR",
        5,
      );
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "DISPUTE_OPENED",
          body: "A dispute has been opened for campaign #5",
        }),
      );
    });
  });

  describe("markRead / markAllRead", () => {
    it("delegates to repo", async () => {
      mockRepo.markRead.mockResolvedValue({} as any);
      await notificationService.markRead("notif-1");
      expect(mockRepo.markRead).toHaveBeenCalledWith("notif-1");
    });

    it("markAllRead delegates to repo", async () => {
      mockRepo.markAllRead.mockResolvedValue({} as any);
      await notificationService.markAllRead("GWALLET");
      expect(mockRepo.markAllRead).toHaveBeenCalledWith("GWALLET");
    });
  });
});
