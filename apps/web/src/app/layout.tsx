import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/providers/wallet";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ondex — Startup Funding on Stellar",
  description: "Decentralized startup funding platform powered by Soroban smart contracts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
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
