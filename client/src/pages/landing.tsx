import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import BillingIntervalToggle from "@/components/BillingIntervalToggle";
import OperatorWorkspaceDemo from "@/components/landing/OperatorWorkspaceDemo";
import { MotionCta, Reveal } from "@/components/landing/LandingMotion";
import {
  displayPlanPrice,
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
  {
    key: "enterprise" as const,
    name: "Enterprise",
    features: [
      "Unlimited projects",
      "Unlimited contributors",
      "Multi-team organization management",
      "Advanced role-based permissions",
      "Enterprise Rights Ledger",
      "Advanced audit history",
      "Bulk operations",
      "Advanced reporting",
      "Contributor confirmation workflows",
      "API access and webhooks",
      "Custom onboarding and support",
    ],
    featured: false,
  },
] as const;

const PLAN_WINDOWS = [
  {
    key: "studio_pro" as const,
    title: "Studio Pro",
    eyebrow: "For growing teams and rights administrators",
    useCase:
      "Manage projects, teams, contributor confirmations, and ownership records through one shared workflow.",
    details: [
      "Unlimited projects and contributors",
      "Role-based permissions and team management",
      "Advanced audit history and bulk exports",
    ],
    href: (interval: BillingInterval) => `/subscribe?plan=studio_pro&interval=${interval}`,
    cta: "Choose Studio Pro",
    featured: false,
  },
  {
    key: "enterprise" as const,
    title: "Enterprise",
    eyebrow: "For organizations with scale",
    useCase:
      "Built for multi-team music businesses that need centralized governance, custom onboarding, advanced rights reporting, and stronger operational controls.",
    details: [
      "Unlimited projects and contributors",
      "Role-based governance and team management",
      "Advanced rights ledger and audit visibility",
      "Custom onboarding and strategic support",
    ],
    href: () => "/enterprise/demo",
    cta: "Request an Enterprise Demo",
    featured: true,
  },
] as const;

const BEST_FOR_BADGES = [
  { label: "Solo operators", value: "Starter Split" },
  { label: "Recurring workflows", value: "Creator Pro" },
  { label: "Growing organizations", value: "Studio Pro" },
  { label: "Enterprise governance", value: "Enterprise" },
] as const;

