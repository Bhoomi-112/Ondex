import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import * as notificationService from "../../services/notification.service.js";

const router = Router();

const listQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get(
  "/",
  requireAuth,
  validate(listQuerySchema, "query"),
  async (req, res) => {
    const wallet = res.locals.wallet as string;
    const q = req.query as unknown as z.infer<typeof listQuerySchema>;

    const { items, total, unreadCount } =
      await notificationService.getNotifications(wallet, q.unreadOnly, q.limit, q.offset);

    res.json({ items, total, unreadCount });
  },
);

router.put("/read-all", requireAuth, async (_req, res) => {
  const wallet = res.locals.wallet as string;
  await notificationService.markAllRead(wallet);
  res.json({ ok: true });
});

router.put("/:id/read", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  await notificationService.markRead(id);
  res.json({ ok: true });
});

export default router;
