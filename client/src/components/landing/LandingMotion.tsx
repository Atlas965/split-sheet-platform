import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function MotionCta({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const look =
    variant === "secondary"
      ? "border border-border bg-card text-foreground hover:bg-muted"
      : variant === "accent"
        ? "bg-accent text-accent-foreground hover:bg-accent/90"
        : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <motion.a
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold transition-colors ${look} ${className}`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {children}
    </motion.a>
  );
}
