import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/states/empty-state";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Нічого не знайдено"
        description="Спробуйте іншу категорію або скиньте пошук — вітрина оновлюється щотижня."
      />
    );
  }

  return (
    <div className="grid auto-rows-[220px] grid-cols-1 gap-5 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
