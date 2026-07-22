"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachMarkProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev?: () => void;
  title: string;
  description: string;
  targetRef: React.RefObject<HTMLElement | null>;
  step: number;
  totalSteps: number;
  canGoBack?: boolean;
  isLastStep?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

export function CoachMark({
  isOpen,
  onClose,
  onNext,
  onPrev,
  title,
  description,
  targetRef,
  step,
  totalSteps,
  canGoBack = false,
  isLastStep = false,
  position = "bottom",
}: CoachMarkProps) {
  const [mounted, setMounted] = useState(false);
  const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    setMounted(true);
    const updatePosition = () => {
      if (!targetRef.current) return;
      const targetRect = targetRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const coachWidth = 320;
      const coachHeight = 160;
      const gap = 12;

      let top = 0;
      let left = 0;

      switch (position) {
        case "bottom":
          top = targetRect.bottom + gap;
          left = targetRect.left + targetRect.width / 2 - coachWidth / 2;
          break;
        case "top":
          top = targetRect.top - coachHeight - gap;
          left = targetRect.left + targetRect.width / 2 - coachWidth / 2;
          break;
        case "left":
          top = targetRect.top + targetRect.height / 2 - coachHeight / 2;
          left = targetRect.left - coachWidth - gap;
          break;
        case "right":
          top = targetRect.top + targetRect.height / 2 - coachHeight / 2;
          left = targetRect.right + gap;
          break;
      }

      left = Math.max(16, Math.min(left, viewportWidth - coachWidth - 16));
      top = Math.max(16, Math.min(top, viewportHeight - coachHeight - 16));

      setPositionStyles({ top: `${top}px`, left: `${left}px` });
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, position, targetRef]);

  if (!mounted || !isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed z-[60] w-80 rounded-xl bg-background border border-border shadow-xl p-4",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "transition-all duration-200"
        )}
        style={positionStyles}
        role="dialog"
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">{title}</h4>
              <span className="text-xs text-text-muted">
                Step {step + 1} of {totalSteps}
              </span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Dismiss tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          {canGoBack && (
            <button
              onClick={onPrev}
              className="flex-1 btn-secondary text-sm"
            >
              <ChevronLeft className="mr-1 h-3 w-3" />
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className={cn(
              "flex-1 btn-primary text-sm",
              isLastStep && "bg-success hover:bg-success-hover"
            )}
          >
            {isLastStep ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Got it
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-3 w-3" />
              </>
            )}
          </button>
        </div>
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border rotate-45"
          aria-hidden="true"
        />
      </div>
    </>
  );
}
