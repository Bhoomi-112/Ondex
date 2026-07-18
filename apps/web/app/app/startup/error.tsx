"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function StartupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Startup Error</h2>
          <p className="text-zinc-400 text-sm mb-6">{error.message || "An unexpected error occurred."}</p>
          <Button onClick={reset}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  )
}
