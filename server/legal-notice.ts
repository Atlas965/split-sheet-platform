import type { LegalDocument } from "@shared/schema";

export type ContributorLegalNotice = {
  versionId: string | null;
  version: string | null;
  summaryText: string;
  noticeText: string;
  fullNoticeUrl: string;
};

function cleanMarkdownSummary(markdown: string): string {
  const cleaned = markdown
    .replace(/\r/g, "")
    .replace(/[#>*_`\-]/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const candidate = sentences.slice(0, 2).join(" ").trim();
  if (candidate) return candidate;
  return cleaned.slice(0, 220).trim() || "This confirmation records your acceptance of the relevant SplitSheet project terms as an electronic record.";
}

export function buildContributorLegalNotice(doc?: Partial<LegalDocument> | null): ContributorLegalNotice {
  const fallbackNotice = "This confirmation records your acceptance of the relevant SplitSheet project terms as an electronic record for operational evidence under Ontario-neutral recordkeeping standards.";
  const noticeText = doc?.markdownBody?.trim() || fallbackNotice;
  const version = doc?.version ?? null;
  const versionId = version ?? doc?.id ?? null;
  const summaryText = cleanMarkdownSummary(noticeText);

  return {
    versionId,
    version,
    summaryText,
    noticeText,
    fullNoticeUrl: "/legal/privacy-summary",
  };
}
