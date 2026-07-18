"use client"

import * as React from "react"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ConnectButton } from "@/components/wallet/connect-button"

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-teal-500" />
          <span className="text-xl font-bold text-teal-500">Ondex</span>
        </Link>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1.5 border-green-500/50 text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Testnet
          </Badge>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
