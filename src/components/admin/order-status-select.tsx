"use client";

const STATUSES = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  current,
  action,
}: {
  current: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-ink/20 bg-paper px-3 py-1.5 font-mono text-xs outline-none focus:border-terracotta"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
