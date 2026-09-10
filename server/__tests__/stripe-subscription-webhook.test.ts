import { describe, expect, it } from "vitest";
import {
  entitlementFromStripeSubscription,
  STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS,
} from "../stripe-subscription-webhook";
import type Stripe from "stripe";

describe("Stripe subscription webhook contract", () => {
  it("exposes the production endpoint path as documentation constant via events list", () => {
    expect(STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS).toContain("checkout.session.completed");
    expect(STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS).toContain("customer.subscription.updated");
    expect(STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS).toContain("customer.subscription.deleted");
    expect(STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS).toContain("invoice.payment_failed");
    expect(STRIPE_SUBSCRIPTION_WEBHOOK_EVENTS).toContain("invoice.paid");
  });

  it("maps annual Stripe price IDs to Creator Pro / Studio Pro", () => {
    process.env.STRIPE_PRICE_CREATOR_PRO_ANNUAL = "price_creator_year";
    process.env.STRIPE_PRICE_STUDIO_PRO_ANNUAL = "price_studio_year";
    const creator = entitlementFromStripeSubscription({
      metadata: {},
      items: { data: [{ price: { id: "price_creator_year", recurring: { interval: "year" } } }] },
    } as unknown as Stripe.Subscription);
    const studio = entitlementFromStripeSubscription({
      metadata: { tier: "ignored" },
      items: { data: [{ price: { id: "price_studio_year", recurring: { interval: "year" } } }] },
    } as unknown as Stripe.Subscription);
    expect(creator).toEqual({ tier: "creator_pro", interval: "year" });
    expect(studio).toEqual({ tier: "studio_pro", interval: "year" });
  });
});
