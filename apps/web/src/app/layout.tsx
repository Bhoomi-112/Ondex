import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/providers/wallet";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Ondex — Startup Funding on Stellar",
  description:
    "Decentralized startup funding marketplace powered by Soroban smart contracts on Stellar. Connects startups, jury, and investors through transparent, milestone-based escrow.",
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
        <WalletProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
