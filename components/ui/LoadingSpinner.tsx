import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  text?: string;
  showText?: boolean;
}

const sizeMap = {
  small: "h-4 w-4",
  medium: "h-6 w-6",
  large: "h-8 w-8",
};

export function LoadingSpinner({
  size = "medium",
  className,
  text = "Loading...",
  showText = false,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {showText && (
        <span className="text-sm text-primary animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
