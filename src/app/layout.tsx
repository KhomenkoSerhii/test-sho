import type { Metadata } from "next";
import { Alegreya, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GrainOverlay } from "@/components/grain-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemedToaster } from "@/components/themed-toaster";
import "./globals.css";

const displayFont = Alegreya({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terra Studio — home goods",
  description:
    "An online shop for handmade ceramics, textiles, and lighting. From storefront to checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <GrainOverlay />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
