"use client";

import React, { useState, useEffect } from "react";
import ExploreFilter from "./ExploreFilter";
import ExploreSortBy from "./ExploreSortBy";
import { SearchIcon } from "lucide-react";
import { useExplore } from "@/contexts/ExploreContext";

function SearchBar() {
  const { setSearchQuery } = useExplore();
  const [localSearch, setLocalSearch] = useState("");

  // Debounce search query (300ms delay)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearch, setSearchQuery]);

  return (
    <div className="flex items-center justify-around w-full mb-10 gap-4">
      <ExploreFilter />
      <div className="flex-1 max-w-md relative flex items-center">
        <input
          type="text"
          placeholder="Search rooms by title or description..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border shadow-mysecondary shadow-sm border-mysecondary rounded-3xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-mysecondary"
          aria-label="Search rooms"
          aria-describedby="search-description"
        />
        <SearchIcon
          className="size-4 shrink-0 opacity-50 absolute right-4 scale-125 hover:text-foreground pointer-events-none"
          aria-hidden="true"
        />
        <span id="search-description" className="sr-only">
          Search for rooms by typing keywords from the title or description
        </span>
      </div>
      <ExploreSortBy />
    </div>
  );
}

export default SearchBar;
