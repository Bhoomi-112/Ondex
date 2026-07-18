"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  variant?: "default" | "success" | "error";
}

interface ToastContextValue {
  toast: (props: { title: string; variant?: "default" | "success" | "error" }) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    (props: { title: string; variant?: "default" | "success" | "error" }) => {
      const id = String(++toastCounter);
      setToasts((prev) => [...prev, { id, ...props }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-lg px-4 py-3 text-sm shadow-lg transition-all",
              t.variant === "error"
                ? "bg-red-600 text-white"
                : t.variant === "success"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 text-white"
            )}
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return { toast: ctx.toast, toasts: ctx.toasts, dismiss: ctx.dismiss };
}

function createContext<T>(defaultValue: T | null) {
  return React.createContext<T | null>(defaultValue);
}
