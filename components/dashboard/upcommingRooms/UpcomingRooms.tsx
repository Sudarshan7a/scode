import RoomCard from "@/components/RoomCard";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import { mockRoomsData } from "@/constants/mockRooms";
import { mockRooms } from "@/types/roomsTypes";
import React from "react";

// Function to filter and get upcoming rooms
const getUpcomingRooms = (): mockRooms[] => {
  return mockRoomsData
    .filter((room) => room.status === "scheduled")
    .slice(0, 3);
};

function UpcomingRooms() {
  const upcomingRooms = getUpcomingRooms();
  return (
    <div className="mb-40">
      <TitleBackgroundCard title="Upcoming Rooms" noShadow={true}>
        {upcomingRooms.map((room) => (
          <RoomCard key={room._id.$oid} room={room} />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}

export default UpcomingRooms;
