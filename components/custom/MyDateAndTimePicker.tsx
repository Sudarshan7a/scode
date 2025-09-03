"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Root as Popover,
  Trigger as PopoverTrigger,
  Content as PopoverContent,
} from "@radix-ui/react-popover";
// import { on } from "events";

interface MyDateAndTimePickerProps {
  selected?: Date;
  onChangeDate?: (date: Date) => void;
  onChangeTime?: (time: string) => void; // Uncomment if you want to handle time changes
}

export function Calendar24({
  selected,
  onChangeDate,
  onChangeTime,
}: MyDateAndTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // selected={selectedDate}
  // onSelect={(date) => {
  //   if (date) {
  //     setValue("date", date, { shouldValidate: true });
  //   }
  // }}

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1 ">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="" asChild>
            <Button
              // variant="outline"
              id="date"
              className="w-32 justify-between bg-background font-normal border-1 border-mysecondary"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              className="bg-background border-1 border-mysecondary mt-2 rounded-md"
              mode="single"
              selected={selected}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);

                if (date) {
                  onChangeDate?.(date);
                }
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time" className="px-1">
          Time in 24 hour formate
        </Label>
        <Input
          type="time"
          id="time"
          step="1"
          defaultValue="10:30:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={(e) => {
            if (onChangeTime) {
              onChangeTime(e.target.value as string);
            }
          }}
        />
      </div>
    </div>
  );
}
