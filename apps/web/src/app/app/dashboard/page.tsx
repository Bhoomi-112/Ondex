"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function DashboardRedirect() {
  const router = useRouter()
  const { role, loading } = useAuthContext()

  React.useEffect(() => {
    if (!loading && role) {
      router.replace(`/app/${role}`)
    }
  }, [role, loading, router])

  return null
}
