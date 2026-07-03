import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";

const SIZE_SPAN: Record<Product["size"], string> = {
  sm: "md:col-span-1 md:row-span-1",
  md: "md:col-span-1 md:row-span-2",
  lg: "md:col-span-2 md:row-span-2",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper-raised transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(32,28,22,0.35)]",
        SIZE_SPAN[product.size]
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight">{product.title}</h3>
          {product.compareAtPrice && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
              Знижка
            </span>
          )}
        </div>
        <p className="text-sm text-ink-soft">{product.subtitle}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="font-mono text-xs text-ink-soft line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <StatusBadge status={product.status} />
        </div>
      </div>
    </Link>
  );
}
