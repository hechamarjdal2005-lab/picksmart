import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "PickSmart | Expert Product Reviews & Comparisons",
    template: "%s | PickSmart",
  },
  description: siteConfig.description,
  openGraph: {
    title: "PickSmart | Expert Product Reviews & Comparisons",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logoUrl } = await getSiteSettings();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/*
          Inter is loaded via a runtime stylesheet link (not next/font/google),
          because next/font fetches the font files at BUILD time and this build
          environment has no outbound network access — that failed fetch is what
          produced the 404s for the self-hosted /_next/static/media/*.woff2 files.
          The browser loads these at runtime, with a system-ui fallback in CSS.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
        {/* Single Material Symbols stylesheet (audit 1.2/11.4 — was duplicated). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="font-sans">
        <AppChrome logoUrl={logoUrl}>{children}</AppChrome>
      </body>
    </html>
  );
}
