"use client";

import React, { useEffect, useState } from "react";
import TitleBackgroundCard from "../../TitleBackgroundCard";
import RoomCard from "../../RoomCard";
import { mockRooms } from "../../../types/roomsTypes";
import { SkeletonList } from "../../../components/ui/Skeleton";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ActivitySection {
  title: string;
  rooms: mockRooms[];
  keyPrefix: string;
  isLoading?: boolean;
  error?: string | null;
}

// Component for rendering each activity section
const ActivitySection: React.FC<ActivitySection> = ({
  title,
  rooms,
  keyPrefix,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col mb-4 w-full gap-4 p-4 mx-auto">
        <div className="flex items-center justify-between w-full mx-auto">
          <h2 className="text-2xl font-secondary font-normal">{title}</h2>
          <LoadingSpinner size="small" />
        </div>
        <div className="flex items-center justify-between gap-4 w-full mx-auto">
          <SkeletonList count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mb-4 w-full gap-4 p-4 mx-auto">
        <div className="flex items-center justify-between w-full mx-auto">
          <h2 className="text-2xl font-secondary font-normal">{title}</h2>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </div>
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-foreground/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-4 w-full gap-4 p-4 mx-auto">
      <div className="flex items-center justify-between w-full mx-auto">
        <h2 className="text-2xl font-secondary font-normal">{title}</h2>
        <Button
          variant="link"
          className="cursor-pointer pr-4 text-mysecondary-hover hover:text-sky-400"
        >
          View All
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4 w-full mx-auto">
        {rooms.slice(0, 3).map((room) => (
          <RoomCard key={`${keyPrefix}-${room._id}`} room={room} />
        ))}
      </div>
    </div>
  );
};

export default function YourActivitiesClient() {
  const [activityData, setActivityData] = useState<{
    upcoming: mockRooms[];
    oldRooms: mockRooms[];
  }>({
    upcoming: [],
    oldRooms: [],
  });
  const [loadingStates, setLoadingStates] = useState({
    upcoming: true,
    oldRooms: true,
  });
  const [errors, setErrors] = useState<{
    upcoming: string | null;
    oldRooms: string | null;
  }>({
    upcoming: null,
    oldRooms: null,
  });

  const fetchData = async () => {
    const fetchRooms = async (
      endpoint: string,
      key: "upcoming" | "oldRooms",
      fallbackMessage: string
    ) => {
      setLoadingStates((prev) => ({ ...prev, [key]: true } as typeof prev));
      setErrors((prev) => ({ ...prev, [key]: null } as typeof prev));

      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await response.json();
        setActivityData(
          (prev) => ({ ...prev, [key]: data.rooms || [] } as typeof prev)
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : fallbackMessage;
        setErrors((prev) => ({ ...prev, [key]: errorMessage } as typeof prev));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [key]: false } as typeof prev));
      }
    };

    await Promise.all([
      fetchRooms(
        "/api/rooms/upcoming",
        "upcoming",
        "Failed to load upcoming rooms"
      ),
      fetchRooms("/api/rooms/old", "oldRooms", "Failed to load recent rooms"),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activitySections: ActivitySection[] = [
    {
      title: "Recent joined rooms",
      rooms: activityData.oldRooms.slice(0, 4),
      keyPrefix: "joined",
      isLoading: loadingStates.oldRooms,
      error: errors.oldRooms,
    },
    {
      title: "You hosting rooms",
      rooms: activityData.upcoming.slice(0, 4),
      keyPrefix: "hosting",
      isLoading: loadingStates.upcoming,
      error: errors.upcoming,
    },
    {
      title: "Your saved notes",
      rooms: activityData.upcoming.slice(0, 4).map((room) => ({
        ...room,
        status: "saved" as const,
        title: `${room.title} - Notes`,
      })),
      keyPrefix: "saved",
      isLoading: loadingStates.upcoming,
      error: errors.upcoming,
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
            isLoading={section.isLoading}
            error={section.error}
          />
        ))}
      </TitleBackgroundCard>
    </div>
  );
}
