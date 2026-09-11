import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import BillingIntervalToggle from "@/components/BillingIntervalToggle";
import OperatorWorkspaceDemo from "@/components/landing/OperatorWorkspaceDemo";
import { MotionCta, Reveal } from "@/components/landing/LandingMotion";
import {
  displayPlanPrice,
  multiCreatorQuoteMailto,
  type BillingInterval,
} from "@shared/billing-interval";

/** Mirrors billing.tsx plan names/prices — do not invent. */
const OPERATOR_PLANS = [
  {
    key: "free" as const,
    name: "Starter Split",
    features: [
      "1 collaboration project",
      "Up to 2 contributors",
      "Basic split allocation",
      "Contributor confirmation links",
      "Timestamped agreement summary",
      "PDF export",
    ],
    featured: false,
  },
  {
    key: "session" as const,
    name: "Pay-Per-Session",
    features: [
      "Up to 5 contributors",
      "Split percentage configuration",
      "Contributor verification workflow",
      "Agreement completion tracking",
      "PDF export package",
      "Audit log storage",
      "Email confirmations",
    ],
    featured: true,
  },
  {
    key: "creator_pro" as const,
    name: "Creator Pro",
    features: [
      "Unlimited sessions (no per-session fee)",
      "Project history storage",
      "Saved contributor profiles",
      "Discounted premium exports",
    ],
    featured: false,
  },
  {
    key: "studio_pro" as const,
    name: "Studio Pro",
    features: [
      "Unlimited projects and contributors",
      "Team management dashboard",
      "Role-based permissions",
      "Advanced audit logs",
      "Bulk exports",
      "Priority support",
    ],
    featured: false,
  },
] as const;

const WORKFLOW_STEPS = [
  { n: "01", title: "Create project", desc: "Open a song or project and enter contributors." },
  { n: "02", title: "Set splits", desc: "Define roles and ownership percentages." },
  { n: "03", title: "Build agreement", desc: "Populate the agreement workflow from your project data." },
  { n: "04", title: "Validate", desc: "Check required fields and ownership totals before sending." },
  { n: "05", title: "Confirm", desc: "Send contributors a secure link to review and confirm." },
  { n: "06", title: "Capture evidence", desc: "Record confirmation status, timestamps, and related event data." },
  { n: "07", title: "Record rights", desc: "Keep resulting ownership information in the rights ledger." },
] as const;

const TEMPLATE_CATEGORIES = [
  "Split sheets",
  "Producer agreements",
  "Master rights",
  "Publishing",
  "Licensing",
  "Artist / label",
  "Management",
  "Live / touring",
] as const;

