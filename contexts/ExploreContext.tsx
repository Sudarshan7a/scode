"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Explore Page State Management Context
 * 
 * Manages all filter, search, and sort state for the Explore Pages.
 * Provides a centralized state management solution to coordinate between
 * SearchBar, Filter, SortBy components and the main Explore page.
 */

// Type Definitions
export type RoomStatus = "live" | "scheduled" | "ended" | "saved";
export type PrivacyFilter = "all" | "public" | "private";
export type SortOption = 
  | "upcoming" 
  | "recent" 
  | "title-asc" 
  | "title-desc" 
  | "duration-asc" 
  | "duration-desc"
  | "participants-asc"
  | "participants-desc";

export interface ExploreFilters {
  searchQuery: string;
  languages: string[];
  statuses: RoomStatus[];
  privacy: PrivacyFilter;
  roomTypes: string[];
}

export interface ExploreSort {
  sortBy: SortOption;
}

export interface ExplorePagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRooms: number;
}

interface ExploreContextType {
  // State
  filters: ExploreFilters;
  sort: ExploreSort;
  pagination: ExplorePagination;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setLanguages: (languages: string[]) => void;
  setStatuses: (statuses: RoomStatus[]) => void;
  setPrivacy: (privacy: PrivacyFilter) => void;
  setRoomTypes: (types: string[]) => void;
  setSortBy: (sortBy: SortOption) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalPages: (total: number) => void;
  setTotalRooms: (total: number) => void;
  
  // Utility
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

// Default state values
const defaultFilters: ExploreFilters = {
  searchQuery: "",
  languages: [],
  statuses: [],
  privacy: "all",
  roomTypes: [],
};

const defaultSort: ExploreSort = {
  sortBy: "upcoming",
};

const defaultPagination: ExplorePagination = {
  currentPage: 1,
  pageSize: 20,
  totalPages: 1,
  totalRooms: 0,
};

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ExploreFilters>(defaultFilters);
  const [sort, setSort] = useState<ExploreSort>(defaultSort);
  const [pagination, setPagination] = useState<ExplorePagination>(defaultPagination);

  // Filter Actions
  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const setLanguages = useCallback((languages: string[]) => {
    setFilters(prev => ({ ...prev, languages }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const setStatuses = useCallback((statuses: RoomStatus[]) => {
    setFilters(prev => ({ ...prev, statuses }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const setPrivacy = useCallback((privacy: PrivacyFilter) => {
    setFilters(prev => ({ ...prev, privacy }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const setRoomTypes = useCallback((roomTypes: string[]) => {
    setFilters(prev => ({ ...prev, roomTypes }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Sort Actions
  const setSortBy = useCallback((sortBy: SortOption) => {
    setSort({ sortBy });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Pagination Actions
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, []);

  const setTotalPages = useCallback((total: number) => {
    setPagination(prev => ({ ...prev, totalPages: total }));
  }, []);

  const setTotalRooms = useCallback((total: number) => {
    setPagination(prev => ({ ...prev, totalRooms: total }));
  }, []);

  // Utility Actions
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSort(defaultSort);
    setPagination(defaultPagination);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.searchQuery !== "" ||
      filters.languages.length > 0 ||
      filters.statuses.length > 0 ||
      filters.privacy !== "all" ||
      filters.roomTypes.length > 0 ||
      sort.sortBy !== "upcoming"
    );
  }, [filters, sort]);

  const value: ExploreContextType = {
    filters,
    sort,
    pagination,
    setSearchQuery,
    setLanguages,
    setStatuses,
    setPrivacy,
    setRoomTypes,
    setSortBy,
    setPage,
    setPageSize,
    setTotalPages,
    setTotalRooms,
    resetFilters,
    hasActiveFilters,
  };

  return (
    <ExploreContext.Provider value={value}>
      {children}
    </ExploreContext.Provider>
  );
}

/**
 * Hook to access Explore context
 * @throws Error if used outside of ExploreProvider
 */
export function useExplore() {
  const context = useContext(ExploreContext);
  if (context === undefined) {
    throw new Error("useExplore must be used within an ExploreProvider");
  }
  return context;
}
