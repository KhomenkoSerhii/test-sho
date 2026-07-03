import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";

const MARQUEE_WORDS = [
  "ВІД ВІТРИНИ ДО ПОРОГУ",
  "РУЧНА РОБОТА",
  "ПОВІЛЬНИЙ ДИЗАЙН",
  "ОБМЕЖЕНІ ТИРАЖІ",
];

export default async function Home() {
  const products = await listProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-20 md:pt-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-terracotta">
            Колекція 2026 · Земля та світло
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Речі для дому, які <span className="italic text-terracotta">старіють</span> красиво.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-ink-soft">
              Кераміка, текстиль та освітлення обмеженими тиражами. Кожен обʼєкт зроблений вручну
              — від глини до готового вигляду на вашій полиці.
            </p>
            <Link
              href="/catalog"
              className="magnetic-btn inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-6 py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-terracotta"
            >
              Дивитись каталог
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
            <h2 className="font-display text-3xl md:text-4xl">Обране цього тижня</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Дев’ять предметів, зроблених невеликими майстернями по всій Україні.
            </p>
          </div>
          <Link href="/catalog" className="kinetic-link hidden font-mono text-xs uppercase tracking-widest md:block">
            Уся вітрина →
          </Link>
        </Reveal>
        <ProductGrid products={featured} />
        <Link href="/catalog" className="kinetic-link self-start font-mono text-xs uppercase tracking-widest md:hidden">
          Уся вітрина →
        </Link>
      </section>
    </div>
  );
}
