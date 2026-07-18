import { prisma } from "../lib/db.js";

export async function upsertEvent(data: {
  contractId: string;
  contractType: string;
  eventName: string;
  ledgerSeq: number;
  ledgerCloseAt: Date;
  txHash: string;
  topicXdr: string;
  dataXdr: string;
}) {
  return prisma.contractEvent.upsert({
    where: { txHash_eventName: { txHash: data.txHash, eventName: data.eventName } },
    create: data,
    update: {
      contractId: data.contractId,
      ledgerSeq: data.ledgerSeq,
      ledgerCloseAt: data.ledgerCloseAt,
      topicXdr: data.topicXdr,
      dataXdr: data.dataXdr,
    },
  });
}

export async function getUnprocessedEvents(limit: number = 100) {
  return prisma.contractEvent.findMany({
    where: { processed: false },
    orderBy: { ledgerSeq: "asc" },
    take: limit,
  });
}

export async function markProcessed(ids: string[]) {
  return prisma.contractEvent.updateMany({
    where: { id: { in: ids } },
    data: { processed: true },
  });
}

export async function getEventsByContract(
  contractType: string,
  limit: number = 50,
  offset: number = 0,
) {
  return prisma.contractEvent.findMany({
    where: { contractType },
    orderBy: { ledgerSeq: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getEventById(id: string) {
  return prisma.contractEvent.findUnique({ where: { id } });
}
