import { createLogger } from "./logger.js";

const log = createLogger("DocumentAnalyzer");

export interface DocumentSummary {
  fileName: string;
  fileType: string;
  category: string;
  textPreview: string;
  wordCount: number;
  hasContent: boolean;
}

export interface DocumentAnalysisResult {
  documents: DocumentSummary[];
  totalDocuments: number;
  completenessScore: number;
  hasPitchDeck: boolean;
  hasFinancials: boolean;
  hasRegistration: boolean;
  findings: string[];
}

export async function analyzeDocuments(filePaths: string[]): Promise<DocumentAnalysisResult> {
  const result: DocumentAnalysisResult = {
    documents: [],
    totalDocuments: filePaths.length,
    completenessScore: 0,
    hasPitchDeck: false,
    hasFinancials: false,
    hasRegistration: false,
    findings: [],
  };

  for (const filePath of filePaths) {
    try {
      const summary = await analyzeSingleDocument(filePath);
      result.documents.push(summary);

      if (summary.category === "pitch_deck") result.hasPitchDeck = true;
      if (summary.category === "financial") result.hasFinancials = true;
      if (summary.category === "registration") result.hasRegistration = true;
    } catch (err) {
      log.error({ err, filePath }, "Failed to analyze document");
      result.findings.push(`Could not analyze: ${filePath}`);
    }
  }

  let score = 0;
  if (result.hasPitchDeck) score += 35;
  if (result.hasFinancials) score += 35;
  if (result.hasRegistration) score += 30;

  result.completenessScore = Math.min(100, score);

  if (result.documents.length === 0) {
    result.findings.push("No documents were provided for analysis");
  } else {
    result.findings.push(`${result.documents.length} document(s) analyzed`);
    if (!result.hasPitchDeck) result.findings.push("Pitch deck not provided");
    if (!result.hasFinancials) result.findings.push("Financial documents not provided");
    if (!result.hasRegistration) result.findings.push("Business registration not provided");
  }

  return result;
}

async function analyzeSingleDocument(filePath: string): Promise<DocumentSummary> {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const stats = await fs.promises.stat(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const fileType = ext.replace(".", "") || "unknown";

  let category = "other";
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes("pitch") || lowerName.includes("deck") || lowerName.includes("presentation")) {
    category = "pitch_deck";
  } else if (lowerName.includes("financial") || lowerName.includes("finance") || lowerName.includes("revenue") || lowerName.includes("balance")) {
    category = "financial";
  } else if (lowerName.includes("register") || lowerName.includes("incorporation") || lowerName.includes("certificate") || lowerName.includes("business") || lowerName.includes("license")) {
    category = "registration";
  }

  let textPreview = "";
  let wordCount = 0;

  try {
    if (fileType === "txt" || fileType === "md" || fileType === "csv") {
      const content = await fs.promises.readFile(filePath, "utf-8");
      textPreview = content.slice(0, 500);
      wordCount = content.split(/\s+/).filter(Boolean).length;
    } else if (fileType === "json" || fileType === "xml" || fileType === "html") {
      const content = await fs.promises.readFile(filePath, "utf-8");
      textPreview = content.slice(0, 500)
    } else {
      textPreview = `Binary file (${fileType}, ${(stats.size / 1024).toFixed(1)} KB)`;
      wordCount = 0;
    }
  } catch {
    textPreview = `Could not read file content (${fileType})`;
  }

  return {
    fileName,
    fileType,
    category,
    textPreview,
    wordCount,
    hasContent: stats.size > 0,
  };
}