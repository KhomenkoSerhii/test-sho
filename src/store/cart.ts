"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  couponCode: string | null;
  discount: number;
  addLine: (line: CartLine) => void;
  removeLine: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setCoupon: (code: string | null, discount?: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,
      discount: 0,
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeLine: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.productId === productId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),
      setCoupon: (code, discount = 0) => set({ couponCode: code, discount }),
      clear: () => set({ lines: [], couponCode: null, discount: 0 }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "elevix-cart" }
  )
);
