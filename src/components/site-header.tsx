"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCartHydrated } from "@/store/use-hydrated";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/catalog", label: "Shop" },
  { href: "/catalog?category=Lighting", label: "Lighting" },
  { href: "/catalog?category=Furniture", label: "Furniture" },
  { href: "/admin", label: "Admin", accent: true },
];

export function SiteHeader() {
  const hydrated = useCartHydrated();
  const itemCount = useCartStore((s) => s.itemCount());
  const [popping, setPopping] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 460);
      prevCount.current = itemCount;
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Terra&nbsp;Studio
        </Link>
        <nav className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-ink-soft md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.accent ? "kinetic-link text-terracotta" : "kinetic-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/cart"
            id="cart-fly-target"
            className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">Cart</span>
            {hydrated && itemCount > 0 && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] text-paper ${
                  popping ? "cart-pop" : ""
                }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
