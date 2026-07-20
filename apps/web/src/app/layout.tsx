import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SplashRoot } from "./splash-root";

export const metadata: Metadata = {
  title: "Ondex — Startup Funding on Stellar",
  description:
    "Decentralized startup funding marketplace powered by Soroban smart contracts on Stellar. Connects startups, jury, and investors through transparent, milestone-based escrow.",
  applicationName: "Ondex",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Ondex — Startup Funding on Stellar",
    description:
      "Decentralized startup funding marketplace powered by Soroban smart contracts on Stellar.",
    siteName: "Ondex",
    type: "website",
    images: [{ url: "/android-chrome-512x512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Ondex",
    description: "Startup funding on Stellar with jury-gated escrow.",
    images: ["/android-chrome-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <SplashRoot>{children}</SplashRoot>
      </body>
    </html>
  );
}
