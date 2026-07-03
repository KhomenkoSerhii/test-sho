import type { Metadata } from "next";
import { listProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { CatalogFilters } from "@/components/catalog-filters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade ceramics, textiles, lighting, and furniture in limited runs. Filter by category and find your next piece.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category = "All", search = "" } = await searchParams;
  const products = await listProducts({ category, search });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">Shop</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Catalog</h1>
      </div>
      <CatalogFilters activeCategory={category} search={search} />
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        {products.length} {products.length === 1 ? "item" : "items"}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
