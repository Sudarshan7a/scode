"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpDown, Check } from "lucide-react";
import { useExplore } from "@/contexts/ExploreContext";

type SortOption = {
  value: string;
  label: string;
  description?: string;
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: "upcoming",
    label: "Upcoming First",
    description: "Show scheduled rooms first, then live rooms",
  },
  {
    value: "recent",
    label: "Recently Created",
    description: "Newest rooms first",
  },
  {
    value: "title-asc",
    label: "Title: A → Z",
    description: "Alphabetical order",
  },
  {
    value: "title-desc",
    label: "Title: Z → A",
    description: "Reverse alphabetical order",
  },
  {
    value: "duration-asc",
    label: "Duration: Shortest First",
    description: "Quick sessions first",
  },
  {
    value: "duration-desc",
    label: "Duration: Longest First",
    description: "Extended sessions first",
  },
  {
    value: "participants-desc",
    label: "Most Participants",
    description: "Popular rooms first",
  },
  {
    value: "participants-asc",
    label: "Least Participants",
    description: "Smaller groups first",
  },
];

export default function ExploreSortBy() {
  const { sort, setSortBy } = useExplore();
  const currentSort = sort.sortBy;

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ||
    "Upcoming First";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-mysecondary/30 shadow-sm shadow-mysecondary/10 hover:border-mysecondary/50 hover:shadow-mysecondary/20 transition-all duration-200"
          aria-label={`Sort rooms by ${currentSortLabel}`}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort By
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-[340px] sm:w-[400px] sm:max-w-[400px] h-full bg-mybackground border-l border-mysecondary/20 p-6">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-myforeground text-lg font-semibold">
            Sort Rooms
          </SheetTitle>
          <SheetDescription className="text-myforeground/60 text-sm">
            Choose how to order your search results
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
          <RadioGroup
            value={currentSort}
            onValueChange={(value) => setSortBy(value as typeof currentSort)}
            className="space-y-2 py-2"
          >
            {SORT_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                  currentSort === option.value
                    ? "border-mysecondary/50 bg-mysecondary/10 shadow-sm shadow-mysecondary/20"
                    : "border-mysecondary/20 hover:border-mysecondary/30 hover:bg-mysecondary/5"
                }`}
                onClick={() => setSortBy(option.value as typeof currentSort)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`sort-${option.value}`}
                  className="border-mysecondary/40 data-[state=checked]:border-mysecondary data-[state=checked]:bg-mysecondary"
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`sort-${option.value}`}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2 text-myforeground"
                  >
                    {option.label}
                    {currentSort === option.value && (
                      <Check className="h-3.5 w-3.5 text-mysecondary flex-shrink-0" />
                    )}
                  </Label>
                  {option.description && (
                    <p className="text-xs text-myforeground/50 mt-0.5 truncate">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>

        <SheetFooter className="flex flex-row items-center justify-between gap-3 pt-6 mt-2 border-t border-mysecondary/20">
          <div className="flex-1 text-xs text-myforeground/60 truncate">
            Current:{" "}
            <span className="font-medium text-myforeground">
              {currentSortLabel}
            </span>
          </div>
          <SheetClose asChild>
            <Button
              type="button"
              size="sm"
              className="rounded-xl bg-mysecondary hover:bg-mysecondary-hover text-white shadow-md shadow-mysecondary/25 hover:shadow-lg hover:shadow-mysecondary/30 transition-all duration-200"
            >
              Apply
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
