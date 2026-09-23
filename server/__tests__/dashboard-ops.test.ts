import { describe, expect, it } from "vitest";
import { getProjectPriority, matchesSearchText } from "../../shared/dashboard-ops";

describe("dashboard ops", () => {
  it("prioritizes pending confirmations ahead of drafts", () => {
    expect(getProjectPriority({ status: "pending_confirmation" }).priority).toBeGreaterThan(
      getProjectPriority({ status: "draft" }).priority,
    );
  });

  it("matches search terms across project titles and workflow states", () => {
    expect(
      matchesSearchText("pending artist split", {
        title: "Artist Split",
        status: "pending_confirmation",
        type: "song",
      }),
    ).toBe(true);
    expect(
      matchesSearchText("royalty review", {
        title: "Artist Split",
        status: "pending_confirmation",
        type: "song",
      }),
    ).toBe(false);
  });
});
