"use client";

import { useEffect, useRef, useState } from "react";
import { WalletProvider } from "@/providers/wallet";
import { AuthProvider } from "@/providers/auth";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";
import IntroSplash, { SPLASH_LEAVING_EVENT } from "@/components/landing/intro-splash";

export function SplashRoot({ children }: { children: React.ReactNode }) {
  const [contentRevealed, setContentRevealed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => {
      setContentRevealed(true);
    };
    window.addEventListener(SPLASH_LEAVING_EVENT, reveal);
    return () => window.removeEventListener(SPLASH_LEAVING_EVENT, reveal);
  }, []);

  return (
    <WalletProvider>
      <AuthProvider>
        <ToastProvider>
          <IntroSplash />
          <div
            ref={contentRef}
            className={`flex min-h-screen flex-col transition-all duration-[1000ms] ease-[cubic-bezier(.22,.9,.3,1)] ${
              contentRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
