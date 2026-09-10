import { describe, expect, it } from "vitest";
import {
  assertPlanAllowsInterval,
  defaultSubscriptionInterval,
  displayPlanPrice,
  mapStripePriceIdToPlan,
  parseBillingInterval,
  resolveStripePriceId,
} from "../../shared/billing-interval";

describe("billing interval parse", () => {
  it("defaults missing values to month so existing monthly clients keep working", () => {
    expect(parseBillingInterval(undefined)).toEqual({ ok: true, interval: "month" });
    expect(parseBillingInterval("")).toEqual({ ok: true, interval: "month" });
    expect(defaultSubscriptionInterval(null)).toBe("month");
    expect(defaultSubscriptionInterval("year")).toBe("year");
  });

  it("accepts month and year aliases and rejects anything else", () => {
    expect(parseBillingInterval("year")).toEqual({ ok: true, interval: "year" });
    expect(parseBillingInterval("annual")).toEqual({ ok: true, interval: "year" });
    expect(parseBillingInterval("weekly").ok).toBe(false);
    expect(parseBillingInterval("weekly")).toMatchObject({
      message: 'Invalid interval. Use "month" or "year".',
    });
  });

  it("rejects annual billing on pay-per-session and starter", () => {
    expect(assertPlanAllowsInterval("session", "year").ok).toBe(false);
    expect(assertPlanAllowsInterval("free", "year").ok).toBe(false);
    expect(assertPlanAllowsInterval("creator_pro", "year").ok).toBe(true);
  });
});

describe("pricing page display", () => {
  it("keeps Starter and Pay-Per-Session unchanged when annual is selected", () => {
    expect(displayPlanPrice("free", "year").price).toBe("$0 CAD");
    expect(displayPlanPrice("session", "year").price).toBe("$25 CAD");
    expect(displayPlanPrice("session", "year").saveBadge).toBeNull();
  });

  it("toggles Creator Pro and Studio Pro to annual CAD prices", () => {
    const creator = displayPlanPrice("creator_pro", "year");
    expect(creator.price).toBe("$150 CAD/year");
    expect(creator.monthlyEquivalent).toBe("$12.50 CAD/mo");
    expect(creator.saveBadge).toBe("Save 2 months");

    const studio = displayPlanPrice("studio_pro", "year");
    expect(studio.price).toBe("$490 CAD/year");
    expect(studio.monthlyEquivalent).toBe("$40.83 CAD/mo");

    expect(displayPlanPrice("creator_pro", "month").price).toBe("$15 CAD/mo");
    expect(displayPlanPrice("studio_pro", "month").price).toBe("$49 CAD/mo");
  });
});

describe("Stripe price ID resolution and webhook mapping", () => {
  const env = {
    STRIPE_CREATOR_PRO_PRICE_ID: "price_creator_month",
    STRIPE_STUDIO_PRO_PRICE_ID: "price_studio_month",
    STRIPE_PRICE_CREATOR_PRO_ANNUAL: "price_creator_year",
    STRIPE_PRICE_STUDIO_PRO_ANNUAL: "price_studio_year",
    STRIPE_SESSION_PRICE_ID: "price_session",
    STRIPE_PRO_PRICE_ID: "price_legacy_pro",
  };

  it("selects monthly price IDs", () => {
    expect(resolveStripePriceId("creator_pro", "month", env)).toBe("price_creator_month");
    expect(resolveStripePriceId("studio_pro", "month", env)).toBe("price_studio_month");
  });

  it("selects annual price IDs", () => {
    expect(resolveStripePriceId("creator_pro", "year", env)).toBe("price_creator_year");
    expect(resolveStripePriceId("studio_pro", "year", env)).toBe("price_studio_year");
  });

  it("maps annual and monthly price IDs back to the same plan tier", () => {
    expect(mapStripePriceIdToPlan("price_creator_year", env)).toEqual({
      tier: "creator_pro",
      interval: "year",
    });
    expect(mapStripePriceIdToPlan("price_studio_month", env)).toEqual({
      tier: "studio_pro",
      interval: "month",
    });
    expect(mapStripePriceIdToPlan("price_unknown", env)).toBeNull();
  });
});
