"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useHydrated } from "@/lib/use-hydrated";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  confirmText: string;
  title?: string;
  label?: string;
  redirectToList?: boolean;
  triggerClassName?: string;
};

export function DeleteButton({
  action,
  confirmText,
  title = "Delete?",
  label = "Delete",
  redirectToList = false,
  triggerClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const hydrated = useHydrated();

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

  const modal = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: "var(--paper)" }}
            className="relative w-full max-w-sm rounded-2xl border border-ink/10 p-6 shadow-2xl"
          >
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{confirmText}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="magnetic-btn rounded-full border border-ink/20 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-soft hover:border-ink/50 hover:text-ink"
              >
                Cancel
              </button>
              <form action={action} onSubmit={() => setPending(true)}>
                {redirectToList && <input type="hidden" name="redirect" value="list" />}
                <button
                  type="submit"
                  disabled={pending}
                  className="magnetic-btn rounded-full bg-terracotta px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-ink disabled:opacity-50"
                >
                  {pending ? "Deleting…" : label}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "kinetic-link font-mono text-xs uppercase tracking-widest text-terracotta"
        }
      >
        {label}
      </button>
      {hydrated && createPortal(modal, document.body)}
    </>
  );
}
