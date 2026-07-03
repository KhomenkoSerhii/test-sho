import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

const MARQUEE_WORDS = [
  "FROM SHOP TO DOORSTEP",
  "HANDMADE",
  "SLOW DESIGN",
  "LIMITED RUNS",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      logo: `${SITE.url}/apple-icon`,
    },
    {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/catalog?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function Home() {
  const products = await listProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative mx-auto flex max-w-6xl flex-col gap-10 overflow-hidden px-6 pb-16 pt-20 md:pt-28">
        <div
          aria-hidden
          className="float-orb pointer-events-none absolute -right-24 -top-10 h-72 w-72 rounded-full bg-terracotta/20 blur-3xl md:h-96 md:w-96"
        />
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">
            2026 Collection · Earth &amp; Light
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="relative max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Things for the home that{" "}
            <span className="shimmer-accent italic">age</span> beautifully.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-ink-soft">
              Ceramics, textiles, and lighting in limited runs. Every object is made by hand —
              from clay to the finished piece on your shelf.
            </p>
            <Link
              href="/catalog"
              className="magnetic-btn inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-6 py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-terracotta"
            >
              Browse the shop
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="overflow-hidden border-y border-ink/10 bg-ink py-4 text-paper">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em]">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span key={i} className="flex items-center gap-12">
              {word} <span className="text-terracotta">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">This week&apos;s picks</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Nine pieces made by small workshops around the world.
            </p>
          </div>
          <Link href="/catalog" className="kinetic-link hidden font-mono text-xs uppercase tracking-widest md:block">
            View full shop →
          </Link>
        </Reveal>
        <ProductGrid products={featured} />
        <Link href="/catalog" className="kinetic-link self-start font-mono text-xs uppercase tracking-widest md:hidden">
          View full shop →
        </Link>
      </section>
    </div>
  );
}
