import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth-server";
import { signOutAction } from "@/app/admin/login/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-2xl">
            Terra Studio Admin
          </Link>
          <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest text-ink-soft">
            <Link href="/admin/products" className="kinetic-link">
              Products
            </Link>
            <Link href="/admin/orders" className="kinetic-link">
              Orders
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <span>{user.email}</span>
          <form action={signOutAction}>
            <button type="submit" className="kinetic-link">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
