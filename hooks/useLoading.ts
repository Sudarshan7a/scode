import { useState, useCallback } from "react";
import { useToast } from "./useToast";

interface UseLoadingState {
  isLoading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  executeAsync: <T>(
    asyncFn: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      showToasts?: boolean;
    }
  ) => Promise<T | null>;
}

export function useLoading(initialLoading = false): UseLoadingState {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showErrorToast } = useToast();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const executeAsync = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        showToasts?: boolean;
      }
    ): Promise<T | null> => {
      const {
        successMessage,
        errorMessage,
        showToasts = false,
      } = options || {};

      try {
        startLoading();
        const result = await asyncFn();

        if (showToasts && successMessage) {
          success(successMessage);
        }

        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);

        if (showToasts) {
          showErrorToast(errorMessage || errorMsg);
        }

        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, success, showErrorToast]
  );

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    executeAsync,
  };
}

// Hook for handling multiple loading states
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some((loading) => loading);
  }, [loadingStates]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates,
  };
}
