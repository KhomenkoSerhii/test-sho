"use client";

import Link from "next/link";
import { useRef } from "react";
import { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";

const SIZE_SPAN: Record<Product["size"], string> = {
  sm: "md:col-span-1 md:row-span-1",
  md: "md:col-span-1 md:row-span-2",
  lg: "md:col-span-2 md:row-span-2",
};

const MAX_TILT = 7;

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(px - 0.5) * MAX_TILT * 2}deg`);
    el.style.setProperty("--ry", `${-(py - 0.5) * MAX_TILT * 2}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <Link
      ref={ref}
      href={`/product/${product.slug}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        "tilt-card group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper-raised",
        SIZE_SPAN[product.size]
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.title}
          className="tilt-media h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink backdrop-blur"
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
              Sale
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
      <span className="tilt-sheen" aria-hidden />
    </Link>
  );
}
