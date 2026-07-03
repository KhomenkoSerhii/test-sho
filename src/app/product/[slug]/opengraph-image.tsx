import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const alt = "Product — Terra Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProductOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const title = product?.title ?? SITE.name;
  const category = product?.category ?? "";
  const price = product ? formatPrice(product.price) : "";
  const accent = product?.accent ?? "#c1531b";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f4eee4",
          backgroundImage: `radial-gradient(circle at 100% 0%, ${accent}33, transparent 45%)`,
          color: "#201c16",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {category}
            </div>
          )}
          <div style={{ fontSize: 84, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>{price}</div>
      </div>
    ),
    { ...size }
  );
}
