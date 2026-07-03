"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useHydrated } from "@/lib/use-hydrated";

type NavItem = { href: string; label: string; accent?: boolean };

export function MobileMenu({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();

  // Lock body scroll while the menu is open, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = (
    <AnimatePresence>
      {open && (
        <div className="md:hidden">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm"
          />
          <motion.nav
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{ backgroundColor: "var(--paper)" }}
            className="fixed right-0 top-0 z-[91] flex h-full w-[82%] max-w-sm flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <span className="font-display text-xl">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink-soft transition-colors hover:border-ink/50 hover:text-ink"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-6 py-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-ink/10 py-4 font-display text-3xl ${
                      item.accent ? "text-terracotta" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="mx-6 mt-auto mb-8 rounded-full bg-ink px-6 py-4 text-center font-mono text-sm uppercase tracking-widest text-paper"
            >
              View cart
            </Link>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 text-ink-soft transition-colors hover:border-ink/50 hover:text-ink"
      >
        <Menu size={18} strokeWidth={1.5} />
      </button>

      {hydrated && createPortal(overlay, document.body)}
    </div>
  );
}
