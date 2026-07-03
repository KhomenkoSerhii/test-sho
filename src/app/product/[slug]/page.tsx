import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { AddToCartForm } from "@/components/add-to-cart-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-2xl bg-paper-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{product.title}</h1>
          <p className="mt-2 text-ink-soft">{product.subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-2xl">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="font-mono text-base text-ink-soft line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <StatusBadge status={product.status} />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-ink-soft">{product.description}</p>

        <AddToCartForm product={product} />
      </div>
    </div>
  );
}
