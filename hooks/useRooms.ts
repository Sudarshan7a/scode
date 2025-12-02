"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useExplore, RoomStatus } from "@/contexts/ExploreContext";

/**
 * Enhanced Room Type Definition
 * Matches backend schema and provides full type safety
 */
export interface Room {
  _id: string | { $oid: string };
  title: string;
  description: string;
  language: string;
  status: RoomStatus;
  isPrivate: boolean;
  host: {
    id: string;
    name: string;
    avatarId?: number;
  };
  participants?: number;
  maxParticipants?: number;
  duration?: number;
  createdAt: { $date: string } | string;
  scheduledAt?: { $date: string } | string | null;
  startedAt?: { $date: string } | string | null;
  endedAt?: { $date: string } | string | null;
  roomType?: string;
  tags?: string[];
}

interface RoomsAPIResponse {
  rooms: Room[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRooms: number;
}

/**
 * Enhanced useRooms Hook
 *
 * Integrates with ExploreContext for state management
 * Handles client-side filtering, sorting, and search
 * Supports pagination from backend
 *
 * @returns Filtered and sorted rooms based on current context state
 */
export function useRooms() {
  const { filters, sort, pagination, setTotalPages, setTotalRooms } =
    useExplore();

  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const cacheRef = useRef<{ data: Room[]; timestamp: number } | null>(null);
  // Use useMemo to create a stable CACHE_DURATION constant
  const CACHE_DURATION = useMemo(() => 5 * 60 * 1000, []); // 5 minutes cache

  /**
   * Fetch rooms from API with pagination
   */
  const fetchRooms = useCallback(
    async (page: number = 1, pageSize: number = 20) => {
      if (fetchingRef.current) return;

      // Check cache first
      if (
        cacheRef.current &&
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION
      ) {
        setAllRooms(cacheRef.current.data);
        setIsLoading(false);
        return;
      }

      try {
        fetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const url = `/api/rooms?page=${page}&pageSize=${pageSize}`;
        const res = await fetch(url, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch rooms: ${res.statusText}`);
        }

        const data: RoomsAPIResponse = await res.json();

        setAllRooms(data.rooms || []);
        setTotalPages(data.totalPages || 1);
        setTotalRooms(data.totalRooms || 0);

        // Update cache
        cacheRef.current = {
          data: data.rooms || [],
          timestamp: Date.now(),
        };
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Failed to load rooms";
        setError(errorMessage);
        setAllRooms([]);
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    },
    [CACHE_DURATION, setTotalPages, setTotalRooms]
  );

  // Fetch rooms on mount and when pagination changes
  useEffect(() => {
    fetchRooms(pagination.currentPage, pagination.pageSize);
  }, [fetchRooms, pagination.currentPage, pagination.pageSize]);

  /**
   * Refetch rooms (clears cache)
   */
  const refetch = useCallback(() => {
    cacheRef.current = null;
    fetchRooms(pagination.currentPage, pagination.pageSize);
  }, [fetchRooms, pagination.currentPage, pagination.pageSize]);

  /**
   * Apply client-side filtering
   */
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Search query filter (searches in title and description)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = room.title.toLowerCase().includes(query);
        const matchesDescription = room.description
          ?.toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Language filter
      if (filters.languages.length > 0) {
        if (!filters.languages.includes(room.language)) return false;
      }

      // Status filter
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(room.status)) return false;
      }

      // Privacy filter (array-based)
      if (filters.privacy.length > 0) {
        const roomPrivacy = room.isPrivate ? "Private" : "Public";
        if (!filters.privacy.includes(roomPrivacy)) return false;
      }

      // Room type filter
      if (filters.roomTypes.length > 0 && room.roomType) {
        if (!filters.roomTypes.includes(room.roomType)) return false;
      }

      return true;
    });
  }, [allRooms, filters]);

  /**
   * Apply client-side sorting
   */
  const sortedRooms = useMemo(() => {
    const sorted = [...filteredRooms];

    switch (sort.sortBy) {
      case "upcoming":
        // Sort by scheduled date (soonest first), then by created date
        sorted.sort((a, b) => {
          const aDate = a.scheduledAt || a.createdAt;
          const bDate = b.scheduledAt || b.createdAt;
          const aTime =
            typeof aDate === "string"
              ? new Date(aDate).getTime()
              : new Date(aDate.$date).getTime();
          const bTime =
            typeof bDate === "string"
              ? new Date(bDate).getTime()
              : new Date(bDate.$date).getTime();
          return aTime - bTime;
        });
        break;

      case "recent":
        // Sort by created date (newest first)
        sorted.sort((a, b) => {
          const aTime =
            typeof a.createdAt === "string"
              ? new Date(a.createdAt).getTime()
              : new Date(a.createdAt.$date).getTime();
          const bTime =
            typeof b.createdAt === "string"
              ? new Date(b.createdAt).getTime()
              : new Date(b.createdAt.$date).getTime();
          return bTime - aTime;
        });
        break;

      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "duration-asc":
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;

      case "duration-desc":
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;

      case "participants-asc":
        sorted.sort((a, b) => (a.participants || 0) - (b.participants || 0));
        break;

      case "participants-desc":
        sorted.sort((a, b) => (b.participants || 0) - (a.participants || 0));
        break;

      default:
        // Default: upcoming
        sorted.sort((a, b) => {
          const aDate = a.scheduledAt || a.createdAt;
          const bDate = b.scheduledAt || b.createdAt;
          const aTime =
            typeof aDate === "string"
              ? new Date(aDate).getTime()
              : new Date(aDate.$date).getTime();
          const bTime =
            typeof bDate === "string"
              ? new Date(bDate).getTime()
              : new Date(bDate.$date).getTime();
          return aTime - bTime;
        });
    }

    return sorted;
  }, [filteredRooms, sort.sortBy]);

  return {
    rooms: sortedRooms,
    isLoading,
    error,
    refetch,
    totalRooms: filteredRooms.length, // After filtering
    allRoomsCount: allRooms.length, // Before filtering
  };
}
