"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(() => useCartStore.persist?.hasHydrated() ?? false);

  useEffect(() => useCartStore.persist?.onFinishHydration(() => setHydrated(true)), []);

  return hydrated;
}
