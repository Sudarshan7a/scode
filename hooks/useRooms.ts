import { useMemo } from "react";
import { mockRoomsData } from "../constants/mockRooms";

type RoomStatus = "live" | "scheduled" | "ended";

type UseRoomsOptions = {
  privacy?: "private" | "public" | "both"; // Filter for private, public, or both rooms
  status?: RoomStatus[]; // Filter by room status (live, scheduled, etc.)
};

export function useRooms(options: UseRoomsOptions = {}) {
  const { privacy = "both", status } = options;

  const rooms = useMemo(() => {
    return mockRoomsData.filter((room) => {
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
  }, [privacy, status]);

  return rooms;
}
