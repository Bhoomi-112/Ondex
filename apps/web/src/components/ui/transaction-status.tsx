"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { getExplorerUrl } from "@/lib/tx";

interface TransactionStatusProps {
  status: "idle" | "signing" | "submitting" | "confirming" | "success" | "error";
  txHash?: string;
  error?: string;
}

const statusMessages = {
  idle: "",
  signing: "Awaiting wallet signature...",
  submitting: "Submitting transaction to network...",
  confirming: "Waiting for ledger confirmation...",
  success: "Transaction confirmed!",
  error: "Transaction failed",
};

export function TransactionStatus({ status, txHash, error }: TransactionStatusProps) {
  if (status === "idle") return null;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {status === "signing" || status === "submitting" || status === "confirming" ? (
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      ) : null}

      <p className="text-sm text-text-secondary">{statusMessages[status]}</p>

      {txHash && status === "success" && (
        <a
          href={getExplorerUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          View on Stellar Expert
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {txHash && status === "error" && (
        <a
          href={getExplorerUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:underline"
        >
          View failed transaction →
        </a>
      )}

      {error && (
        <p className="text-xs text-danger max-w-md text-center">{error}</p>
      )}
    </div>
  );
}
