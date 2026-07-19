"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth/auth-provider"
import { ConnectButton } from "@/components/wallet/connect-button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/app/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-teal-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Ondex</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Connect your Stellar wallet to continue
          </p>
          <div className="flex justify-center mb-6">
            <ConnectButton />
          </div>
          <p className="text-xs text-zinc-500">
            We use SEP-10 for secure wallet-based authentication
          </p>
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
