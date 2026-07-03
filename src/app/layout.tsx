import type { Metadata } from "next";
import { Alegreya, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GrainOverlay } from "@/components/grain-overlay";
import "./globals.css";

const displayFont = Alegreya({
  variable: "--font-fraunces",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Terra Studio — речі для дому",
  description:
    "Інтернет-магазин керамічних, текстильних та світлових об'єктів для дому. Від вітрини до оформлення замовлення.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GrainOverlay />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster position="bottom-right" toastOptions={{ className: "font-mono text-sm" }} />
      </body>
    </html>
  );
}
