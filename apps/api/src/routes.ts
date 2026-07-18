import { Router, Request, Response } from "express";
import { db } from "./db";

export const router = Router();

// ── Applications ──

router.get("/applications", (req: Request, res: Response) => {
  const { status, startup, search } = req.query;

  let sql = "SELECT * FROM applications WHERE 1=1";
  const params: any[] = [];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (startup) {
    sql += " AND startup = ?";
    params.push(startup);
  }
  if (search) {
    sql += " AND (name LIKE ? OR pitch LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY created_at DESC";

  const apps = db.prepare(sql).all(...params);

  const enriched = apps.map((app: any) => ({
    ...app,
    milestones: db
      .prepare("SELECT description, amount FROM milestones WHERE app_id = ? ORDER BY idx")
      .all(app.id),
  }));

  res.json({ applications: enriched });
});

router.get("/applications/:id", (req: Request, res: Response) => {
  const app = db.prepare("SELECT * FROM applications WHERE id = ?").get(req.params.id) as any;

  if (!app) {
    return res.status(404).json({ error: "Application not found" });
  }

  const milestones = db
    .prepare("SELECT description, amount FROM milestones WHERE app_id = ? ORDER BY idx")
    .all(app.id);

  const votes = db
    .prepare("SELECT voter, approve, comment_hash, timestamp FROM votes WHERE app_id = ?")
    .all(app.id);

  res.json({ ...app, milestones, votes });
});

router.get("/applications/:id/votes", (req: Request, res: Response) => {
  const votes = db
    .prepare("SELECT voter, approve, comment_hash, timestamp FROM votes WHERE app_id = ? ORDER BY timestamp DESC")
    .all(req.params.id);

  res.json({ votes });
});

// ── Campaigns ──

router.get("/campaigns", (req: Request, res: Response) => {
  const { app_id, investor, status } = req.query;

  let sql = "SELECT * FROM campaigns WHERE 1=1";
  const params: any[] = [];

  if (app_id) {
    sql += " AND app_id = ?";
    params.push(app_id);
  }
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY id DESC";

  let campaigns = db.prepare(sql).all(...params) as any[];

  if (investor) {
    const depositRows = db
      .prepare("SELECT campaign_id, amount FROM deposits WHERE investor = ?")
      .all(investor) as any[];
    const depositMap = new Map(depositRows.map((d: any) => [d.campaign_id, d.amount]));

    campaigns = campaigns
      .filter((c: any) => depositMap.has(c.id))
      .map((c: any) => ({
        ...c,
        myDeposit: depositMap.get(c.id) || 0,
      }));
  }

  const enriched = campaigns.map((c: any) => ({
    ...c,
    milestones: db
      .prepare("SELECT amount, released FROM campaign_milestones WHERE campaign_id = ? ORDER BY idx")
      .all(c.id),
  }));

  res.json({ campaigns: enriched });
});

router.get("/campaigns/:id", (req: Request, res: Response) => {
  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(req.params.id) as any;

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  const milestones = db
    .prepare("SELECT amount, released FROM campaign_milestones WHERE campaign_id = ? ORDER BY idx")
    .all(campaign.id);

  const deposits = db
    .prepare("SELECT investor, amount, updated_at FROM deposits WHERE campaign_id = ? ORDER BY updated_at DESC")
    .all(campaign.id);

  res.json({ ...campaign, milestones, deposits });
});

// ── Jury ──

router.get("/jury/applications", (_req: Request, res: Response) => {
  const apps = db
    .prepare("SELECT * FROM applications WHERE status IN ('Submitted', 'UnderReview') ORDER BY created_at DESC")
    .all() as any[];

  const enriched = apps.map((app: any) => ({
    ...app,
    milestones: db
      .prepare("SELECT description, amount FROM milestones WHERE app_id = ? ORDER BY idx")
      .all(app.id),
  }));

  res.json({ applications: enriched });
});

router.get("/jury/my-votes/:address", (req: Request, res: Response) => {
  const votes = db
    .prepare("SELECT app_id as appId, approve, timestamp FROM votes WHERE voter = ? ORDER BY timestamp DESC")
    .all(req.params.address);

  res.json({ votes });
});
