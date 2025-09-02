import RoomCard from "../../RoomCard";
import TitleBackgroundCard from "../../TitleBackgroundCard";
import React from "react";
import { getUpcomingRooms } from "@/lib/getMongoData";

export default async function UpcomingRooms() {
  const upcomingRooms = await getUpcomingRooms();
  console.log(upcomingRooms);
  return (
    <div className="mb-40">
      <TitleBackgroundCard title="Upcoming Rooms" noShadow={true}>
        {upcomingRooms.map((room) => (
          <RoomCard key={room._id?.toString()} room={room} />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}
