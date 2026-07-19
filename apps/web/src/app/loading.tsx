import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
        <div className="flex items-center justify-between h-full px-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
      <div className="pt-16 p-8">
        <div className="space-y-6">
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
