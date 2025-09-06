"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../RoomCard";
import TitleBackgroundCard from "../../TitleBackgroundCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { mockRooms } from "@/types/roomsTypes";

export default function UpcomingRoomsClient() {
  const [upcomingRooms, setUpcomingRooms] = useState<mockRooms[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/rooms/upcoming");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming rooms");
      }
      const data = await response.json();
      setUpcomingRooms(data.rooms || []);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner
              size="medium"
              text="Loading upcoming rooms..."
              showText
            />
          </div>
          <SkeletonList count={3} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="text-base font-semibold">
              Failed to Load Upcoming Rooms
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            onClick={fetchUpcomingRooms}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      );
    }

    if (!upcomingRooms || upcomingRooms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <h3 className="text-base font-semibold">No Upcoming Rooms</h3>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any upcoming rooms scheduled.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {upcomingRooms.map((room) => (
          <RoomCard key={`room-${room.title}-${room._id}`} room={room} />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-40">
      <TitleBackgroundCard title="Upcoming Rooms" noShadow={true}>
        {renderContent()}
      </TitleBackgroundCard>
    </div>
  );
}
