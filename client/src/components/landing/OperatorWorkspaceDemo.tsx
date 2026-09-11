import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const NAV = ["Projects", "Clients", "Agreements", "Ownership", "Billing"] as const;
const CONTRIBUTORS = [
  { name: "Jordan S.", role: "Producer", pct: 40 },
  { name: "Maya C.", role: "Writer", pct: 35 },
  { name: "Dev P.", role: "Co-writer", pct: 25 },
] as const;

type Phase = "list" | "open" | "send" | "done";

const SEQUENCE: { phase: Phase; ms: number }[] = [
  { phase: "list", ms: 2600 },
  { phase: "open", ms: 3200 },
  { phase: "send", ms: 2400 },
  { phase: "done", ms: 3000 },
];

function statusFor(phase: Phase, index: number): { label: string; tone: string } {
  if (phase === "done") return { label: "Confirmed", tone: "text-emerald-600 dark:text-emerald-400" };
  if (phase === "send") return { label: "Sent", tone: "text-accent" };
  if (phase === "open" && index === 0) return { label: "Confirmed", tone: "text-emerald-600 dark:text-emerald-400" };
  return { label: index === 0 ? "Ready" : "Not sent", tone: "text-muted-foreground" };
}

export default function OperatorWorkspaceDemo({ loop = true }: { loop?: boolean }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce || !loop ? "open" : "list");

  useEffect(() => {
    if (reduce || !loop) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      timer = setTimeout(() => {
        i = (i + 1) % SEQUENCE.length;
        setPhase(SEQUENCE[i].phase);
        tick();
      }, SEQUENCE[i].ms);
    };
    tick();
    return () => clearTimeout(timer);
  }, [reduce]);

  const navActive = phase === "send" || phase === "done" ? "Agreements" : "Projects";
  const confirmed = phase === "done" ? 3 : phase === "send" ? 1 : phase === "open" ? 1 : 0;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs font-medium text-muted-foreground">
          Operator workspace
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-landing-pulse-ring rounded-full bg-accent" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Live demo
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[11rem_1fr]">
        <aside className="hidden space-y-1.5 border-r border-border bg-muted/30 p-3 md:block">
          {NAV.map((item) => (
            <motion.div
              key={item}
              layout
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors duration-300 ${
                item === navActive
                  ? "bg-accent/15 text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item}
            </motion.div>
          ))}
        </aside>

        <div className="relative min-h-[22rem] p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {phase === "list" && !reduce ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Projects
                  </p>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                    New project
                  </span>
                </div>
                {[
                  { title: "Midnight Drive", meta: "3 contributors · splits set", status: "Pending confirmation" },
                  { title: "Late Light", meta: "2 contributors · draft", status: "Draft" },
                ].map((row, i) => (
                  <motion.div
                    key={row.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 * i }}
                    className={`rounded-lg border px-3 py-3 ${
                      i === 0 ? "border-accent/50 bg-accent/5" : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{row.meta}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground">{row.status}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active project
                    </p>
                    <p className="text-lg font-semibold text-foreground">Midnight Drive</p>
                    <p className="text-xs text-muted-foreground">
                      {confirmed}/3 confirmed · CAD rights record
                    </p>
                  </div>
                  <motion.span
                    key={phase}
                    initial={reduce ? false : { scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground"
                  >
                    {phase === "done" ? "Confirmed" : phase === "send" ? "Sending…" : "Pending confirmation"}
                  </motion.span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-accent"
                    animate={{ width: `${(confirmed / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                <div className="space-y-2">
                  {CONTRIBUTORS.map((row, i) => {
                    const status = statusFor(phase, i);
                    return (
                      <motion.div
                        key={row.name}
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reduce ? 0 : 0.08 * i }}
                        className="rounded-lg border border-border bg-background px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{row.name}</p>
                            <p className="text-xs text-muted-foreground">{row.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">{row.pct}%</p>
                            <p className={`text-[11px] font-medium ${status.tone}`}>{status.label}</p>
                          </div>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full bg-primary/70"
                            initial={{ width: 0 }}
                            animate={{ width: `${row.pct}%` }}
                            transition={{ duration: 0.7, delay: 0.15 * i, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  <motion.span
                    animate={
                      phase === "send" && !reduce
                        ? { scale: [1, 1.04, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.7, repeat: phase === "send" ? 1 : 0 }}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {phase === "done" ? "View ledger" : "Send confirmations"}
                  </motion.span>
                  <span className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Open agreement
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "send" && !reduce && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-4 right-4 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              >
                Confirmation links sent to 2 contributors
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
