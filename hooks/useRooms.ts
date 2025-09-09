"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

type RoomStatus = "live" | "scheduled" | "ended" | "saved";

type Room = {
  id: string;
  title: string;
  status: RoomStatus;
  isPrivate: boolean;
  createdAt: string;
  scheduledAt?: string;
  [key: string]: unknown;
};

type UseRoomsOptions = {
  privacy?: "private" | "public" | "both"; // Filter for private, public, or both rooms
  status?: RoomStatus[]; // Filter by room status (live, scheduled, etc.)
};

export function useRooms(options: UseRoomsOptions = {}) {
  const { privacy = "both", status } = options;
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchRooms = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent multiple simultaneous requests

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/rooms", {
        cache: "no-store", // Ensure fresh data
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch rooms: ${res.statusText}`);
      }

      const data = await res.json();
      setAllRooms(data.rooms || []);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to load rooms";
      setError(errorMessage);
      console.error("Failed to fetch rooms:", e);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Fetch rooms only once on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const refetch = useCallback(() => {
    fetchRooms();
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
