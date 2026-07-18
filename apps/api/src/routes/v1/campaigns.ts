import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import * as campaignService from "../../services/campaign.service.js";

const router = Router();

const listQuerySchema = z.object({
  state: z.string().optional(),
  startup: z.string().optional(),
  investor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get(
  "/",
  validate(listQuerySchema, "query"),
  async (req, res) => {
    const q = req.query as unknown as z.infer<typeof listQuerySchema>;

    const { items, total } = await campaignService.listCampaigns({
      state: q.state,
      startup: q.startup,
      investor: q.investor,
      limit: q.limit,
      offset: q.offset,
    });

    res.json({ items, total, limit: q.limit, offset: q.offset });
  },
);

router.get("/stats", async (_req, res) => {
  const stats = await campaignService.getCampaignStats();
  res.json(stats);
});

router.get("/:campaignId", async (req, res) => {
  const campaignId = Number(req.params.campaignId);
  const campaign = await campaignService.getCampaign(campaignId);
  res.json(campaign);
});

export default router;
