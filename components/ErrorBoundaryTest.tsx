"use client";

import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import ErrorBoundary from "./ErrorBoundary";
import AsyncErrorBoundary from "./AsyncErrorBoundary";

// Test component that throws an error
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error thrown intentionally!");
  }
  return (
    <div className="p-4 bg-green-100 rounded">Component working normally!</div>
  );
}

// Async component that fails
function AsyncFailingComponent({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) {
    throw new Error("Async operation failed!");
  }
  return (
    <div className="p-4 bg-blue-100 rounded">Async component working!</div>
  );
}

export default function ErrorBoundaryTest() {
  const [throwError, setThrowError] = useState(false);
  const [asyncError, setAsyncError] = useState(false);

  const handleRetry = useCallback(() => {
    setAsyncError(false);
  }, []);

  const handleToggleError = useCallback(() => {
    setThrowError(!throwError);
  }, [throwError]);

  const handleToggleAsyncError = useCallback(() => {
    setAsyncError(!asyncError);
  }, [asyncError]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Error Boundary Test Page</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Global Error Boundary</h2>
        <Button
          onClick={handleToggleError}
          variant={throwError ? "destructive" : "default"}
        >
          {throwError ? "Fix Error" : "Trigger Error"}
        </Button>

        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={throwError} />
        </ErrorBoundary>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Async Error Boundary</h2>
        <Button
          onClick={handleToggleAsyncError}
          variant={asyncError ? "destructive" : "default"}
        >
          {asyncError ? "Fix Async Error" : "Trigger Async Error"}
        </Button>

        <AsyncErrorBoundary
          onRetry={handleRetry}
          fallbackTitle="Test Async Failure"
          fallbackMessage="This is a test of the async error boundary."
        >
          <AsyncFailingComponent shouldFail={asyncError} />
        </AsyncErrorBoundary>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Click &quot;Trigger Error&quot; to test the global error boundary
          </li>
          <li>
            Click &quot;Trigger Async Error&quot; to test the async error
            boundary
          </li>
          <li>
            Try the &quot;Try Again&quot; button in the async error fallback
          </li>
          <li>Check browser console for error logging</li>
        </ul>
      </div>
    </div>
  );
}