export default function Landing() {
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [quoteInterval, setQuoteInterval] = useState<BillingInterval>("month");
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-bold tracking-tight text-primary">SplitSheet</span>
          </a>
          <div className="hidden items-center gap-7 text-sm md:flex">
            {[
              ["#how-it-works", "How It Works"],
              ["#product", "Product"],
              ["#templates", "Templates"],
              ["#pricing", "Pricing"],
              ["#security", "Security"],
              ["/login", "Sign In"],
            ].map(([href, label]) => (
              <motion.a
                key={href}
                href={href}
                className="relative text-muted-foreground transition-colors hover:text-foreground"
                whileHover={reduce ? undefined : { y: -1 }}
              >
                {label}
              </motion.a>
            ))}
            <motion.a
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              Get Started
            </motion.a>
          </div>
          <a
            href="/login"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground md:hidden"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,hsl(210_100%_60%/0.14),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="mb-4 text-sm font-semibold tracking-wide text-accent">SplitSheet</p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Music rights documentation, built for the people who run it.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              SplitSheet helps studios, producers, and labels manage splits,
              agreements, contributor confirmations, evidence, and rights records
              in one operator-managed workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MotionCta href="/login">Get Started</MotionCta>
              <MotionCta href="#how-it-works" variant="secondary">
                See How It Works
              </MotionCta>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Software for rights workflows — not a law firm, marketplace, or escrow service.
            </p>
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          >
            <OperatorWorkspaceDemo />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold text-foreground">
            Built by{" "}
            <a
              href="https://soundledger.ca"
              className="text-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              SoundLedger Technologies Inc.
            </a>
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            SplitSheet is the first product from SoundLedger Technologies Inc.,
            an Ontario technology company building infrastructure for music rights
            and creator workflows.
          </p>
        </div>
      </section>

      <section id="product" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Music rights workflows become complicated fast.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              SplitSheet replaces fragmented documents, messages, spreadsheets, and
              follow-ups with a structured workflow.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Split information gets scattered across tools",
              "Contributors need a clear way to confirm ownership",
              "Agreements need consistent project information",
              "Teams need to know who has confirmed",
              "Records need to stay organized and retrievable",
              "Operators need an auditable history of what happened",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 0.05}>
                <li className="border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-foreground">
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How SplitSheet works
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Project → Contributors → Splits → Agreement → Review → Confirmation →
            Evidence → Rights ledger
          </p>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-xs font-bold tracking-widest text-accent">{step.n}</p>
                <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built around the operator workspace
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Projects, contributors, agreements, confirmation status, rights ledger,
            and billing — the surfaces operators use day to day.
          </p>
          <div className="mt-10 max-w-4xl">
            <OperatorWorkspaceDemo loop={false} />
          </div>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {[
              "Operator dashboard",
              "Projects",
              "Contributors",
              "Agreements",
              "Confirmation workflow",
              "Rights ledger",
              "Billing",
            ].map((s) => (
              <li key={s} className="rounded-full border border-border bg-card px-3 py-1">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Who it is for
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Built for operators who manage rights workflows for other people.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Studios",
                body: "Manage split sheets and contributor documentation across projects.",
              },
              {
                title: "Producers",
                body: "Keep collaborator information, agreements, confirmations, and rights records organized.",
              },
              {
                title: "Labels / music administrators",
                body: "Manage documentation and rights workflows across multiple creators and projects.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={reduce ? undefined : { y: -4 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contributors don&apos;t need another account.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The operator sends a secure confirmation link. Contributors review the
            relevant information, confirm their details and participation, and
            complete the workflow without creating a SplitSheet account.
          </p>
          <ol className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {["Secure link", "Review", "Confirm", "Evidence recorded"].map((step, i, arr) => (
              <motion.li
                key={step}
                initial={reduce ? false : { opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span className="hidden text-muted-foreground sm:inline" aria-hidden>
                    →
                  </span>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section id="templates" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One workflow for the documents your projects require.
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Use catalog templates across common music documentation categories.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((cat, i) => (
              <motion.span
                key={cat}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={reduce ? undefined : { y: -2 }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground"
              >
                {cat}
              </motion.span>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Templates are workflow and documentation tools. They are not legal
            advice and are not represented as counsel-approved legal instruments
            unless explicitly identified as such.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn completed workflows into organized rights records.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Once contributor information and confirmations are complete, SplitSheet
            keeps the resulting ownership information organized as a rights record
            that can be referenced later.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-2 text-sm">
            {[
              "Song",
              "Composition",
              "Master",
              "Contributors",
              "Ownership",
              "Confirmation history",
            ].map((node, i, arr) => (
              <span key={node} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-card px-3 py-2 font-medium text-foreground">
                  {node}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Know what happened.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            SplitSheet can retain operational evidence associated with the
            workflow. Evidence supports your records; it does not guarantee a
            legal outcome.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Confirmation status",
              "Timestamps",
              "Contributor information",
              "IP address where applicable",
              "User-agent information where applicable",
              "Document / version information",
              "Signature information where used",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="security" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Security, privacy, and control
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Practical controls for operator access and contributor links — without
            overstating certifications we do not hold.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Authenticated operator access",
              "Controlled contributor confirmation links",
              "Server-side authorization",
              "PostgreSQL-backed data",
              "Session management",
              "Stripe billing for operators",
              "Audit and evidence records",
              "Data export and account deletion where implemented",
            ].map((item) => (
              <li
                key={item}
                className="border-l-2 border-border pl-4 text-sm leading-relaxed text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple operator billing
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Operators pay for the workspace in CAD. Contributors do not need a paid account. Save 2 months with annual billing on Creator Pro and Studio Pro.
          </p>
          <div className="mt-8">
            <BillingIntervalToggle value={interval} onChange={setInterval} />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OPERATOR_PLANS.map((plan) => {
              const shown = displayPlanPrice(
                plan.key,
                plan.key === "free" || plan.key === "session" ? "month" : interval,
              );
              const href =
                plan.key === "creator_pro" || plan.key === "studio_pro"
                  ? `/subscribe?plan=${plan.key}&interval=${interval}`
                  : "/login";
              return (
              <motion.div
                key={plan.name}
                layout
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={reduce ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className={`flex flex-col rounded-xl border bg-card p-6 ${
                  plan.featured
                    ? "border-accent"
                    : "border-border"
                }`}
              >
                {plan.featured && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Popular
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                  {shown.saveBadge && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {shown.saveBadge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-3xl font-bold text-foreground">{shown.price}</p>
                {shown.monthlyEquivalent && (
                  <p className="mt-1 text-xs text-muted-foreground">{shown.monthlyEquivalent} equivalent</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">{shown.billing}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
                <MotionCta
                  href={href}
                  variant={plan.featured ? "accent" : "primary"}
                  className="mt-6 w-full px-4 py-2.5 text-sm"
                >
                  Get Started
                </MotionCta>
              </motion.div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <p>
              Multi-Creator ($50–$75 CAD, quote-based) and custom operator plans are
              available.
            </p>
            <label className="flex items-center gap-2">
              <span>Quote term</span>
              <select
                aria-label="Multi-Creator quote billing interval"
                className="rounded-md border border-border bg-background px-2 py-1 text-foreground"
                value={quoteInterval}
                onChange={(e) => setQuoteInterval(e.target.value as BillingInterval)}
                data-testid="landing-quote-interval"
              >
                <option value="month">Monthly</option>
                <option value="year">Annual</option>
              </select>
            </label>
            <a
              href={multiCreatorQuoteMailto(quoteInterval)}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Request a quote
            </a>
          </div>
        </div>
      </section>

      <section id="legal" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            SplitSheet provides software for documenting music rights workflows. It
            does not provide legal advice, and use of the platform does not guarantee
            the enforceability of an agreement. Users remain responsible for the
            accuracy of their information and for obtaining legal advice where
            appropriate. See Terms of Service and Privacy Policy in the site footer
            for the documents that apply.
          </p>
        </div>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Move your next rights workflow out of the inbox.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create a project, organize the splits, collect confirmations, and
            maintain the record.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MotionCta href="/login" className="w-full sm:w-auto">
              Get Started
            </MotionCta>
            <MotionCta href="#how-it-works" variant="secondary" className="w-full sm:w-auto">
              Explore SplitSheet
            </MotionCta>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
