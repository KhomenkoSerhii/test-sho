import Link from "next/link";
import { EmptyState } from "@/components/states/empty-state";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <EmptyState
        title="Товар не знайдено"
        description="Можливо, він більше не продається або посилання застаріле."
        action={
          <Link href="/catalog" className="kinetic-link font-mono text-xs uppercase tracking-widest">
            Повернутись до каталогу →
          </Link>
        }
      />
    </div>
  );
}
