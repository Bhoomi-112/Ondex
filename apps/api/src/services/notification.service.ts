import { createLogger } from "../lib/logger.js";
import * as notificationRepo from "../repositories/notification.repository.js";

const log = createLogger("NotificationService");

export async function notify(params: {
  wallet: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
}) {
  log.info({ wallet: params.wallet, type: params.type }, "Creating notification");
  return notificationRepo.create(params);
}

export async function getNotifications(
  wallet: string,
  unreadOnly?: boolean,
  limit?: number,
  offset?: number,
) {
  const items = await notificationRepo.findByWallet(
    wallet,
    unreadOnly ?? false,
    limit ?? 50,
    offset ?? 0,
  );

  const total = await notificationRepo.countUnread(wallet);
  const unreadCount = total;

  return { items, total: items.length, unreadCount };
}

export async function markRead(id: string) {
  return notificationRepo.markRead(id);
}

export async function markReadForWallet(id: string, wallet: string) {
  return notificationRepo.markReadForWallet(id, wallet);
}

export async function markAllRead(wallet: string) {
  return notificationRepo.markAllRead(wallet);
}

export async function notifyJuryAssigned(jurorWallet: string, caseId: number) {
  return notify({
    wallet: jurorWallet,
    type: "JURY_ASSIGNED",
    title: "Jury Assignment",
    body: `You have been assigned to case #${caseId}`,
    data: { caseId },
  });
}

export async function notifyVoteReceived(
  startupWallet: string,
  caseId: number,
  vote: string,
) {
  return notify({
    wallet: startupWallet,
    type: "VOTE_RECEIVED",
    title: "Vote Received",
    body: `A juror voted ${vote} on case #${caseId}`,
    data: { caseId, vote },
  });
}

export async function notifyEscrowReleased(
  investorWallet: string,
  campaignId: number,
  amount: string,
) {
  return notify({
    wallet: investorWallet,
    type: "ESCROW_RELEASED",
    title: "Escrow Released",
    body: `Escrow of ${amount} released for campaign #${campaignId}`,
    data: { campaignId, amount },
  });
}

export async function notifyDisputeOpened(
  wallet: string,
  campaignId: number,
) {
  return notify({
    wallet,
    type: "DISPUTE_OPENED",
    title: "Dispute Opened",
    body: `A dispute has been opened for campaign #${campaignId}`,
    data: { campaignId },
  });
}
