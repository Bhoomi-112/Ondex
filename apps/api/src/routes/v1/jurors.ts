import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import * as jurorService from "../../services/juror.service.js";

const router = Router();

const listQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get(
  "/",
  validate(listQuerySchema, "query"),
  async (req, res) => {
    const q = ((req as unknown as Record<string, unknown>).validatedQuery ?? req.query) as z.infer<typeof listQuerySchema>;

    const { items, total } = await jurorService.listJurors({
      active: q.active,
      limit: q.limit,
      offset: q.offset,
    });

    res.json({ items, total });
  },
);

router.get("/stats", async (_req, res) => {
  const stats = await jurorService.getJurorStats();
  res.json(stats);
});

router.get("/:address", async (req, res) => {
  const juror = await jurorService.getJuror(req.params.address);
  res.json(juror);
});

export default router;
