"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { X, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  txHash?: string;
  txUrl?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 8000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full backdrop-blur",
              toast.variant === "success" && "border-success/30 bg-success/10",
              toast.variant === "error" && "border-danger/30 bg-danger/10",
              toast.variant === "warning" && "border-warning/30 bg-warning/10",
              !toast.variant && "border-border bg-card"
            )}
          >
            <div className="flex items-start gap-3">
              {toast.variant === "success" && (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              )}
              {toast.variant === "error" && (
                <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-xs text-text-secondary">{toast.description}</p>
                )}
                {toast.txHash && toast.txUrl && (
                  <a
                    href={toast.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-primary shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export type { Toast };
