"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo imgClassName="h-6 w-6" />
          <span className="text-lg font-bold text-slate-900">Ondex</span>
        </Link>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1.5 border-blue-500/50 text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Testnet
          </Badge>
        </div>
      </div>
    </header>
  )
}
