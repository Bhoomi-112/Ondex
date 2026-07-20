"use client";

import { useEffect } from "react";
import { WalletProvider } from "@/providers/wallet";
import { AuthProvider } from "@/providers/auth";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";
import IntroSplash from "@/components/landing/intro-splash";

export function SplashRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById("work");
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <WalletProvider>
      <AuthProvider>
        <ToastProvider>
          <IntroSplash />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
