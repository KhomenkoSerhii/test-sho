"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { checkoutSchema, CheckoutFormValues, SHIPPING_FEES, SHIPPING_LABELS } from "@/lib/checkout-schema";
import { useCartStore } from "@/store/cart";
import { useCartHydrated } from "@/store/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-2.5 text-sm outline-none focus:border-terracotta";

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const discount = useCartStore((s) => s.discount);
  const couponCode = useCartStore((s) => s.couponCode);
  const clear = useCartStore((s) => s.clear);

  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingMethod: "standard", paymentMethod: "card" },
  });

  const shippingMethod = watch("shippingMethod");
  const paymentMethod = watch("paymentMethod");
  const shippingFee = SHIPPING_FEES[shippingMethod] ?? 0;
  const total = Math.max(0, subtotal - discount) + shippingFee;

  if (!hydrated) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <EmptyState
          title="Nothing to check out"
          description="Your cart is empty — add some items from the shop first."
          action={
            <Link href="/catalog" className="kinetic-link font-mono text-xs uppercase tracking-widest">
              Browse the shop →
            </Link>
          }
        />
      </div>
    );
  }

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitState("loading");
    setServerError(null);
    try {
      const { shippingMethod, paymentMethod, ...address } = values;
      const endpoint = paymentMethod === "card" ? "/api/checkout" : "/api/orders";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: { ...address, shippingMethod, paymentMethod },
          lines,
          couponCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Could not place the order");
        setSubmitState("error");
        toast.error(data.error ?? "Could not place the order");
        return;
      }

      if (data.checkoutUrl) {
        // Stripe Checkout — cart clears once payment is confirmed via webhook.
        window.location.href = data.checkoutUrl;
        return;
      }

      clear();
      router.push(`/order/${data.order.id}`);
    } catch {
      setServerError("Connection issue. Check your network and try again.");
      setSubmitState("error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Contact details
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input placeholder="Full name" className={inputClass} {...register("fullName")} />
              {errors.fullName && <p className="mt-1 text-xs text-terracotta">{errors.fullName.message}</p>}
            </div>
            <div>
              <input placeholder="+1 555 000 0000" className={inputClass} {...register("phone")} />
              {errors.phone && <p className="mt-1 text-xs text-terracotta">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <input placeholder="Email" className={inputClass} {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-terracotta">{errors.email.message}</p>}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Shipping
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input placeholder="City" className={inputClass} {...register("city")} />
              {errors.city && <p className="mt-1 text-xs text-terracotta">{errors.city.message}</p>}
            </div>
            <div>
              <input placeholder="Postal code" className={inputClass} {...register("postalCode")} />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-terracotta">{errors.postalCode.message}</p>
              )}
            </div>
          </div>
          <div>
            <input placeholder="Street, house, apartment" className={inputClass} {...register("address")} />
            {errors.address && <p className="mt-1 text-xs text-terracotta">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(SHIPPING_LABELS) as (keyof typeof SHIPPING_LABELS)[]).map((method) => (
              <label
                key={method}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  shippingMethod === method ? "border-ink bg-paper-raised" : "border-ink/20"
                }`}
              >
                <input type="radio" value={method} className="hidden" {...register("shippingMethod")} />
                <span>{SHIPPING_LABELS[method]}</span>
                <span className="font-mono text-xs text-ink-soft">
                  {formatPrice(SHIPPING_FEES[method])}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Payment
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/20 px-4 py-3 text-sm has-checked:border-ink has-checked:bg-paper-raised">
              <input type="radio" value="card" {...register("paymentMethod")} />
              Pay by card online
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink/20 px-4 py-3 text-sm has-checked:border-ink has-checked:bg-paper-raised">
              <input type="radio" value="cod" {...register("paymentMethod")} />
              Cash on delivery
            </label>
          </div>
          {paymentMethod === "card" && (
            <p className="text-xs text-ink-soft">
              You&apos;ll be redirected to a secure Stripe Checkout page to complete payment.
            </p>
          )}
        </fieldset>

        {serverError && (
          <p className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitState === "loading"}>
          {submitState === "loading" ? "Placing order…" : `Confirm order · ${formatPrice(total)}`}
        </Button>
      </form>

      <aside className="flex h-max flex-col gap-4 rounded-2xl border border-ink/10 bg-paper-raised p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Your order</p>
        <ul className="flex flex-col gap-3">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-soft">
                {line.title} × {line.quantity}
              </span>
              <span className="font-mono">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 font-mono text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-olive">
              <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-soft">
            <span>Shipping</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
