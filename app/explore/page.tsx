"use client";

import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/searchBar/SearchBar";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import { useRooms } from "@/hooks/useRooms";
import { mockRooms } from "@/types/roomsTypes";

export default function Home() {
  const rooms: mockRooms[] = useRooms();

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <SearchBar />
      <TitleBackgroundCard
        title="Explore Rooms"
        hidebutton={true}
        noShadow={true}
      >
        {rooms.map((room) => (
          <RoomCard key={room._id.$oid} room={room} />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}
