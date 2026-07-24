"use client";

import { WalletProvider } from "@/providers/wallet";
import { AuthProvider } from "@/providers/auth";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";
import IntroSplash from "@/components/landing/intro-splash";

export function SplashRoot({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AuthProvider>
        <ToastProvider>
          <IntroSplash />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
