"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary";
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  className?: string;
}

export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-card-hover">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {actions.map((action, i) =>
            action.href ? (
              <a
                key={i}
                href={action.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  action.variant === "secondary"
                    ? "border border-border bg-transparent text-text-primary hover:bg-card-hover"
                    : "bg-accent text-white hover:bg-accent-hover"
                )}
              >
                {action.label}
              </a>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className={cn(
                  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  action.variant === "secondary"
                    ? "border border-border bg-transparent text-text-primary hover:bg-card-hover"
                    : "bg-accent text-white hover:bg-accent-hover"
                )}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}