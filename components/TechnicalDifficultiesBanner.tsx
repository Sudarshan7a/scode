"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface TechnicalDifficultiesBannerProps {
  message?: string;
  affectedFeatures?: string[];
  onDismiss?: () => void;
  persistent?: boolean;
}

/**
 * Banner component that displays technical difficulties notice
 * Due to maintenance or technical issues, this alerts users that
 * some functionality may not work properly.
 */
export default function TechnicalDifficultiesBanner({
  message = "We're experiencing some technical difficulties. Some features may not work as expected.",
  affectedFeatures = [],
  onDismiss,
  persistent = false,
}: TechnicalDifficultiesBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    if (!persistent) {
      setIsDismissed(true);
      onDismiss?.();
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="w-full bg-amber-50 border-b-2 border-amber-200 px-4 py-3 md:py-4 sticky top-14 z-40">
      <div className="max-w-7xl mx-auto flex gap-3 items-start md:items-center">
        <div className="flex-shrink-0 mt-0.5 md:mt-0">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-base font-medium text-amber-900">
            {message}
          </p>

          {affectedFeatures && affectedFeatures.length > 0 && (
            <p className="text-xs md:text-sm text-amber-800 mt-1">
              Affected features:{" "}
              <span className="font-semibold">
                {affectedFeatures.join(", ")}
              </span>
            </p>
          )}

          <p className="text-xs text-amber-700 mt-2">
            We apologize for any inconvenience. Our team is working to resolve
            this.
          </p>
        </div>

        {!persistent && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-amber-600 hover:text-amber-900 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
