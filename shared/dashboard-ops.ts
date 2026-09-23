export type DashboardSearchCandidate = {
  title?: string | null;
  status?: string | null;
  type?: string | null;
  description?: string | null;
  artistName?: string | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
};

export function getProjectPriority(project: DashboardSearchCandidate) {
  const status = String(project.status ?? "draft").toLowerCase();
  const priorityMap: Record<string, number> = {
    pending_confirmation: 95,
    pending: 90,
    draft: 70,
    in_review: 75,
    review: 75,
    confirmed: 35,
    signed: 30,
    archived: 5,
  };

  const labelMap: Record<string, string> = {
    pending_confirmation: "Awaiting confirmation",
    pending: "Awaiting action",
    draft: "Draft",
    in_review: "In review",
    review: "In review",
    confirmed: "Confirmed",
    signed: "Signed",
    archived: "Archived",
  };

  const priority = priorityMap[status] ?? 50;

  return {
    priority,
    label: labelMap[status] ?? status.replace(/[-_]/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()),
  };
}

export function sortProjectQueue<T extends DashboardSearchCandidate>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const order = getProjectPriority(b).priority - getProjectPriority(a).priority;
    if (order !== 0) return order;

    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt ?? 0).getTime();
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt ?? 0).getTime();
    return bTime - aTime;
  });
}

export function matchesSearchText(query: string, candidate: DashboardSearchCandidate): boolean {
  const term = query.trim();
  if (!term) return true;

  const haystack = [
    candidate.title,
    candidate.type,
    candidate.status,
    candidate.artistName,
    candidate.description,
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .toLowerCase();

  const terms = term.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every((part) => haystack.includes(part));
}
