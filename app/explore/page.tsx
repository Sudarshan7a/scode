"use client";

import React, { useMemo } from "react";
import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/searchBar/SearchBar";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import { useRooms } from "@/hooks/useRooms";
import { mockRooms } from "@/types/roomsTypes";
import { SkeletonList } from "@/components/ui/Skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function Home() {
  const { rooms, isLoading, error, refetch } = useRooms();

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="large" text="Loading rooms..." showText />
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
            <h3 className="text-lg font-semibold">Failed to Load Rooms</h3>
            <p className="text-foreground/70 max-w-md">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    if (!rooms || rooms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Rooms Found</h3>
            <p className="text-foreground/70">
              There are no rooms available at the moment. Check back later!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {rooms.map((room) => (
          <RoomCard key={room.id || room.title} room={room as unknown as mockRooms} />
        ))}
      </div>
    );
  }, [rooms, isLoading, error, refetch]);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <SearchBar />
      <TitleBackgroundCard
        title="Explore Rooms"
        hidebutton={true}
        noShadow={true}
      >
        {renderContent}
      </TitleBackgroundCard>
    </div>
  );
}
