import { listProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { CatalogFilters } from "@/components/catalog-filters";

export const metadata = { title: "Каталог — Terra Studio" };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category = "Усі", search = "" } = await searchParams;
  const products = await listProducts({ category, search });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">Вітрина</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Каталог</h1>
      </div>
      <CatalogFilters activeCategory={category} search={search} />
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        {products.length} {products.length === 1 ? "товар" : "товарів"}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
