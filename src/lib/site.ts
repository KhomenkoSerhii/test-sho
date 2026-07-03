export const SITE = {
  name: "Terra Studio",
  title: "Terra Studio — handmade home goods",
  description:
    "An online shop for handmade ceramics, textiles, and lighting in limited runs. From storefront to checkout.",
  // Set NEXT_PUBLIC_SITE_URL in production (e.g. https://terra-studio.vercel.app)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  twitter: "@terrastudio",
  keywords: [
    "home goods",
    "handmade ceramics",
    "linen textiles",
    "lighting",
    "furniture",
    "online store",
    "e-commerce",
  ],
} as const;
