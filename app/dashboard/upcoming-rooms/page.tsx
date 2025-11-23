"use client";

import React, { useEffect, useState, useMemo } from "react";
import RoomCard from "@/components/RoomCard";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { mockRooms } from "@/types/roomsTypes";

export default function UpcomingRoomsPage() {
  const [upcomingRooms, setUpcomingRooms] = useState<mockRooms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUpcomingRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/rooms/upcoming");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming rooms");
      }
      const data = await response.json();
      console.log("API Response:", data);
      console.log("UserId from API:", data.userId);
      setUpcomingRooms(data.rooms || []);
      setUserId(data.userId || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Failed to fetch upcoming rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingRooms();
  }, []);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner
              size="large"
              text="Loading upcoming rooms..."
              showText
            />
          </div>
          <SkeletonList count={6} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">
              Failed to Load Upcoming Rooms
            </h3>
            <p className="text-foreground/70 max-w-md">{error}</p>
          </div>
          <Button
            onClick={fetchUpcomingRooms}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    if (!upcomingRooms || upcomingRooms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Upcoming Rooms</h3>
            <p className="text-foreground/70">
              You don&apos;t have any upcoming rooms scheduled.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4 justify-start">
        {upcomingRooms.map((room) => {
          const roomOwnerId =
            typeof room.ownerId === "string"
              ? room.ownerId
              : room.ownerId?.$oid || room.ownerId?.toString();
          const isOwner = roomOwnerId === userId;
          console.log(
            "Room:",
            room.title,
            "roomOwnerId:",
            roomOwnerId,
            "userId:",
            userId,
            "isOwner:",
            isOwner
          );
          return (
            <div key={`room-${room.title}-${room._id}`} className="flex-none">
              <RoomCard room={room} isOwner={isOwner} />
            </div>
          );
        })}
      </div>
    );
  }, [upcomingRooms, isLoading, error, userId]);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <TitleBackgroundCard
        title="Your Upcoming Rooms"
        hidebutton={true}
        noShadow={true}
      >
        {renderContent}
      </TitleBackgroundCard>
    </div>
  );
}
