import { Router } from "express";
import { z } from "zod";
import * as applicationService from "../services/application.service.js";
import * as applicationRepo from "../repositories/application.repository.js";
import {
  requireAuth,
  requireRole,
  requireAdmin,
  requireAdminMfa,
  assertResourceOwner,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ForbiddenError, ValidationError } from "../lib/errors.js";
import {
  pickAllowed,
  sanitizeText,
  FORBIDDEN_USER_FIELDS,
} from "../lib/sanitize.js";

const router = Router();

const createSchema = z.object({
  name: z.string().min(1).max(200),
  pitch: z.string().min(1).max(10000),
  askAmount: z.union([z.string(), z.number()]).optional(),
  ask_amount: z.union([z.string(), z.number()]).optional(),
  maskName: z.boolean().optional(),
  mask_name: z.boolean().optional(),
  maskAddress: z.boolean().optional(),
  mask_address: z.boolean().optional(),
  milestones: z
    .array(
      z.object({
        description: z.string().max(2000).optional(),
        amount: z.union([z.string(), z.number()]).optional(),
      }),
    )
    .optional(),
  onChainId: z.number().int().optional(),
  caseId: z.number().int().optional(),
});

router.get("", requireAuth, async (req, res) => {
  const startup = req.query.startup as string | undefined;
  const sessionWallet = res.locals.wallet as string | null;
  const role = res.locals.role as string | null;

  if (startup) {
    // IDOR: founders may only list their own; jury/admin may list any
    if (role === "founder") {
      if (!sessionWallet || startup !== sessionWallet) {
        throw new ForbiddenError("Not authorized for this resource");
      }
    } else if (role !== "jury" && role !== "investor") {
      // investors see public listings only via listPending path without filter
      throw new ForbiddenError("Not authorized for this resource");
    }
    const apps = await applicationService.listByStartup(startup);
    return res.json({ applications: apps });
  }

  // Pending list: jury / admin only
  if (role !== "jury") {
    const wallet = sessionWallet;
    if (!wallet) throw new ForbiddenError("Not authorized");
    const apps = await applicationService.listByStartup(wallet);
    return res.json({ applications: apps });
  }

  const apps = await applicationService.listPending();
  res.json({ applications: apps });
});

router.get(
  "/all",
  requireAuth,
  requireRole("jury"),
  async (_req, res) => {
    const pending = await applicationService.listPending();
    const approved = await applicationRepo.findByStatus("Approved");
    res.json({ applications: [...pending, ...approved] });
  },
);

router.post(
  "",
  requireAuth,
  requireRole("founder"),
  validate(createSchema, "body"),
  async (req, res) => {
    // Mass-assignment: never accept role/isAdmin/startup from client as authority
    for (const k of Object.keys(req.body ?? {})) {
      if ((FORBIDDEN_USER_FIELDS as readonly string[]).includes(k)) {
        throw new ValidationError(`Field not allowed: ${k}`);
      }
    }

    const body = pickAllowed<{
      name: string;
      pitch: string;
      askAmount?: string | number;
      ask_amount?: string | number;
      maskName?: boolean;
      mask_name?: boolean;
      maskAddress?: boolean;
      mask_address?: boolean;
      milestones?: Array<{ description?: string; amount?: string | number }>;
      onChainId?: number;
      caseId?: number;
    }>(req.body, [
      "name",
      "pitch",
      "askAmount",
      "ask_amount",
      "maskName",
      "mask_name",
      "maskAddress",
      "mask_address",
      "milestones",
      "onChainId",
      "caseId",
    ]);

    const sessionWallet = res.locals.wallet as string | null;
    if (!sessionWallet) {
      throw new ValidationError("Wallet required");
    }

    const askRaw = body.askAmount ?? body.ask_amount ?? 0;
    const app = await applicationService.createApplication({
      startup: sessionWallet, // owner from session — never from body
      name: sanitizeText(body.name ?? "", 200),
      pitch: sanitizeText(body.pitch ?? "", 10000),
      askAmount: BigInt(String(askRaw)),
      maskName: body.maskName ?? body.mask_name,
      maskAddress: body.maskAddress ?? body.mask_address,
      onChainId: body.onChainId ?? body.caseId,
      milestones: (body.milestones || []).map((m) => ({
        description: sanitizeText(m.description || "", 2000),
        amount: BigInt(String(m.amount ?? 0)),
      })),
    });

    res.status(201).json({ application: app });
  },
);

const voteSchema = z.object({
  approve: z.boolean(),
  commentHash: z.string().max(128).optional(),
});

router.post(
  "/:id/votes",
  requireAuth,
  requireRole("jury"),
  validate(voteSchema, "body"),
  async (req, res) => {
    const onChainId = Number(req.params.id);
    const body = pickAllowed<{ approve: boolean; commentHash?: string }>(
      req.body,
      ["approve", "commentHash"],
    );
    const voter = res.locals.wallet as string | null;
    if (!voter) throw new ValidationError("Wallet required");

    const votes = await applicationService.recordVote(
      onChainId,
      voter, // voter from session — never from body
      body.approve as boolean,
      body.commentHash || "",
    );
    res.json({ votes });
  },
);

const statusSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
});

router.post(
  "/:id/status",
  requireAuth,
  requireAdmin,
  requireAdminMfa,
  validate(statusSchema, "body"),
  async (req, res) => {
    const onChainId = Number(req.params.id);
    const { status } = req.body as { status: "Approved" | "Rejected" };
    if (status === "Approved") {
      await applicationService.markApproved(onChainId);
    } else {
      await applicationService.markRejected(onChainId);
    }
    const app = await applicationService.getApplication(onChainId);
    res.json({ application: app });
  },
);

router.get(
  "/:id/votes",
  requireAuth,
  requireRole("jury"),
  async (req, res) => {
    const onChainId = Number(req.params.id);
    const app = await applicationService.getApplication(onChainId);
    if (!app) return res.json({ votes: [] });
    const votes = await applicationService.getVotes(app.id);
    res.json({ votes });
  },
);

router.get(
  "/applications",
  requireAuth,
  requireRole("jury"),
  async (_req, res) => {
    const apps = await applicationService.listPending();
    res.json({ applications: apps });
  },
);

router.get(
  "/my-votes/:address",
  requireAuth,
  requireRole("jury"),
  async (req, res) => {
    const voter = String(req.params.address);
    const sessionWallet = res.locals.wallet as string | null;
    // IDOR: only own votes
    assertResourceOwner(null, res.locals.userId as string, {
      resourceWallet: voter,
      sessionWallet,
    });
    const votes = await applicationService.getVotesByVoter(voter);
    res.json({ votes });
  },
);

export default router;
