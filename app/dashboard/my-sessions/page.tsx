"use client";
import MyDropdown from "@/components/custom/MyDrowdown";
import RoomCard from "@/components/RoomCard";
import React, { useState } from "react";

// Sample session data
const sampleSessions = [
  {
    id: 1,
    title: "JavaScript Interview Prep",
    description:
      "Practice common JavaScript interview questions and coding challenges.",
    date: "Monday, 15/05/2025",
    username: "john_doe",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
  {
    id: 2,
    title: "React Component Design",
    description:
      "Discussion about best practices for React component architecture and state management.",
    date: "Tuesday, 16/05/2025",
    username: "react_master",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description:
      "Deep dive into common algorithms and data structures for technical interviews.",
    date: "Wednesday, 17/05/2025",
    username: "algo_ninja",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
  {
    id: 4,
    title: "System Design Interview",
    description:
      "Learn how to approach system design questions for senior role interviews.",
    date: "Thursday, 18/05/2025",
    username: "design_guru",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
  {
    id: 5,
    title: "TypeScript Fundamentals",
    description:
      "Understanding TypeScript types, interfaces, and advanced patterns.",
    date: "Friday, 19/05/2025",
    username: "ts_expert",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
  {
    id: 6,
    title: "Backend Development with Node.js",
    description: "Building scalable backend services with Node.js and Express.",
    date: "Saturday, 20/05/2025",
    username: "node_ninja",
    buttons: [{ label: "Join Room", variant: "default" as const }],
  },
];

function Page() {
  const [sessions, setSessions] = useState(sampleSessions); // We'll use these state values in a future implementation with real data
  // const [sessions] = useState(sampleSessions);

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
          {sessions.map((session) => (
            <RoomCard
              key={session.id}
              title={session.title}
              description={session.description}
              date={session.date}
              username={session.username}
              buttons={session.buttons}
              className="hover:shadow-lg transition-transform hover:scale-105 cursor-pointer
"
            />
          ))}
        </div>
      </div>
      <button onClick={() => setSessions([])}>Clear Sessions</button>
    </div>
  );
}

export default Page;
