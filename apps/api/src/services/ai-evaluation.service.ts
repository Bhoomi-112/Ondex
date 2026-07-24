import { createLogger } from "../lib/logger.js";
import { config } from "../config.js";
import * as aiEvalRepo from "../repositories/ai-evaluation.repository.js";
import * as startupDocRepo from "../repositories/startup-document.repository.js";
import * as applicationRepo from "../repositories/application.repository.js";
import * as caseRepo from "../repositories/case.repository.js";
import { scrapeCompanyData } from "../lib/web-scraper.js";
import { analyzeDocuments } from "../lib/document-analyzer.js";
import { castVote } from "./ai-voter.service.js";
import { NotFoundError, ConflictError } from "../lib/errors.js";

const log = createLogger("AiEvaluationService");

export async function triggerEvaluation(caseId: number) {
  const existing = await aiEvalRepo.findByCaseId(caseId);
  if (existing) {
    throw new ConflictError(`Evaluation already exists for case ${caseId} (status: ${existing.status})`);
  }

  const juryCase = await caseRepo.findByCaseId(caseId);
  if (!juryCase) {
    throw new NotFoundError(`Case ${caseId} not found`);
  }

  const application = await applicationRepo.findByOnChainId(caseId);
  if (!application) {
    throw new NotFoundError(`Application for case ${caseId} not found`);
  }

  const evaluation = await aiEvalRepo.create({
    caseId,
    applicationId: application.id,
    aiAgentAddress: config.aiAgentPublicKey,
  });

  log.info({ caseId, applicationId: application.id }, "AI evaluation triggered");

  processEvaluation(caseId, application, evaluation.id).catch((err) => {
    log.error({ err, caseId }, "Background AI evaluation failed");
    aiEvalRepo.updateStatus(caseId, {
      status: "failed",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
  });

  return evaluation;
}

async function processEvaluation(
  caseId: number,
  application: { id: number; name: string; website?: string | null; socials?: string | null },
  _evaluationId: number,
) {
  await aiEvalRepo.updateStatus(caseId, { status: "collecting", startedAt: new Date() });

  const filePaths = await startupDocRepo.getFilePathsByApplication(application.id);
  let socialsRecord: Record<string, string> | null = null;
  if (application.socials) {
    try { socialsRecord = JSON.parse(application.socials); } catch { socialsRecord = null; }
  }

  const [webResult, docResult] = await Promise.all([
    scrapeCompanyData({
      companyName: application.name,
      website: application.website,
      socials: socialsRecord,
    }),
    analyzeDocuments(filePaths),
  ]);

  await aiEvalRepo.updateStatus(caseId, { status: "analyzing" });

  const finalScore = Math.round(webResult.reviewScore * 0.4 + docResult.completenessScore * 0.6);
  const approved = finalScore >= 60;
  const confidenceScore = Math.abs(finalScore - 50) / 50;

  const evidenceReport = {
    webPresence: {
      score: webResult.reviewScore,
      domainFound: webResult.domainFound,
      socialMediaFound: webResult.socialMediaFound,
      findings: webResult.findings,
    },
    documents: {
      completenessScore: docResult.completenessScore,
      hasPitchDeck: docResult.hasPitchDeck,
      hasFinancials: docResult.hasFinancials,
      hasRegistration: docResult.hasRegistration,
      findings: docResult.findings,
    },
    finalScore,
    verdict: approved ? "approved" : "rejected",
    threshold: 60,
    evaluatedAt: new Date().toISOString(),
  };

  await aiEvalRepo.updateStatus(caseId, {
    status: "completed",
    score: finalScore,
    verdict: approved ? "approved" : "rejected",
    confidenceScore,
    webPresenceScore: webResult.reviewScore,
    newsSentiment: webResult.newsArticles.length > 0 ? "positive" : "no_data",
    companyVerified: webResult.domainFound || webResult.socialMediaFound.length > 0,
    documentScore: docResult.completenessScore,
    evidenceReport: JSON.stringify(evidenceReport),
    completedAt: new Date(),
  });

  log.info({ caseId, score: finalScore, verdict: approved ? "approved" : "rejected" }, "AI analysis complete, casting vote");

  const voteResult = await castVote(caseId, approved);

  if (voteResult.success) {
    await aiEvalRepo.updateStatus(caseId, { txHash: voteResult.txHash });
    log.info({ caseId, txHash: voteResult.txHash }, "AI vote cast on-chain");
  } else {
    log.error({ caseId, error: voteResult.errorMessage }, "AI vote submission failed");
    await aiEvalRepo.updateStatus(caseId, {
      errorMessage: `Vote submission failed: ${voteResult.errorMessage}`,
    });
  }
}

export async function getEvaluation(caseId: number) {
  const evalData = await aiEvalRepo.findByCaseId(caseId);
  if (!evalData) return null;
  return {
    ...evalData,
    evidenceReport: evalData.evidenceReport ? JSON.parse(evalData.evidenceReport) : null,
  };
}

export async function getEvaluationsByApplication(applicationId: number) {
  const evals = await aiEvalRepo.findByApplicationId(applicationId);
  return evals.map((e) => ({
    ...e,
    evidenceReport: e.evidenceReport ? JSON.parse(e.evidenceReport) : null,
  }));
}

export async function listEvaluations(status?: string) {
  if (status) {
    return aiEvalRepo.listByStatus(status);
  }
  return aiEvalRepo.listByStatus("pending");
}