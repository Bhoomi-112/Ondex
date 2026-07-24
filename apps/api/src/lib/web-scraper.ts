import { createLogger } from "./logger.js";

const log = createLogger("WebScraper");

export interface WebScrapeResult {
  companyName: string;
  domainFound: boolean;
  domainRegistered: boolean;
  socialMediaFound: string[];
  newsArticles: NewsArticle[];
  reviewScore: number;
  findings: string[];
}

export interface NewsArticle {
  title: string;
  snippet: string;
  source: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface ScrapeInput {
  companyName: string;
  website?: string | null;
  socials?: Record<string, string> | null;
}

export async function scrapeCompanyData(input: ScrapeInput): Promise<WebScrapeResult> {
  const result: WebScrapeResult = {
    companyName: input.companyName,
    domainFound: false,
    domainRegistered: false,
    socialMediaFound: [],
    newsArticles: [],
    reviewScore: 50,
    findings: [],
  };

  try {
    await Promise.all([
      checkDomainPresence(result, input),
      checkSocialMedia(result, input),
      checkNewsPresence(result, input),
    ]);

    let score = 0;
    if (result.domainFound) score += 30;
    if (result.domainRegistered) score += 10;
    if (result.socialMediaFound.length > 0) {
      score += Math.min(result.socialMediaFound.length * 10, 30);
    }

    const positiveNews = result.newsArticles.filter((a) => a.sentiment === "positive").length;
    const negativeNews = result.newsArticles.filter((a) => a.sentiment === "negative").length;

    if (result.newsArticles.length > 0) {
      score += (positiveNews / result.newsArticles.length) * 20;
      score -= (negativeNews / result.newsArticles.length) * 30;
    } else {
      score += 10;
    }

    result.reviewScore = Math.max(0, Math.min(100, Math.round(score)));

    if (result.findings.length === 0) {
      result.findings.push("Basic web presence check completed");
    }
  } catch (err) {
    log.error({ err, companyName: input.companyName }, "Web scraping failed");
    result.findings.push("Web scraping encountered an error");
  }

  return result;
}

async function checkDomainPresence(result: WebScrapeResult, input: ScrapeInput): Promise<void> {
  const rawDomain = input.website || `${input.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  try {
    const response = await fetch(`https://${domain}`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    result.domainFound = true;
    result.domainRegistered = response.status < 500;
    result.findings.push(`Website ${domain} is reachable`);
  } catch {
    result.findings.push(`Website ${domain} could not be verified`);
  }
}

async function checkSocialMedia(result: WebScrapeResult, input: ScrapeInput): Promise<void> {
  const socials = input.socials || {};

  if (socials.linkedin) {
    result.socialMediaFound.push("LinkedIn");
    result.findings.push("LinkedIn profile found");
  }
  if (socials.twitter || socials.x) {
    result.socialMediaFound.push("Twitter/X");
    result.findings.push("Twitter/X profile found");
  }
  if (socials.github) {
    result.socialMediaFound.push("GitHub");
    result.findings.push("GitHub profile found");
  }
  if (input.website) {
    result.socialMediaFound.push("Website");
  }
}

async function checkNewsPresence(result: WebScrapeResult, _input: ScrapeInput): Promise<void> {
  result.newsArticles = [];
}