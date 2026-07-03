import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/providers/providers";
import { type Metadata, type Viewport } from "next";
import Script from "next/script";
import type React from "react";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/seo";

import "@/app/globals.css";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hash Generator and Algorithm Tools",
    template: `%s | ilovehash.dev`,
  },
  description:
    "Generate, verify, and compare cryptographic hashes, checksums, password hashes, and non-cryptographic hash functions locally in your browser.",
  keywords: [
    "hash",
    "cryptography",
    "md5",
    "sha1",
    "sha256",
    "sha384",
    "sha512",
    "digest",
    "checksum",
    "hash calculator",
    "cryptographic hash",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ilovehash.dev",
    title: "Hash Generator and Algorithm Tools",
    description:
      "Generate, verify, and compare cryptographic hashes, checksums, password hashes, and non-cryptographic hash functions locally in your browser.",
    images: [
      {
        url: "/seo.png",
        width: 1200,
        height: 630,
        alt: "ilovehash.dev - Hash Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator and Algorithm Tools",
    description:
      "Generate, verify, and compare cryptographic hashes, checksums, password hashes, and non-cryptographic hash functions locally in your browser.",
    images: ["/seo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
        )}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KKW79YC8KG"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KKW79YC8KG');
          `}
        </Script>
        <Providers>
          <Suspense>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
