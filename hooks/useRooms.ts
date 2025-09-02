"use client";
import { useEffect, useMemo, useState } from "react";

type RoomStatus = "live" | "scheduled" | "ended" | "saved";

type UseRoomsOptions = {
  privacy?: "private" | "public" | "both"; // Filter for private, public, or both rooms
  status?: RoomStatus[]; // Filter by room status (live, scheduled, etc.)
};

export function useRooms(options: UseRoomsOptions = {}) {
  const { privacy = "both", status } = options;
  const [allRooms, setAllRooms] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setAllRooms(data.rooms || []);
      } catch (e) {
        // ignore
      }
    };
    fetchRooms();
    return () => {
      mounted = false;
    };
  }, []);

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

  return rooms;
}
