import RoomCard from "../../RoomCard";
import TitleBackgroundCard from "../../TitleBackgroundCard";
import React from "react";
import { getUpcomingRooms } from "@/lib/getMongoData";

export default async function UpcomingRooms() {
  const upcomingRooms = await getUpcomingRooms();

  return (
    <div className="mb-40">
      <TitleBackgroundCard title="Upcoming Rooms" noShadow={true}>
        {upcomingRooms.map((room) => (
          <RoomCard
            key={`room-${room.title}-${room._id.toString()}`}
            room={room}
          />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}
