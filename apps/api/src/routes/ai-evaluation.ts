import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { config } from "../config.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import * as aiEvalService from "../services/ai-evaluation.service.js";
import * as startupDocRepo from "../repositories/startup-document.repository.js";
import * as appRepo from "../repositories/application.repository.js";
import { ForbiddenError, NotFoundError, ValidationError } from "../lib/errors.js";
import { createLogger } from "../lib/logger.js";

const log = createLogger("AiEvalRoutes");
const router = Router();

const uploadDir = config.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".docx", ".doc", ".txt", ".md", ".csv", ".xlsx", ".xls", ".pptx", ".ppt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

router.post(
  "/applications/:id/documents",
  requireAuth,
  upload.array("documents", 10),
  async (req, res) => {
    const applicationId = Number(req.params.id);
    const sessionWallet = res.locals.wallet as string | null;
    if (!sessionWallet) throw new ValidationError("Wallet required");

    const app = await appRepo.findById(applicationId);
    if (!app) throw new NotFoundError("Application not found");
    if (app.wallet !== sessionWallet) {
      throw new ForbiddenError("Not authorized for this resource");
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new ValidationError("No files uploaded");
    }

    const documents = [];
    for (const file of files) {
      let category = "other";
      const lowerName = file.originalname.toLowerCase();
      if (lowerName.includes("pitch") || lowerName.includes("deck")) category = "pitch_deck";
      else if (lowerName.includes("financial") || lowerName.includes("revenue") || lowerName.includes("finance")) category = "financial";
      else if (lowerName.includes("register") || lowerName.includes("incorporation") || lowerName.includes("certificate") || lowerName.includes("license")) category = "registration";

      const doc = await startupDocRepo.create({
        applicationId,
        fileName: file.originalname,
        fileType: path.extname(file.originalname).replace(".", "") || "unknown",
        filePath: file.path,
        fileSize: file.size,
        category,
      });
      documents.push(doc);
    }

    log.info({ applicationId, count: documents.length }, "Documents uploaded");
    res.status(201).json({ documents });
  },
);

router.get(
  "/applications/:id/documents",
  requireAuth,
  async (req, res) => {
    const applicationId = Number(req.params.id);
    const sessionWallet = res.locals.wallet as string | null;

    const app = await appRepo.findById(applicationId);
    if (!app) throw new NotFoundError("Application not found");
    if (app.wallet !== sessionWallet) {
      const adminAddress = config.adminAddress;
      if (sessionWallet !== adminAddress) {
        throw new ForbiddenError("Not authorized for this resource");
      }
    }

    const docs = await startupDocRepo.findByApplication(applicationId);
    res.json({ documents: docs });
  },
);

const triggerSchema = z.object({
  caseId: z.number().int().positive(),
});

router.post(
  "/evaluations/trigger",
  requireAuth,
  requireAdmin,
  validate(triggerSchema, "body"),
  async (req, res) => {
    const { caseId } = req.body as { caseId: number };
    const evaluation = await aiEvalService.triggerEvaluation(caseId);
    res.status(201).json({ evaluation });
  },
);

router.get(
  "/evaluations/case/:caseId",
  async (req, res) => {
    const caseId = Number(req.params.caseId);
    const evaluation = await aiEvalService.getEvaluation(caseId);
    if (!evaluation) throw new NotFoundError(`Evaluation for case ${caseId} not found`);
    res.json({ evaluation });
  },
);

router.get(
  "/evaluations",
  async (req, res) => {
    const status = req.query.status as string | undefined;
    const evaluations = await aiEvalService.listEvaluations(status);
    res.json({ evaluations });
  },
);

router.get(
  "/evaluations/application/:applicationId",
  async (req, res) => {
    const applicationId = Number(req.params.applicationId);
    const evaluations = await aiEvalService.getEvaluationsByApplication(applicationId);
    res.json({ evaluations });
  },
);

export default router;