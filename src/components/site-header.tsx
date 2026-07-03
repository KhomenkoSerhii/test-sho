"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCartHydrated } from "@/store/use-hydrated";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=Освітлення", label: "Освітлення" },
  { href: "/catalog?category=Меблі", label: "Меблі" },
];

export function SiteHeader() {
  const hydrated = useCartHydrated();
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Terra&nbsp;Studio
        </Link>
        <nav className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-ink-soft md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="kinetic-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/cart"
          className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          Кошик
          {hydrated && itemCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] text-paper">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
