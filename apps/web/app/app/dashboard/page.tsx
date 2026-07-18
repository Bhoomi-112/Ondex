"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function DashboardRedirect() {
  const router = useRouter()
  const { role, isLoading } = useAuthContext()

  React.useEffect(() => {
    if (!isLoading && role) {
      router.replace(`/app/${role}`)
    }
  }, [role, isLoading, router])

  return null
}
