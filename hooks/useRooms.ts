"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useToast, TOAST_MESSAGES } from "./useToast";

type RoomStatus = "live" | "scheduled" | "ended" | "saved";

type UseRoomsOptions = {
  privacy?: "private" | "public" | "both"; // Filter for private, public, or both rooms
  status?: RoomStatus[]; // Filter by room status (live, scheduled, etc.)
};

export function useRooms(options: UseRoomsOptions = {}) {
  const { privacy = "both", status } = options;
  const { error: showErrorToast, info } = useToast();
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRooms = useCallback(async (showRetryToast = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (showRetryToast) {
        info("Refreshing rooms...", { duration: 2000 });
      }

      const res = await fetch("/api/rooms");
      if (!res.ok) {
        throw new Error(`Failed to fetch rooms: ${res.statusText}`);
      }
      const data = await res.json();
      setAllRooms(data.rooms || []);
      setRetryCount(0); // Reset retry count on success
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to load rooms";
      setError(errorMessage);
      
      // Show toast with retry option
      showErrorToast(TOAST_MESSAGES.SYSTEM.LOADING_ERROR, {
        action: {
          label: "Retry",
          onClick: () => {
            setRetryCount(prev => prev + 1);
            fetchRooms(true);
          }
        }
      });
      
      console.error("Failed to fetch rooms:", e);
    } finally {
      setIsLoading(false);
    }
  }, [showErrorToast, info]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms, retryCount]);

  const refetch = useCallback(() => {
    fetchRooms(true);
  }, [fetchRooms]);

  const rooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Privacy filter
      let matchPrivacy = false;
      if (privacy === "both") {
        matchPrivacy = true; // Show both public and private
      } else if (privacy === "private") {
        matchPrivacy = room.isPrivate;
      } else if (privacy === "public") {
        matchPrivacy = !room.isPrivate;
      }

      // Status filter
      const matchStatus =
        !status || status.length === 0
          ? true
          : status.includes(room.status as RoomStatus);

      return matchPrivacy && matchStatus;
    });
  }, [allRooms, privacy, status]);

  return {
    rooms,
    isLoading,
    error,
    refetch,
  };
}
