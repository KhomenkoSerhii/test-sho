import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(232,180,74,0.35), transparent 45%), radial-gradient(circle at 100% 100%, rgba(193,83,27,0.25), transparent 45%)",
          color: "#201c16",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, textTransform: "uppercase" }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, lineHeight: 1.05, maxWidth: 900 }}>
            Handmade home goods that age beautifully.
          </div>
          <div style={{ fontSize: 30, color: "#57503f", maxWidth: 820 }}>
            Ceramics · Textiles · Lighting — from storefront to checkout.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#c1531b",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 10,
              background: "#c1531b",
              color: "#f4eee4",
              fontSize: 34,
            }}
          >
            T
          </div>
          2026 Collection
        </div>
      </div>
    ),
    { ...size }
  );
}
