import { cn } from "@/lib/utils";
import { ProductStatus } from "@/lib/types";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/20 bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_LABEL: Record<ProductStatus, string> = {
  in_stock: "В наявності",
  low_stock: "Залишки закінчуються",
  sold_out: "Немає в наявності",
  preorder: "Передзамовлення",
};

const STATUS_CLASS: Record<ProductStatus, string> = {
  in_stock: "border-olive/40 text-olive",
  low_stock: "border-ochre/60 text-[#8a5a1c]",
  sold_out: "border-ink/20 text-ink-soft line-through",
  preorder: "border-terracotta/40 text-terracotta",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return <Badge className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</Badge>;
}
