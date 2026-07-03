"use server";

import { redirect } from "next/navigation";
import { getAuthServerClient } from "@/lib/supabase/auth-server";

export async function signInAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter both email and password" };
  }

  const supabase = await getAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await getAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
