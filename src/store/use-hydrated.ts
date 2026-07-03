"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";

function subscribe(callback: () => void) {
  return useCartStore.persist?.onFinishHydration(callback) ?? (() => {});
}

function getSnapshot() {
  return useCartStore.persist?.hasHydrated() ?? true;
}

function getServerSnapshot() {
  return false;
}

export function useCartHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
