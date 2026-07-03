import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending_payment", label: "Очікує оплати" },
  { key: "confirmed", label: "Підтверджено" },
  { key: "processing", label: "Комплектується" },
  { key: "shipped", label: "Відправлено" },
  { key: "delivered", label: "Доставлено" },
];

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-terracotta/40 bg-terracotta/10 px-6 py-4 text-terracotta">
        Замовлення скасовано
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {STEPS.map((step, i) => {
        const done = i < activeIndex || (status === "delivered" && i <= activeIndex);
        const active = i === activeIndex;
        return (
          <li key={step.key} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-stretch">
            <div className="flex items-center gap-3 sm:w-full sm:flex-col sm:items-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                  done || active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink-soft"
                )}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 sm:h-px sm:w-full",
                    done ? "bg-ink" : "bg-ink/15"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "font-mono text-xs uppercase tracking-widest sm:mt-2 sm:text-center",
                active ? "text-ink" : "text-ink-soft"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
