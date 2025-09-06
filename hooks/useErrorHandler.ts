"use client";

import { useCallback } from "react";
import { useToast, TOAST_MESSAGES } from "./useToast";

// Helper function to determine error message based on error type
function getErrorMessage(error: Error): string {
  if (error.message?.includes("Network Error")) {
    return TOAST_MESSAGES.SYSTEM.NETWORK_ERROR;
  }
  if (
    error.message?.includes("401") ||
    error.message?.includes("Unauthorized")
  ) {
    return TOAST_MESSAGES.SYSTEM.UNAUTHORIZED;
  }
  if (
    error.message?.includes("429") ||
    error.message?.includes("Too Many Requests")
  ) {
    return TOAST_MESSAGES.SYSTEM.RATE_LIMITED;
  }
  if (
    error.message?.includes("500") ||
    error.message?.includes("Internal Server Error")
  ) {
    return TOAST_MESSAGES.SYSTEM.SERVER_ERROR;
  }
  return `Something went wrong: ${error.message}`;
}

export function useErrorHandler() {
  const { error: showErrorToast } = useToast();

  const handleError = useCallback(
    (error: Error, errorInfo?: any, showToast = true) => {
      console.error("Error caught by error handler:", error, errorInfo);

      // Show user-friendly toast notification
      if (showToast) {
        const errorMessage = getErrorMessage(error);
        const hasRetryFunction =
          errorInfo?.retryFunction &&
          typeof errorInfo.retryFunction === "function";

        showErrorToast(errorMessage, {
          duration: 6000,
          action: hasRetryFunction
            ? {
                label: "Retry",
                onClick: errorInfo.retryFunction,
              }
            : undefined,
        });
      }

      // You can extend this to send to error reporting service
      // Example: Sentry.captureException(error, { extra: errorInfo });

      // For development, log additional context
      if (process.env.NODE_ENV === "development") {
        console.group("Error Details");
        console.error("Error:", error);
        console.error("Stack:", error.stack);
        console.error("Additional Info:", errorInfo);
        console.groupEnd();
      }
    },
    [showErrorToast]
  );

  return { handleError };
}
