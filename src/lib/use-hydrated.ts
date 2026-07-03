"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once
 * hydrated. Uses useSyncExternalStore so it never calls setState in an effect
 * — the server/first-client snapshot always matches, avoiding hydration
 * mismatches for client-only UI (theme, locale, browser APIs).
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}
