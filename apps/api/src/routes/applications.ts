import { Router } from "express";
import * as applicationService from "../services/application.service.js";
import * as applicationRepo from "../repositories/application.repository.js";

const router = Router();

router.get("/applications", async (req, res) => {
  const startup = req.query.startup as string | undefined;

  if (startup) {
    const apps = await applicationService.listByStartup(startup);
    return res.json({ applications: apps });
  }

  const apps = await applicationService.listPending();
  res.json({ applications: apps });
});

router.get("/applications/:id/votes", async (req, res) => {
  const onChainId = Number(req.params.id);
  const app = await applicationService.getApplication(onChainId);
  if (!app) return res.json({ votes: [] });

  const votes = await applicationService.getVotes(app.id);
  res.json({ votes });
});

router.get("/jury/applications", async (_req, res) => {
  const apps = await applicationService.listPending();
  res.json({ applications: apps });
});

router.get("/jury/my-votes/:address", async (req, res) => {
  const voter = req.params.address;
  const votes = await applicationService.getVotesByVoter(voter);
  res.json({ votes });
});

export default router;
