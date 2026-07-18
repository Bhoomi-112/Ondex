import { Router } from "express";
import { checkDatabaseConnection } from "../../lib/db.js";
import { checkRpcConnection, getLatestLedger } from "../../lib/stellar.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/ready", async (_req, res) => {
  const [db, rpc] = await Promise.all([
    checkDatabaseConnection(),
    checkRpcConnection(),
  ]);

  const ok = db && rpc;
  const status = ok ? 200 : 503;

  let ledger: number | null = null;
  if (rpc) {
    ledger = await getLatestLedger();
  }

  res.status(status).json({ status: ok ? "ok" : "degraded", db, rpc, ledger });
});

export default router;
