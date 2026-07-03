"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/**
 * Clears the cart once, on the order confirmation page, after a successful
 * Stripe redirect (card payments don't clear the cart before leaving the app).
 */
export function ClearCartOnSuccess() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
