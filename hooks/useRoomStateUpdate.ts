"use client";

import { useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  RoomStateUpdateRequest,
  RoomStateUpdateResponse,
  RoomStateUpdateError,
} from "@/types/roomStateUpdate";
import { RoomState } from "@/lib/schemas/roomStateSchema";
import { useToast } from "@/hooks/useToast";

interface UseRoomStateUpdateOptions {
  onSuccess?: (response: RoomStateUpdateResponse) => void;
  onError?: (error: RoomStateUpdateError) => void;
  showToast?: boolean;
}

interface UseRoomStateUpdateReturn {
  updateState: (
    roomId: string,
    newStatus: RoomState,
    metadata?: RoomStateUpdateRequest["metadata"]
  ) => Promise<RoomStateUpdateResponse | null>;
  isLoading: boolean;
  error: RoomStateUpdateError | null;
}

/**
 * Hook for updating room state
 * Handles API calls, loading states, and toast notifications
 */
export function useRoomStateUpdate(
  options: UseRoomStateUpdateOptions = {}
): UseRoomStateUpdateReturn {
  const { onSuccess, onError, showToast = true } = options;
  const { success: successToast, error: errorToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RoomStateUpdateError | null>(null);

  const updateState = async (
    roomId: string,
    newStatus: RoomState,
    metadata?: RoomStateUpdateRequest["metadata"]
  ): Promise<RoomStateUpdateResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const request: RoomStateUpdateRequest = {
        roomId,
        newStatus,
        metadata,
      };

      const response = await axiosInstance.post<RoomStateUpdateResponse>(
        "/api/rooms/update-state",
        request
      );

      const data = response.data;

      if (showToast) {
        successToast(
          data.message ||
            `Room state updated to "${newStatus}"`,
          {
            duration: 3000,
          }
        );
      }

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: {
            error?: string;
            message?: string;
            details?: Record<string, unknown>;
          };
        };
        message?: string;
      };

      const errorData: RoomStateUpdateError = {
        error: apiError.response?.data?.error || "Failed to update room state",
        message:
          apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred",
        details: apiError.response?.data?.details,
      };

      setError(errorData);

      if (showToast) {
        errorToast(errorData.error, {
          duration: 4000,
        });
      }

      if (onError) {
        onError(errorData);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateState,
    isLoading,
    error,
  };
}
