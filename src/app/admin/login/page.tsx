"use client";

import { useActionState } from "react";
import { signInAction } from "./actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-xl border border-ink/20 bg-paper px-4 py-2.5 text-sm outline-none focus:border-terracotta";

// Prefilled for local testing only — create a matching user in Supabase
// under Authentication → Users, then remove before shipping this anywhere real.
const TEST_EMAIL = "test@terra-studio.dev";
const TEST_PASSWORD = "TerraAdmin2026!";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, { error: null });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">Admin</p>
      <h1 className="mt-2 font-display text-4xl">Sign in</h1>
      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={TEST_EMAIL}
          required
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={TEST_PASSWORD}
          required
          className={inputClass}
        />
        {state.error && (
          <p className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {state.error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-ink-soft">
        Test credentials are prefilled ({TEST_EMAIL} / {TEST_PASSWORD}). Create a matching user in
        the Supabase dashboard under Authentication → Users for this to work.
      </p>
    </div>
  );
}
