"use client";

import React, { useMemo, useCallback } from "react";
import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/searchBar/SearchBar";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import { useRooms } from "@/hooks/useRooms";
import { mockRooms } from "@/types/roomsTypes";
import { SkeletonList } from "@/components/ui/Skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ExploreProvider, useExplore } from "@/contexts/ExploreContext";

function ExploreContent() {
  const { rooms, isLoading, error, refetch, totalRooms, allRoomsCount } =
    useRooms();
  const {
    filters,
    pagination,
    resetFilters,
    hasActiveFilters,
    setCurrentPage,
    setLanguages,
    setStatuses,
    setPrivacy,
    setRoomTypes,
  } = useExplore();

  const { currentPage, totalPages, pageSize } = pagination;
  const { languages, statuses, privacy, roomTypes, searchQuery } = filters;

  // Calculate pagination range
  const startResult = totalRooms > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endResult = Math.min(currentPage * pageSize, totalRooms);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show current page and neighbors
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Remove individual filter handlers
  const handleRemoveLanguage = useCallback(
    (lang: string) => {
      setLanguages(languages.filter((l) => l !== lang));
    },
    [languages, setLanguages]
  );

  const handleRemoveStatus = useCallback(
    (status: string) => {
      setStatuses(statuses.filter((s) => s !== status));
    },
    [statuses, setStatuses]
  );

  const handleRemovePrivacy = useCallback(
    (priv: string) => {
      setPrivacy(privacy.filter((p) => p !== priv));
    },
    [privacy, setPrivacy]
  );

  const handleRemoveRoomType = useCallback(
    (type: string) => {
      setRoomTypes(roomTypes.filter((rt) => rt !== type));
    },
    [roomTypes, setRoomTypes]
  );

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
      const hasFilters = hasActiveFilters();
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">
              {hasFilters ? "No Rooms Match Your Filters" : "No Rooms Found"}
            </h3>
            <p className="text-foreground/70 max-w-md">
              {hasFilters
                ? "Try adjusting your filters to see more results."
                : "There are no rooms available at the moment. Check back later!"}
            </p>
          </div>
          {hasFilters && (
            <Button onClick={resetFilters} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-start">
          {rooms.map((room) => {
            // Extract ID regardless of format (_id or _id.$oid)
            const roomId =
              typeof room._id === "string" ? room._id : room._id.$oid;
            return (
              <div key={roomId} className="flex-none">
                <RoomCard room={room as unknown as mockRooms} />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageNumbers.map((page, idx) => (
                <React.Fragment key={idx}>
                  {page === "..." ? (
                    <span className="px-2 text-muted-foreground">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={
                        currentPage === page
                          ? "bg-mysecondary hover:bg-mysecondary/90"
                          : ""
                      }
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {startResult}–{endResult} of {totalRooms} rooms
              {allRoomsCount !== totalRooms && (
                <span className="text-foreground/60">
                  {" "}
                  (filtered from {allRoomsCount} total)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }, [
    rooms,
    isLoading,
    error,
    refetch,
    hasActiveFilters,
    resetFilters,
    totalPages,
    currentPage,
    pageNumbers,
    setCurrentPage,
    startResult,
    endResult,
    totalRooms,
    allRoomsCount,
  ]);

  // Active filters display
  const activeFiltersSection = useMemo(() => {
    const hasFilters = hasActiveFilters();
    if (!hasFilters && !searchQuery) return null;

    return (
      <div className="mb-8 space-y-3 p-4 rounded-lg border border-mysecondary/20 bg-mysecondary/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Active Filters ({totalRooms} {totalRooms === 1 ? 'result' : 'results'})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs hover:bg-mysecondary/20"
          >
            Clear All
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="secondary"
              className="gap-1 pr-1 bg-mysecondary/20 text-foreground hover:bg-mysecondary/30"
            >
              Search: &quot;{searchQuery}&quot;
              <button
                onClick={() => setLanguages([])}
                className="ml-1 rounded-full hover:bg-mysecondary/40 p-0.5"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {languages.map((lang) => (
            <Badge
              key={lang}
              variant="secondary"
              className="gap-1 pr-1 bg-mysecondary/20 text-foreground hover:bg-mysecondary/30"
            >
              {lang}
              <button
                onClick={() => handleRemoveLanguage(lang)}
                className="ml-1 rounded-full hover:bg-mysecondary/40 p-0.5"
                aria-label={`Remove ${lang} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {statuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="gap-1 pr-1 bg-mysecondary/20 text-foreground hover:bg-mysecondary/30"
            >
              {status}
              <button
                onClick={() => handleRemoveStatus(status)}
                className="ml-1 rounded-full hover:bg-mysecondary/40 p-0.5"
                aria-label={`Remove ${status} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {privacy.map((priv) => (
            <Badge
              key={priv}
              variant="secondary"
              className="gap-1 pr-1 bg-mysecondary/20 text-foreground hover:bg-mysecondary/30"
            >
              {priv}
              <button
                onClick={() => handleRemovePrivacy(priv)}
                className="ml-1 rounded-full hover:bg-mysecondary/40 p-0.5"
                aria-label={`Remove ${priv} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {roomTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 pr-1 bg-mysecondary/20 text-foreground hover:bg-mysecondary/30"
            >
              {type}
              <button
                onClick={() => handleRemoveRoomType(type)}
                className="ml-1 rounded-full hover:bg-mysecondary/40 p-0.5"
                aria-label={`Remove ${type} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  }, [
    hasActiveFilters,
    searchQuery,
    languages,
    statuses,
    privacy,
    roomTypes,
    totalRooms,
    resetFilters,
    handleRemoveLanguage,
    handleRemoveStatus,
    handleRemovePrivacy,
    handleRemoveRoomType,
    setLanguages,
  ]);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <SearchBar />
      <TitleBackgroundCard
        title="Explore Rooms"
        hidebutton={true}
        noShadow={true}
      >
        {activeFiltersSection}
        {renderContent}
      </TitleBackgroundCard>
    </div>
  );
}

export default function Home() {
  return (
    <ExploreProvider>
      <ExploreContent />
    </ExploreProvider>
  );
}
