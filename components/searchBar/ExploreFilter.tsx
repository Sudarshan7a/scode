"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { useExplore, RoomStatus } from "@/contexts/ExploreContext";
import { ScrollArea } from "../../components/ui/scroll-area";

// Language options - matching actual supported languages from languageFileNames.ts
const LANGUAGE_OPTIONS = ["JavaScript", "Python", "Go", "Java", "C", "C++"];

// Status options - matching RoomStatus type
const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ended", label: "Ended" },
];

// Privacy options
const PRIVACY_OPTIONS = ["Public", "Private"];

// Room type options - matching actual room types from schema (interview, mock, pairing)
const ROOM_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "interview", label: "Interview" },
  { value: "mock", label: "Mock" },
  { value: "pairing", label: "Pair Programming" },
];

export default function ExploreFilter() {
  const {
    filters,
    setLanguages,
    setStatuses,
    setPrivacy,
    setRoomTypes,
    resetFilters,
    hasActiveFilters,
  } = useExplore();

  const { languages, statuses, privacy, roomTypes } = filters;

  const activeFilterCount =
    languages.length + statuses.length + privacy.length + roomTypes.length;

  const handleLanguageToggle = (language: string) => {
    const newLanguages = languages.includes(language)
      ? languages.filter((l) => l !== language)
      : [...languages, language];
    setLanguages(newLanguages);
  };

  const handleStatusToggle = (status: RoomStatus) => {
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    setStatuses(newStatuses);
  };

  const handlePrivacyToggle = (privacyOption: string) => {
    const newPrivacy = privacy.includes(privacyOption)
      ? privacy.filter((p) => p !== privacyOption)
      : [...privacy, privacyOption];
    setPrivacy(newPrivacy);
  };

  const handleRoomTypeToggle = (roomType: string) => {
    const newRoomTypes = roomTypes.includes(roomType)
      ? roomTypes.filter((rt) => rt !== roomType)
      : [...roomTypes, roomType];
    setRoomTypes(newRoomTypes);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="shadow-mysecondary border-mysecondary relative"
          aria-label={`Filter rooms${
            activeFilterCount > 0 ? `, ${activeFilterCount} filters active` : ""
          }`}
        >
          Filter
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-mysecondary text-white"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground">Filter Rooms</SheetTitle>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-sm hover:bg-mysecondary/20"
              >
                Clear all
              </Button>
            )}
          </div>
          <SheetDescription className="text-foreground">
            Select criteria to filter your room search results.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Language Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">
                Programming Language
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGE_OPTIONS.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language}`}
                      checked={languages.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                      className="border-mysecondary"
                    />
                    <label
                      htmlFor={`lang-${language}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Status</Label>
              <div className="flex flex-col space-y-2">
                {STATUS_OPTIONS.map((statusOption) => (
                  <div
                    key={statusOption.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`status-${statusOption.value}`}
                      checked={statuses.includes(statusOption.value)}
                      onCheckedChange={() =>
                        handleStatusToggle(statusOption.value)
                      }
                      className="border-mysecondary"
                    />
                    <label
                      htmlFor={`status-${statusOption.value}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {statusOption.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Privacy</Label>
              <div className="flex flex-col space-y-2">
                {PRIVACY_OPTIONS.map((privacyOption) => (
                  <div
                    key={privacyOption}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`privacy-${privacyOption}`}
                      checked={privacy.includes(privacyOption)}
                      onCheckedChange={() => handlePrivacyToggle(privacyOption)}
                      className="border-mysecondary"
                    />
                    <label
                      htmlFor={`privacy-${privacyOption}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {privacyOption}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Type Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Room Type</Label>
              <div className="flex flex-col space-y-2">
                {ROOM_TYPE_OPTIONS.map((roomTypeOption) => (
                  <div
                    key={roomTypeOption.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`type-${roomTypeOption.value}`}
                      checked={roomTypes.includes(roomTypeOption.value)}
                      onCheckedChange={() =>
                        handleRoomTypeToggle(roomTypeOption.value)
                      }
                      className="border-mysecondary"
                    />
                    <label
                      htmlFor={`type-${roomTypeOption.value}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {roomTypeOption.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex flex-row items-center justify-between gap-2 pt-4 border-t">
          <div className="flex-1 text-sm text-foreground/80">
            {activeFilterCount > 0 && (
              <span><span className="font-medium text-foreground">{activeFilterCount}</span> filter(s) applied</span>
            )}
          </div>
          <SheetClose asChild>
            <Button type="button" className="bg-mysecondary hover:bg-mysecondary/90">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
