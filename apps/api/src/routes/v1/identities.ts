import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import * as identityService from "../../services/identity.service.js";

const router = Router();

const listQuerySchema = z.object({
  committed: z.coerce.boolean().optional(),
  revealed: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get(
  "/",
  validate(listQuerySchema, "query"),
  async (req, res) => {
    const q = ((req as unknown as Record<string, unknown>).validatedQuery ?? req.query) as z.infer<typeof listQuerySchema>;

    const { items, total } = await identityService.listIdentities({
      committed: q.committed,
      revealed: q.revealed,
      limit: q.limit,
      offset: q.offset,
    });

    res.json({ items, total });
  },
);

router.get("/:identityId", async (req, res) => {
  const identity = await identityService.getIdentity(req.params.identityId);
  res.json(identity);
});

export default router;
