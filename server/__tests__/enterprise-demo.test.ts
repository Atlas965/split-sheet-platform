import { describe, expect, it } from "vitest";
import { enterpriseDemoSchema, buildEnterpriseDemoMailto } from "../../shared/enterprise";

describe("enterprise demo requests", () => {
  it("accepts a complete enterprise lead submission", () => {
    const parsed = enterpriseDemoSchema.parse({
      name: "Alice Example",
      workEmail: "alice@example.com",
      company: "Northlane Studio",
      organizationType: "studio",
      role: "Operations Manager",
      teamSize: "11-25",
      approximateOperators: "8",
      approximateProjectsPerMonth: "25",
      currentWorkflow: "Manual emails + spreadsheets",
      currentSystems: "Google Drive, email",
      painPoint: "Tracking confirmations at scale",
      securityRequirements: "SSO later",
      integrationRequirements: "Dropbox + accounting",
      message: "We need a stronger rights workflow.",
    });

    expect(parsed.company).toBe("Northlane Studio");
    expect(parsed.organizationType).toBe("studio");
  });

  it("builds a sales mailto link that includes the requested fields", () => {
    const href = buildEnterpriseDemoMailto({
      name: "Alice Example",
      workEmail: "alice@example.com",
      company: "Northlane Studio",
      organizationType: "studio",
      role: "Operations Manager",
      teamSize: "11-25",
      approximateOperators: "8",
      approximateProjectsPerMonth: "25",
      currentWorkflow: "Manual emails + spreadsheets",
      currentSystems: "Google Drive, email",
      painPoint: "Tracking confirmations at scale",
      securityRequirements: "SSO later",
      integrationRequirements: "Dropbox + accounting",
      message: "We need a stronger rights workflow.",
    });

    expect(href).toContain("mailto:enterprise@splitsheet.ca");
    expect(href).toContain("Northlane%20Studio");
    expect(href).toContain("Tracking%20confirmations%20at%20scale");
  });
});