const PLAN_FEATURE_MATRIX = [
  {
    feature: "Contributor confirmation links",
    values: { starter: "✓", session: "✓", creator: "✓", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "Unlimited projects",
    values: { starter: "✕", session: "✕", creator: "✓", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "Unlimited contributors",
    values: { starter: "✕", session: "✕", creator: "✓", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "Advanced role-based access",
    values: { starter: "✕", session: "✕", creator: "✕", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "Enterprise rights ledger",
    values: { starter: "✕", session: "✕", creator: "✕", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "Advanced audit history",
    values: { starter: "✕", session: "✓", creator: "✓", studio: "✓", enterprise: "✓" },
  },
  {
    feature: "API access / webhooks",
    values: { starter: "✕", session: "✕", creator: "✕", studio: "✕", enterprise: "✓" },
  },
  {
    feature: "Custom onboarding + support",
    values: { starter: "✕", session: "✕", creator: "✕", studio: "✕", enterprise: "✓" },
  },
] as const;

const PLAN_PROS_CONS = [
  {
    plan: "Starter Split",
    benefits: ["Easy onboarding", "Low-friction project setup", "Works for small workflows"],
    disadvantages: ["Limited contributor count", "No enterprise scale", "Less governance"],
  },
  {
    plan: "Pay-Per-Session",
    benefits: ["Simple per-project billing", "Good for occasional operators", "Clean project-based flow"],
    disadvantages: ["Can grow expensive", "Less ideal for recurring teams", "Fewer scale controls"],
  },
  {
    plan: "Creator Pro",
    benefits: ["Unlimited sessions", "Good recurring value", "Better project history tracking"],
    disadvantages: ["Less enterprise governance", "Fewer team controls", "Not intended for large org rollout"],
  },
  {
    plan: "Studio Pro",
    benefits: ["Team operations support", "Advanced audit usage", "Useful for growing studios"],
    disadvantages: ["Not built for multi-company scale", "More admin complexity", "Limited custom onboarding"],
  },
  {
    plan: "Enterprise",
    benefits: ["Unlimited scale", "Governance and multi-team ops", "Custom onboarding and support", "API access and advanced controls"],
    disadvantages: ["Higher cost and commitment", "Requires rollout planning", "Best suited to larger organizations"],
  },
] as const;

const WORKFLOW_STEPS = [
  { n: "01", title: "Create a project", desc: "Start a music-project record and enter its title and relevant details." },
  { n: "02", title: "Add contributors", desc: "Identify the people involved and organize their submitted information." },
  { n: "03", title: "Record allocations", desc: "Enter proposed ownership percentages and check whether they total 100%." },
  { n: "04", title: "Share contributor links", desc: "Invite contributors to review and submit information through a dedicated link." },
  { n: "05", title: "Collect confirmations", desc: "Review contributor submissions and track confirmation status." },
  { n: "06", title: "Organize documentation", desc: "Keep project information and submitted documentation associated with the record." },
  { n: "07", title: "Review the record", desc: "Find outstanding confirmations, incomplete information, and items needing attention." },
  { n: "08", title: "Export project information", desc: "Generate a PDF record for operational reference and further review." },
] as const;

const TRUST_BADGES = [
  "Operator-first workflow",
  "Contributor-friendly confirmation links",
  "Evidence-backed project records",
  "Rights-ledger ready",
] as const;

const SOCIAL_PROOF = [
  "Songwriters",
  "Producers",
  "Engineers",
  "Managers",
  "Rights administrators",
] as const;

export default function Landing() {
  const [interval, setInterval] = useState<BillingInterval>("month");
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
              ["#product", "Platform"],
              ["#how-it-works", "How It Works"],
              ["#ai-development-heading", "AI Direction"],
              ["#roadmap-heading", "Roadmap"],
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
              Intelligent infrastructure for music rights, documentation and decision traceability.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Bring music-project information, contributor confirmations and
              rights documentation into one organized workflow. SplitSheet helps
              music teams manage the information they receive, while SoundLedger
              develops a future AI-assisted layer for more transparent,
              explainable and traceable information processing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MotionCta href="/login">Create an account</MotionCta>
              <MotionCta href="#product" variant="secondary">
                Explore the platform
              </MotionCta>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              SplitSheet is a documentation and workflow tool. It does not provide legal
              advice, independently verify copyright ownership or guarantee agreement enforceability.
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
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
            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              {SOCIAL_PROOF.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-2.5 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                The platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The foundation for more intelligent music-rights management.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Music-project information is often scattered across agreements,
                email, spreadsheets, project files and conversations. SplitSheet
                brings key information into a structured digital workflow.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                What SplitSheet provides today
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Project documentation", "Create and organize music-project records."],
                  ["Contributor management", "Record the people associated with a project."],
                  ["Ownership allocations", "Document proposed percentages and check totals."],
                  ["Contributor confirmations", "Share a link for contributors to review and submit information."],
                  ["Confirmation records", "Track submissions and relevant workflow events."],
                  ["Document management", "Keep submitted information with associated project records."],
                  ["PDF exports", "Create downloadable project documentation."],
                  ["Centralized workspace", "Review project information and confirmation status."],
                ].map(([title, body]) => (
                  <li key={title} className="rounded-xl border border-border bg-card p-4">
                    <h4 className="font-semibold text-foreground">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-5">
                <h3 className="font-semibold text-foreground">Where we are going</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  SoundLedger is developing an AI-assisted information-processing
                  and decision-support layer to help users understand information
                  quality, consistency, completeness and history. These capabilities
                  are proposed research and development, not current product claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The problem: music-rights information is fragmented.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Music creation is collaborative. Contributors, studios, labels,
              publishers and rights teams rely on information that often lives in
              different systems and formats.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Contributor details may be incomplete or inconsistent",
              "Ownership allocations may not be clearly documented",
              "Different versions of project information may circulate",
              "Confirmations can be difficult to track",
              "Important documentation may be hard to retrieve",
              "Rights teams may manually reconcile information",
              "Reasons for decisions or corrections may not be recorded consistently",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 0.05}>
                <li className="border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-foreground">
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            SplitSheet organizes the workflow. SoundLedger&apos;s research and development
            direction is to make that workflow more intelligent, explainable and traceable.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How SplitSheet works
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Collect, organize and review music-project information in a structured workflow.
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
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            SplitSheet records information supplied by users. A completed workflow
            does not independently establish legal ownership or replace professional
            legal review.
          </p>
        </div>
      </section>

      <section className="border-b border-border" aria-labelledby="ai-development-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Proposed research and development
              </p>
              <h2 id="ai-development-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The next stage: AI-assisted music-rights intelligence.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                From organizing information to understanding it. SoundLedger is
                exploring AI-assisted approaches to help users process information
                efficiently, identify potential issues and understand why an item
                has been raised for review.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The goal is not to replace music professionals, legal counsel or
                rights administrators, and not to make autonomous decisions about
                ownership.
              </p>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Intelligent document processing", "Explore extraction of project details, contributors, roles, ownership percentages, dates and document references from supported documents into structured records."],
                ["02", "Rights-data validation", "Identify incomplete, conflicting or potentially inconsistent information across project records and submitted documents. A discrepancy prompts review; it does not determine legal error or a dispute."],
                ["03", "Explainable decision support", "Show what triggered a flag, which source was considered, what rule or method was applied, and why a human reviewer may want to look closer."],
                ["04", "Decision traceability", "Associate processing outputs with source information, model or rules versions, timestamps, recommendations and human review or correction activity."],
                ["05", "Human oversight", "Keep users responsible for reviewing information, resolving discrepancies and deciding what action to take."],
              ].map(([number, title, body], i) => (
                <motion.li
                  key={number}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="text-xs font-bold tracking-widest text-accent">{number}</p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Proposed information-processing framework
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ["1", "Information input"],
                ["2", "Document processing"],
                ["3", "AI-assisted analysis"],
                ["4", "Explainability"],
                ["5", "Human review"],
                ["6", "Structured record"],
              ].map(([number, label], i) => (
                <li key={number} className="relative rounded-lg border border-border bg-card px-3 py-4 text-sm font-medium text-foreground">
                  <span className="mr-2 text-accent">{number}</span>
                  {label}
                  {i < 5 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground lg:block" aria-hidden>→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Proposed capabilities are not live product features. Any system output
              is intended to support human review, not independently establish legal
              rights, copyright ownership or a final decision.
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              AI should make information easier to understand, not make unaccountable
              decisions about ownership.
            </p>
          </div>
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
            Designed for the people who work with music rights
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            SplitSheet is being developed for individuals and organizations that
            create, manage and administer music projects.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Songwriters",
                body: "Organize contributor information, document proposed splits and collect confirmations.",
              },
              {
                title: "Music producers",
                body: "Keep project information and contributor allocations organized across collaborative recordings.",
              },
              {
                title: "Recording and audio engineers",
                body: "Maintain a clearer record of the projects and contributors they work with.",
              },
              {
                title: "Recording studios",
                body: "Support consistent documentation practices across sessions and client projects.",
              },
              {
                title: "Independent labels",
                body: "Organize project information and contributor documentation across releases.",
              },
              {
                title: "Managers and rights teams",
                body: "Review project records, monitor outstanding confirmations and improve access to supporting information.",
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
            A connected workflow for contributors
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Not everyone involved in a music project needs a full software account.
            Operators can share a contributor link so invited participants can
            review and submit relevant information without purchasing a paid plan.
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

      <section id="principles" className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built around structured information and accountability
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Music-rights workflows need more than a place to store files. They need
            clear records of what information was provided, what was confirmed and
            what still needs attention.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Structured records", "Organize project and contributor information in a consistent format."],
              ["Documented confirmations", "Maintain records of contributor submissions and relevant confirmation activity."],
              ["Information consistency", "Check basic information such as ownership totals and identify incomplete records."],
              ["Traceable activity", "Support visibility into relevant workflow events and record changes."],
              ["Human review", "Keep users involved in reviewing information and making decisions."],
              ["Responsible AI development", "Design future capabilities around explainability, oversight and traceable processing."],
            ].map(([title, body], i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </motion.div>
            ))}
          </div>
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
            Music-project records can contain commercially sensitive and personal
            information. SoundLedger continues to assess appropriate safeguards as
            the product develops.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Appropriate access controls",
              "Responsible handling of contributor information",
              "Secure transmission and storage practices",
              "Clear documentation of platform functionality",
              "Appropriate retention and deletion processes",
              "Human oversight of future AI-assisted outputs",
              "Further privacy, security and legal review as capabilities develop",
            ].map((item) => (
              <li
                key={item}
                className="border-l-2 border-border pl-4 text-sm leading-relaxed text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Do not submit confidential agreements or sensitive personal information
            unless you have reviewed the current Privacy Policy and Terms. Specific
            security controls and certifications are described only where implemented
            and verified.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40" aria-labelledby="roadmap-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Product roadmap
              </p>
              <h2 id="roadmap-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Product status and development roadmap
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                We are building in stages, with a clear distinction between existing
                workflow functionality and proposed research and development.
              </p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {[
                ["Phase 1", "Current product foundation", "Project and contributor records, ownership allocation workflows, confirmation links and status tracking, document organization, PDF exports, and the operator workspace."],
                ["Phase 2", "Proposed: intelligent document processing", "Explore supported-document extraction, structured records, improved normalization and human verification."],
                ["Phase 3", "Proposed: explainable validation and traceability", "Explore potential inconsistency flags, explanations, processing/version records and human review controls."],
                ["Phase 4", "Long-term: broader rights intelligence", "Research broader information analysis, cross-project management, integrations and decision support."],
              ].map(([phase, title, body], i) => (
                <motion.li
                  key={phase}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">{phase}</p>
                  <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Development stages depend on technical validation, available resources,
            funding and customer research. Proposed capabilities are not represented
            as completed product features.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Commercial opportunity
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building infrastructure for a fragmented industry.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Music creators, studios, labels, publishers, managers and rights
                administrators generate information throughout a project&apos;s lifecycle.
                SplitSheet is SoundLedger&apos;s initial commercial product and the
                foundation for a broader music-technology platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Our commercialization approach</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Direct adoption by independent music creators",
                  "Studio pilots and workflow feedback",
                  "Engagement with music-business and audio-production education programs",
                  "Relationships with independent labels and rights professionals",
                  "Subscription and usage-based software plans",
                  "Future business-focused services and integrations",
                ].map((item) => (
                  <li key={item} className="rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                The initial focus is product validation with real users, workflow
                improvement from feedback and establishing repeatable customer adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Built in Ontario, for the music industry
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                SoundLedger Technologies Inc.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                An Ontario-based technology company headquartered in London,
                developing business and operational infrastructure for music.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Canadian music technology", "Build and commercialize products for the business infrastructure of music."],
                ["Research and development", "Explore responsible AI-assisted information processing."],
                ["Ontario collaboration", "Create opportunities across music, technology and creative sectors."],
                ["Long-term ambition", "Build a connected platform spanning software, industry information and financial intelligence."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            SplitSheet is SoundLedger&apos;s first product.{" "}
            <a href="https://soundledger.ca" className="text-accent underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
              Learn about SoundLedger
            </a>
            .
          </p>
        </div>
      </section>

      <section id="pricing" className="border-b border-border bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_46%),hsl(var(--muted)_/_0.7)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Plans</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Pricing built around your workflow
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Operators pay for the workspace in CAD. Contributors do not need a paid account. Save 2 months with annual billing on Creator Pro and Studio Pro.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {BEST_FOR_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {badge.label}: <span className="text-foreground">{badge.value}</span>
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {PLAN_WINDOWS.map((plan) => {
              const shown = displayPlanPrice(plan.key, interval);
              const href = plan.href(interval);

              return (
                <motion.article
                  key={plan.title}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={reduce ? undefined : { y: -5 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`rounded-3xl border p-6 shadow-sm ${
                    plan.featured
                      ? "border-accent bg-gradient-to-br from-accent/10 via-card to-card shadow-lg shadow-accent/10"
                      : "border-border bg-gradient-to-br from-card via-card to-accent/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                        {plan.eyebrow}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-foreground">{plan.title}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${plan.featured ? "bg-accent text-primary-foreground" : "bg-accent/10 text-accent"}`}>
                      {shown.price}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.useCase}</p>

                  <ul className="mt-5 space-y-2.5">
                    {plan.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5 text-sm text-foreground">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{shown.billing}</p>
                      {shown.monthlyEquivalent && (
                        <p className="text-xs text-muted-foreground">{shown.monthlyEquivalent} equivalent</p>
                      )}
                    </div>
                    <MotionCta href={href} className="shrink-0 px-4 py-2.5 text-sm">
                      {plan.cta}
                    </MotionCta>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Operator plans
              </p>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                <span>Annual billing available</span>
              </div>
            </div>
            <BillingIntervalToggle value={interval} onChange={setInterval} />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OPERATOR_PLANS.map((plan) => {
              const shown = displayPlanPrice(
                plan.key,
                plan.key === "free" || plan.key === "session" ? "month" : interval,
              );
              const href =
                plan.key === "enterprise"
                  ? "/enterprise/demo"
                  : plan.key === "creator_pro" || plan.key === "studio_pro"
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
                  className={`flex flex-col rounded-2xl border bg-card/80 p-5 shadow-sm ${
                    plan.featured ? "border-accent bg-card" : "border-border"
                  }`}
                >
                  {plan.featured && (
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Popular
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                    {shown.saveBadge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {shown.saveBadge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-foreground">{shown.price}</p>
                  {shown.monthlyEquivalent && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{shown.monthlyEquivalent} equivalent</p>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground">{shown.billing}</p>
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
                    {plan.key === "enterprise"
                      ? "Request an Enterprise Demo"
                      : "Get Started"}
                  </MotionCta>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm">
            <div className="border-b border-border px-4 py-3 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Detailed plan comparison
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Feature</th>
                    <th className="px-4 py-3 font-medium">Starter Split</th>
                    <th className="px-4 py-3 font-medium">Pay-Per-Session</th>
                    <th className="px-4 py-3 font-medium">Creator Pro</th>
                    <th className="px-4 py-3 font-medium">Studio Pro</th>
                    <th className="px-4 py-3 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FEATURE_MATRIX.map((row) => (
                    <tr key={row.feature} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.values.starter}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.values.session}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.values.creator}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.values.studio}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.values.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {PLAN_PROS_CONS.map((plan) => (
              <div key={plan.plan} className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{plan.plan}</h3>
                  {plan.plan === "Enterprise" && (
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Best for scale
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                      Benefits
                    </p>
                    <ul className="space-y-2 text-sm text-foreground">
                      {plan.benefits.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                      Disadvantages
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.disadvantages.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-0.5 text-red-500">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Creator Pro and Studio Pro include annual billing with two months free.
              Enterprise deployments are available with custom pricing.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/enterprise/demo"
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                Request an Enterprise Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-5 sm:px-6">
            {[
              ["What is SplitSheet?", "SplitSheet is a music-rights documentation and workflow platform that helps users organize music-project information, record proposed ownership allocations and collect contributor confirmations."],
              ["Who is SplitSheet for?", "It is designed for songwriters, producers, recording engineers, studios, independent labels, managers and music-rights teams."],
              ["Do contributors need an account?", "Contributors can participate through an operator-shared confirmation link without purchasing a paid account."],
              ["Does SplitSheet legally establish copyright ownership?", "No. SplitSheet records information supplied by users and supports documentation workflows. It does not independently verify copyright ownership or determine legal rights."],
              ["Does SplitSheet provide legal advice?", "No. It is a software platform, not a law firm. Users should consult qualified entertainment counsel for legal advice and agreement review."],
              ["Does SplitSheet currently use AI to determine ownership?", "No. The live product provides a structured documentation and workflow foundation. SoundLedger's proposed R&D focuses on document processing, information validation, explainability and decision traceability. AI outputs are intended to support human review, not independently determine ownership."],
              ["What is SoundLedger developing next?", "SoundLedger is exploring AI-assisted capabilities to help process supported documents, identify potential information inconsistencies and explain system-generated flags and recommendations."],
              ["Does a confirmation guarantee an enforceable agreement?", "No. A record of a confirmation supports documentation and traceability but does not guarantee legal enforceability."],
              ["Who develops SplitSheet?", "SplitSheet is developed by SoundLedger Technologies Inc., an Ontario-based technology company headquartered in London, Ontario."],
            ].map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                  {question}
                  <span className="shrink-0 text-xl text-accent transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
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
            Organize your music projects. Build better information workflows.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with a structured music-rights workflow while SoundLedger works
            toward a more intelligent and transparent future for music-industry
            information management.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MotionCta href="/login" className="w-full sm:w-auto">
              Create your SplitSheet account
            </MotionCta>
            <MotionCta href="mailto:support@splitsheet.ca" variant="secondary" className="w-full sm:w-auto">
              Contact SoundLedger
            </MotionCta>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            SplitSheet is software for documentation and workflow. It does not provide
            legal advice, independently verify copyright ownership or guarantee that
            a document or allocation is legally valid or enforceable. Users are
            responsible for submitted information and should seek qualified legal
            advice where appropriate.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
