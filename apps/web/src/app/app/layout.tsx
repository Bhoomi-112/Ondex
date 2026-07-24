"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuthContext } from "@/components/auth/auth-provider"
import { TopNav } from "@/components/layout/top-nav"
import { SideNav } from "@/components/layout/side-nav"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, loading, role } = useAuthContext()

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNav />
        <div className="flex pt-16">
          <div className="w-64 border-r border-slate-200 p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex-1 p-8 space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="flex pt-16">
        {role && <SideNav role={role} />}
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AuthProvider>
  )
}
