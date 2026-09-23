import { z } from "zod";

export const enterpriseDemoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  workEmail: z.string().email("Valid work email is required"),
  company: z.string().min(1, "Company is required"),
  organizationType: z.enum([
    "studio",
    "label",
    "publisher",
    "production_company",
    "management",
    "distributor",
    "other",
  ]),
  role: z.string().min(1, "Role is required"),
  teamSize: z.string().min(1, "Team size is required"),
  approximateOperators: z.string().min(1, "Approximate operators is required"),
  approximateProjectsPerMonth: z.string().min(1, "Approximate projects is required"),
  currentWorkflow: z.string().min(1, "Current workflow is required"),
  currentSystems: z.string().min(1, "Current systems is required"),
  painPoint: z.string().min(1, "Primary pain point is required"),
  securityRequirements: z.string().optional().default(""),
  integrationRequirements: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

export type EnterpriseDemoRequest = z.infer<typeof enterpriseDemoSchema>;

export function buildEnterpriseDemoMailto(values: EnterpriseDemoRequest): string {
  const body = [
    "Name:", values.name,
    "",
    "Work email:", values.workEmail,
    "",
    "Company:", values.company,
    "",
    "Organization type:", values.organizationType,
    "",
    "Role:", values.role,
    "",
    "Team size:", values.teamSize,
    "",
    "Approximate operators:", values.approximateOperators,
    "",
    "Approximate projects/month:", values.approximateProjectsPerMonth,
    "",
    "Current workflow:", values.currentWorkflow,
    "",
    "Current systems:", values.currentSystems,
    "",
    "Primary pain point:", values.painPoint,
    "",
    "Security requirements:", values.securityRequirements || "Not specified",
    "",
    "Integration requirements:", values.integrationRequirements || "Not specified",
    "",
    "Message:", values.message || "",
  ].join("\n");

  const subject = encodeURIComponent("SplitSheet Enterprise Demo Request");
  return `mailto:enterprise@splitsheet.ca?subject=${subject}&body=${encodeURIComponent(body)}`;
}
