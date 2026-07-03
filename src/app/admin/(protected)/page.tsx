import Link from "next/link";

export const metadata = { title: "Admin — Terra Studio" };

export default function AdminHome() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Link
        href="/admin/products"
        className="rounded-2xl border border-ink/10 bg-paper-raised p-8 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(32,28,22,0.35)]"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Catalog</p>
        <h2 className="mt-2 font-display text-3xl">Products</h2>
        <p className="mt-2 text-sm text-ink-soft">Create, edit, and remove storefront items.</p>
      </Link>
      <Link
        href="/admin/orders"
        className="rounded-2xl border border-ink/10 bg-paper-raised p-8 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(32,28,22,0.35)]"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Fulfillment</p>
        <h2 className="mt-2 font-display text-3xl">Orders</h2>
        <p className="mt-2 text-sm text-ink-soft">Review orders and update their status.</p>
      </Link>
    </div>
  );
}
