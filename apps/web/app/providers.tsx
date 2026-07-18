"use client"

import * as React from "react"
import { WalletProvider } from "@/components/wallet/wallet-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ToastProvider } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <WalletProvider>
        <AuthProvider>{children}</AuthProvider>
      </WalletProvider>
    </ToastProvider>
  )
}
