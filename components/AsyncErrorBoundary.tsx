"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export function AsyncErrorBoundary({
  children,
  onRetry,
  fallbackTitle = "Loading Failed",
  fallbackMessage = "Unable to load this content. Please try again.",
}: AsyncErrorBoundaryProps) {
  const fallback = (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {fallbackTitle}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-4 max-w-sm">
        {fallbackMessage}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} showReload={false} showHome={false}>
      {children}
    </ErrorBoundary>
  );
}

export default AsyncErrorBoundary;
