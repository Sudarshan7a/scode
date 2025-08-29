"use client";
import MyDropdown from "../../../components/custom/MyDrowdown";
import RoomCard from "../../../components/RoomCard";
import { mockRoomsData } from "../../../constants/mockRooms";
import React, { useState } from "react";

function Page() {
  const [sessions, setSessions] = useState(mockRoomsData); // Use mockRoomsData instead of sampleSessions

  // Removed unused state and functions for now
  // We'll implement these when connecting to real data

  return (
    <div className="w-10/12 mx-auto mt-4">
      <h1 className="text-title font-bold">Your sessions</h1>
      <div id="my-sessions" className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <MyDropdown
              title="Filter by"
              items={["name", "language", "duration"]}
              classname="bg-secondary rounded-md shadow-md w-32"
            />
          </div>
          <div>
            <MyDropdown
              title="Sort by"
              items={["ascending", "descending"]}
              classname="bg-secondary rounded-md shadow-md w-32"
            />
          </div>
        </div>
        <div className="my-8 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((room) => (
            <RoomCard
              key={room._id.$oid}
              room={room}
              className="hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
            />
          ))}
        </div>
      </div>
      <button onClick={() => setSessions([])}>Clear Sessions</button>
    </div>
  );
}

export default Page;
