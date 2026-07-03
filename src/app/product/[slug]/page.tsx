import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const canonical = `/product/${product.slug}`;
  const description = `${product.subtitle} — ${product.description}`.slice(0, 160);

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${product.title} — ${SITE.name}`,
      description,
      url: `${SITE.url}${canonical}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — ${SITE.name}`,
      description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const availability =
    product.status === "sold_out"
      ? "https://schema.org/OutOfStock"
      : product.status === "preorder"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/InStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => `${SITE.url}${img}`),
    category: product.category,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability,
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="aspect-square overflow-hidden rounded-2xl bg-paper-raised shadow-[0_30px_60px_-30px_rgb(var(--shadow-color)/0.5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="product-hero-image"
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
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
