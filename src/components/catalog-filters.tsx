import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mock-data";

export function CatalogFilters({
  activeCategory,
  search,
}: {
  activeCategory: string;
  search: string;
}) {
  const categories = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-col gap-6 border-b border-ink/10 pb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = category === activeCategory;
          const href =
            category === "All" ? "/catalog" : `/catalog?category=${encodeURIComponent(category)}`;
          return (
            <Link
              key={category}
              href={href}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink-soft hover:border-ink/60"
              )}
            >
              {category}
            </Link>
          );
        })}
      </div>
      <form action="/catalog" method="get" className="relative max-w-sm">
        {activeCategory !== "All" && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search the shop…"
          className="w-full rounded-full border border-ink/20 bg-paper py-2.5 pl-10 pr-4 text-sm outline-none focus:border-terracotta"
        />
      </form>
    </div>
  );
}
