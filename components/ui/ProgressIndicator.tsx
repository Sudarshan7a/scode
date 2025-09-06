import { useState } from "react";
import { cn } from "../../lib/utils";
import { Check, Loader2 } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "completed" | "error";
  description?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressIndicator({
  steps,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
        >
          <div className="flex-shrink-0 mt-0.5">
            {step.status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {step.status === "completed" && (
              <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-2.5 w-2.5 text-white" />
              </div>
            )}
            {step.status === "error" && (
              <div className="h-4 w-4 rounded-full bg-destructive" />
            )}
            {step.status === "pending" && (
              <div className="h-4 w-4 rounded-full border border-foreground/30" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.status === "completed" &&
                    "text-green-600 dark:text-green-400",
                  step.status === "error" && "text-destructive",
                  step.status === "loading" && "text-primary",
                  step.status === "pending" && "text-foreground/70"
                )}
              >
                {step.label}
              </p>
              {step.status === "loading" && (
                <span className="text-xs text-primary/80 animate-pulse">
                  Processing...
                </span>
              )}
            </div>
            {step.description && (
              <p className="text-xs text-foreground/60 mt-1">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for managing progress steps
export function useProgressSteps(initialSteps: ProgressStep[]) {
  const [steps, setSteps] = useState(initialSteps);

  const updateStep = (
    stepId: string,
    status: ProgressStep["status"],
    description?: string
  ) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, status, ...(description && { description }) }
          : step
      )
    );
  };

  const resetSteps = () => {
    setSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" as const }))
    );
  };

  const completeStep = (stepId: string) => updateStep(stepId, "completed");
  const startStep = (stepId: string) => updateStep(stepId, "loading");
  const failStep = (stepId: string, error?: string) =>
    updateStep(stepId, "error", error);

  return {
    steps,
    updateStep,
    resetSteps,
    completeStep,
    startStep,
    failStep,
  };
}
