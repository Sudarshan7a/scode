"use client";

import { useCallback } from "react";

export function useErrorHandler() {
  const handleError = useCallback((error: Error, errorInfo?: any) => {
    console.error("Error caught by error handler:", error, errorInfo);
    
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
  }, []);

  return { handleError };
}

export default useErrorHandler;
