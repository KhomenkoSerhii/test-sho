"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCartHydrated } from "@/store/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const couponCode = useCartStore((s) => s.couponCode);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const discount = useCartStore((s) => s.discount);
  const subtotal = useCartStore((s) => s.subtotal());

  const [couponInput, setCouponInput] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "loading" | "error">("idle");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!hydrated) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <EmptyState
          title="Кошик порожній"
          description="Додайте щось із вітрини — почніть із наших бестселерів."
          action={
            <Link
              href="/catalog"
              className="kinetic-link font-mono text-xs uppercase tracking-widest"
            >
              До каталогу →
            </Link>
          }
        />
      </div>
    );
  }

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponState("loading");
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Не вдалося застосувати промокод");
        setCouponState("error");
        setCoupon(null, 0);
        return;
      }
      setCoupon(data.code, data.discount);
      setCouponState("idle");
      toast.success(`Промокод ${data.code} застосовано`);
    } catch {
      setCouponError("Проблема зі з'єднанням. Спробуйте ще раз.");
      setCouponState("error");
    }
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">Кошик</h1>
      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col divide-y divide-ink/10">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-4 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={line.image}
                alt={line.title}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${line.slug}`} className="font-display text-lg">
                      {line.title}
                    </Link>
                    {line.selectedVariants && (
                      <p className="text-xs text-ink-soft">
                        {Object.values(line.selectedVariants).join(" · ")}
                      </p>
                    )}
                  </div>
                  <button
                    aria-label="Видалити товар"
                    onClick={() => removeLine(line.productId)}
                    className="text-ink-soft hover:text-terracotta"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-ink/20 px-3 py-1.5">
                    <button
                      aria-label="Зменшити кількість"
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      className="text-ink-soft hover:text-ink"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center font-mono text-sm">{line.quantity}</span>
                    <button
                      aria-label="Збільшити кількість"
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      className="text-ink-soft hover:text-ink"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="font-mono text-sm">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="flex h-max flex-col gap-6 rounded-2xl border border-ink/10 bg-paper-raised p-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              Промокод
            </span>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="TERRA10"
                className="w-full rounded-full border border-ink/20 bg-paper px-4 py-2 text-sm outline-none focus:border-terracotta"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyCoupon}
                disabled={couponState === "loading"}
              >
                {couponState === "loading" ? "…" : "OK"}
              </Button>
            </div>
            {couponError && <p className="text-xs text-terracotta">{couponError}</p>}
            {couponCode && discount > 0 && (
              <p className="text-xs text-olive">Застосовано {couponCode}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 font-mono text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Проміжна сума</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-olive">
                <span>Знижка</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-2 text-base">
              <span>Разом</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button size="lg" className="w-full">
              Оформити замовлення
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
