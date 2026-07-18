import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import * as caseService from "../../services/case.service.js";

const router = Router();

const listQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get(
  "/",
  validate(listQuerySchema, "query"),
  async (req, res) => {
    const q = req.query as unknown as z.infer<typeof listQuerySchema>;

    const { items, total } = await caseService.listCases({
      status: q.status,
      limit: q.limit,
      offset: q.offset,
    });

    res.json({ items, total, limit: q.limit, offset: q.offset });
  },
);

router.get("/stats", async (_req, res) => {
  const stats = await caseService.getCaseStats();
  res.json(stats);
});

router.get("/:caseId", async (req, res) => {
  const caseId = Number(req.params.caseId);
  const caseData = await caseService.getCase(caseId);
  res.json(caseData);
});

export default router;
