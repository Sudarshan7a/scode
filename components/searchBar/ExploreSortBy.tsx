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
          className="shadow-mysecondary border-mysecondary"
          aria-label={`Sort rooms by ${currentSortLabel}`}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort By
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-start w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-foreground">Sort Rooms</SheetTitle>
          <SheetDescription className="text-foreground">
            Choose how to order your room search results.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6">
          <RadioGroup
            value={currentSort}
            onValueChange={(value) => setSortBy(value as typeof currentSort)}
            className="space-y-4"
          >
            {SORT_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSortBy(option.value as typeof currentSort)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`sort-${option.value}`}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={`sort-${option.value}`}
                    className="text-base font-medium cursor-pointer flex items-center"
                  >
                    {option.label}
                    {currentSort === option.value && (
                      <Check className="ml-2 h-4 w-4 text-mysecondary" />
                    )}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <SheetFooter className="flex flex-row items-center justify-between gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Currently: <span className="font-medium">{currentSortLabel}</span>
          </div>
          <SheetClose asChild>
            <Button type="button">Apply Sort</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
