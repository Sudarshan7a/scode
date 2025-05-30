import React from "react";
import Filter from "./filter";
import SortBy from "./SortBy";
import { SearchIcon } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex items-center justify-around w-full">
      <Filter />
      <div className="w-1/3 relative flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border border-mysecondary rounded-3xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-mysecondary"
        />
        <SearchIcon className="size-4 shrink-0 opacity-50 absolute right-4 scale-125 hover:text-foreground" />
      </div>
      <SortBy />
    </div>
  );
}

export default SearchBar;
