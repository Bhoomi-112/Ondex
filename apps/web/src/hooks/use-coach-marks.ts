"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CoachMarkStep {
  id: string;
  targetRef: React.RefObject<HTMLElement | null>;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface UseCoachMarksOptions {
  storageKey: string;
  steps: CoachMarkStep[];
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useCoachMarks({
  storageKey,
  steps,
  autoStart = false,
  onComplete,
}: UseCoachMarksOptions) {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const completed = localStorage.getItem(`coachmark_${storageKey}`);
    if (completed === "true") {
      setHasCompleted(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (autoStart && !hasCompleted && !startedRef.current) {
      startedRef.current = true;
      const dismissed = localStorage.getItem(`coachmark_${storageKey}_dismissed`);
      if (!dismissed) {
        start();
      }
    }
  }, [autoStart, hasCompleted, storageKey]);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const next = useCallback(() => {
    if (currentStep === null) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      complete();
    }
  }, [currentStep, steps.length]);

  const skip = useCallback(() => {
    complete();
  }, []);

  const complete = useCallback(() => {
    setIsActive(false);
    setCurrentStep(null);
    setHasCompleted(true);
    localStorage.setItem(`coachmark_${storageKey}`, "true");
    onComplete?.();
  }, [storageKey, onComplete]);

  const dismiss = useCallback(() => {
    setIsActive(false);
    setCurrentStep(null);
    localStorage.setItem(`coachmark_${storageKey}_dismissed`, "true");
  }, [storageKey]);

  const reset = useCallback(() => {
    setHasCompleted(false);
    setCurrentStep(null);
    setIsActive(false);
    localStorage.removeItem(`coachmark_${storageKey}`);
    localStorage.removeItem(`coachmark_${storageKey}_dismissed`);
    startedRef.current = false;
  }, [storageKey]);

  const currentStepData = currentStep !== null ? steps[currentStep] : null;

  return {
    isActive,
    currentStep,
    totalSteps: steps.length,
    currentStepData,
    start,
    next,
    skip,
    dismiss,
    reset,
    hasCompleted,
  };
}
