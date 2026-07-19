import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function InvestorLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card><CardContent className="py-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="py-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="py-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
