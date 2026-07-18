"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function InvestorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Investor dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <Card>
        <CardContent className="py-12">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Something went wrong
          </h2>
          <p className="text-text-secondary mb-6">
            The investor dashboard encountered an unexpected error. This may be
            due to a failed contract call or network issue.
          </p>
          {error.digest && (
            <p className="text-xs text-text-muted font-mono mb-4">
              Error: {error.digest}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Try again</Button>
            <Button variant="secondary" onClick={() => (window.location.href = "/")}>
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
