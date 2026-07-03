"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { flyToCart } from "@/lib/fly-to-cart";

export function AddToCartForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState<Record<string, string>>(
    Object.fromEntries((product.variants ?? []).map((v) => [v.label, v.options[0]]))
  );
  const addLine = useCartStore((s) => s.addLine);

  const disabled = product.status === "sold_out";
  const ctaLabel =
    product.status === "sold_out"
      ? "Out of stock"
      : product.status === "preorder"
      ? "Pre-order"
      : "Add to cart";

  return (
    <div className="flex flex-col gap-6">
      {(product.variants ?? []).map((variant) => (
        <div key={variant.label} className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            {variant.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setVariants((v) => ({ ...v, [variant.label]: option }))}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  variants[variant.label] === option
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink-soft hover:border-ink/60"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Quantity
        </span>
        <div className="flex items-center gap-3 rounded-full border border-ink/20 px-3 py-2">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-ink-soft hover:text-ink"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center font-mono text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
            className="text-ink-soft hover:text-ink"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={disabled}
        className="w-full"
        onClick={() => {
          flyToCart(document.getElementById("product-hero-image"), product.images[0]);
          addLine({
            productId: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity,
            selectedVariants: Object.keys(variants).length ? variants : undefined,
          });
          toast.success(`${product.title} added to cart`, {
            description: `Qty: ${quantity}`,
          });
        }}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
