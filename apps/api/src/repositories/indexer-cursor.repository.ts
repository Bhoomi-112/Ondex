import { prisma } from "../lib/db.js";

const CURSOR_ID = "singleton";

export async function getCursor() {
  return prisma.indexerCursor.upsert({
    where: { id: CURSOR_ID },
    create: { id: CURSOR_ID, lastLedgerSeq: 0 },
    update: {},
  });
}

export async function updateCursor(ledgerSeq: number) {
  return prisma.indexerCursor.update({
    where: { id: CURSOR_ID },
    data: { lastLedgerSeq: ledgerSeq },
  });
}
