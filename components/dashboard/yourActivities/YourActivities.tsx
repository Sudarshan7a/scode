import React from "react";
import TitleBackgroundCard from "../../TitleBackgroundCard";
import RoomCard from "../../RoomCard";
import { getUpcomingRooms, getOldRooms } from "@/lib/getMongoData";
import { mockRooms } from "../../../types/roomsTypes";

interface ActivitySection {
  title: string;
  rooms: mockRooms[];
  keyPrefix: string;
}

// Component for rendering each activity section
const ActivitySection: React.FC<ActivitySection> = ({
  title,
  rooms,
  keyPrefix,
}) => (
  <div className="flex flex-col mb-4 w-full gap-4 p-4 mx-auto">
    <div className="flex items-center justify-between w-full mx-auto">
      <h2 className="text-2xl font-secondary font-normal">{title}</h2>
      <button className="cursor-pointer pr-4 text-mysecondary-hover hover:text-sky-400">
        View All
      </button>
    </div>
    <div className="flex items-center justify-between gap-4 w-full mx-auto">
      {rooms.slice(0, 3).map((room) => (
        <RoomCard
          key={`${keyPrefix}-${(room as mockRooms)._id.toString()}`}
          room={room}
        />
      ))}
    </div>
  </div>
);

export default async function YourActivities() {
  const upcoming = await getUpcomingRooms();
  const oldRooms = await getOldRooms();

  const activitySections: ActivitySection[] = [
    {
      title: "Recent joined rooms",
      rooms: oldRooms.slice(0, 4),
      keyPrefix: "joined",
    },
    {
      title: "You hosting rooms",
      rooms: upcoming.slice(0, 4),
      keyPrefix: "hosting",
    },
    {
      title: "Your saved notes",
      rooms: upcoming.slice(0, 4).map((room) => ({
        ...room,
        status: "saved" as const,
        title: `${room.title} - Notes`,
      })),
      keyPrefix: "saved",
    },
  ];

  return (
    <div className="mb-20">
      <TitleBackgroundCard title="Your Activities" hidebutton={true}>
        {activitySections.map((section) => (
          <ActivitySection
            key={section.keyPrefix}
            title={section.title}
            rooms={section.rooms}
            keyPrefix={section.keyPrefix}
          />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}

// export default YourActivities; (removed duplicate export)
