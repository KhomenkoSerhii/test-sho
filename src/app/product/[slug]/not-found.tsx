import Link from "next/link";
import { EmptyState } from "@/components/states/empty-state";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <EmptyState
        title="Product not found"
        description="It may no longer be for sale, or the link is out of date."
        action={
          <Link href="/catalog" className="kinetic-link font-mono text-xs uppercase tracking-widest">
            Back to the shop →
          </Link>
        }
      />
    </div>
  );
}
