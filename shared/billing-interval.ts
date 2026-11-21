export type BillingInterval = "month" | "year";

export const BILLING_INTERVALS = ["month", "year"] as const;

export const SELLABLE_PLANS = ["session", "creator_pro", "studio_pro"] as const;
export type SellablePlan = (typeof SELLABLE_PLANS)[number];

export function parseBillingInterval(
  raw: unknown,
): { ok: true; interval: BillingInterval } | { ok: false; message: string } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, interval: "month" };
  }
  const value = String(raw).toLowerCase().trim();
  if (value === "month" || value === "monthly") return { ok: true, interval: "month" };
  if (value === "year" || value === "annual" || value === "annually") {
    return { ok: true, interval: "year" };
  }
  return { ok: false, message: 'Invalid interval. Use "month" or "year".' };
}

export function defaultSubscriptionInterval(existing?: string | null): BillingInterval {
  return existing === "year" ? "year" : "month";
}

export function assertPlanAllowsInterval(
  plan: string,
  interval: BillingInterval,
): { ok: true } | { ok: false; message: string } {
  if (interval === "year" && (plan === "session" || plan === "free")) {
    return {
      ok: false,
      message: "Pay-Per-Session and Starter Split do not support annual billing.",
    };
  }
  return { ok: true };
}

export function normalizeCheckoutPlan(
  raw: unknown,
): { ok: true; plan: SellablePlan } | { ok: false; message: string } {
  const value = String(raw || "creator_pro").toLowerCase().trim();
  if (value === "session" || value === "single_session" || value === "pay_per_session") {
    return { ok: true, plan: "session" };
  }
  if (value === "creator_pro" || value === "creator") {
    return { ok: true, plan: "creator_pro" };
  }
  if (value === "studio_pro" || value === "label" || value === "pro") {
    return { ok: true, plan: "studio_pro" };
  }
  return {
    ok: false,
    message: `Invalid plan: ${value}. Use session, creator_pro, or studio_pro.`,
  };
}

export const PLAN_PRICE_CENTS = {
  session: { month: 2500 },
  creator_pro: { month: 1500, year: 15000 },
  studio_pro: { month: 4900, year: 49000 },
} as const;

export function stripePriceEnvKeys(plan: string, interval: BillingInterval): string[] {
  if (plan === "session") return ["STRIPE_SESSION_PRICE_ID"];
  if (plan === "creator_pro" && interval === "year") {
    return ["STRIPE_PRICE_CREATOR_PRO_ANNUAL", "STRIPE_CREATOR_PRO_ANNUAL_PRICE_ID"];
  }
  if (plan === "studio_pro" && interval === "year") {
    return ["STRIPE_PRICE_STUDIO_PRO_ANNUAL", "STRIPE_STUDIO_PRO_ANNUAL_PRICE_ID"];
  }
  if (plan === "creator_pro") {
    return ["STRIPE_CREATOR_PRO_PRICE_ID", "STRIPE_PRO_PRICE_ID"];
  }
  if (plan === "studio_pro") {
    return ["STRIPE_STUDIO_PRO_PRICE_ID", "STRIPE_LABEL_PRICE_ID"];
  }
  return [];
}

export function resolveStripePriceId(
  plan: string,
  interval: BillingInterval,
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  for (const key of stripePriceEnvKeys(plan, interval)) {
    const value = env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function mapStripePriceIdToPlan(
  priceId: string | undefined,
  env: Record<string, string | undefined> = process.env,
): { tier: string; interval: BillingInterval } | null {
  if (!priceId) return null;
  const pairs: Array<{ tier: string; interval: BillingInterval }> = [
    { tier: "creator_pro", interval: "year" },
    { tier: "studio_pro", interval: "year" },
    { tier: "creator_pro", interval: "month" },
    { tier: "studio_pro", interval: "month" },
    { tier: "session", interval: "month" },
  ];
  for (const pair of pairs) {
    const resolved = resolveStripePriceId(pair.tier, pair.interval, env);
    if (resolved && resolved === priceId) return pair;
  }
  // Keep existing subscriptions on the retired tier recognizable to webhooks.
  if (env.STRIPE_MULTI_CREATOR_ANNUAL_PRICE_ID === priceId) {
    return { tier: "pro", interval: "year" };
  }
  if (env.STRIPE_MULTI_CREATOR_PRICE_ID === priceId) {
    return { tier: "pro", interval: "month" };
  }
  return null;
}

export function displayPlanPrice(
  plan: "free" | "session" | "creator_pro" | "studio_pro" | "enterprise",
  interval: BillingInterval,
): {
  price: string;
  billing: string;
  monthlyEquivalent: string | null;
  saveBadge: string | null;
} {
  if (plan === "free") {
    return {
      price: "$0 CAD",
      billing: "Free · no card needed",
      monthlyEquivalent: null,
      saveBadge: null,
    };
  }
  if (plan === "session") {
    return {
      price: "$25 CAD",
      billing: "Per completed session",
      monthlyEquivalent: null,
      saveBadge: null,
    };
  }
  if (plan === "creator_pro") {
    return interval === "year"
      ? {
          price: "$150 CAD/year",
          billing: "Billed annually in CAD",
          monthlyEquivalent: "$12.50 CAD/mo",
          saveBadge: "Save 2 months",
        }
      : {
          price: "$15 CAD/mo",
          billing: "Unlimited sessions · billed monthly in CAD",
          monthlyEquivalent: null,
          saveBadge: null,
        };
  }
  if (plan === "enterprise") {
    return {
      price: "Custom pricing",
      billing: "Annual contract / quote-based",
      monthlyEquivalent: null,
      saveBadge: null,
    };
  }
  return interval === "year"
    ? {
        price: "$490 CAD/year",
        billing: "Billed annually in CAD",
        monthlyEquivalent: "$40.83 CAD/mo",
        saveBadge: "Save 2 months",
      }
    : {
        price: "$49 CAD/mo",
        billing: "Unlimited projects & team · billed monthly in CAD",
        monthlyEquivalent: null,
        saveBadge: null,
      };
}
