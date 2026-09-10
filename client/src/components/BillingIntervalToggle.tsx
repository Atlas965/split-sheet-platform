import type { BillingInterval } from "@shared/billing-interval";

export default function BillingIntervalToggle({
  value,
  onChange,
}: {
  value: BillingInterval;
  onChange: (next: BillingInterval) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <p className="text-sm text-muted-foreground">Save 2 months with annual billing.</p>
      <div
        role="radiogroup"
        aria-label="Billing interval"
        className="inline-flex rounded-full border border-border bg-muted/40 p-1"
      >
        {([
          { id: "month", label: "Monthly" },
          { id: "year", label: "Annual" },
        ] as const).map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              data-testid={`billing-interval-${option.id}`}
              onClick={() => onChange(option.id)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
