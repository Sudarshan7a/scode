"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "./../../../../components/ui/button";
import { Calendar } from "./../../../../components/ui/calendar";
import { Input } from "./../../../../components/ui/input";
import { Label } from "./../../../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./../../../../components/ui/popover";

interface DateTimePickerProps {
  selected?: Date;
  onChangeDate?: (date: Date) => void;
  onChangeTime?: (time: string) => void;
}

export function DateTimePicker({
  selected,
  onChangeDate,
  onChangeTime,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(selected);

  React.useEffect(() => {
    setDate(selected);
  }, [selected]);

  const handleDateSelect = React.useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate);
      if (newDate) {
        onChangeDate?.(newDate);
      }
      setOpen(false);
    },
    [onChangeDate]
  );

  const handleTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeTime?.(e.target.value);
    },
    [onChangeTime]
  );

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1 ">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              id="date-picker"
              className="w-32 justify-between font-normal  border border-mysecondary/40 bg-background"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time (24-hour format)
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="bg-background border border-mysecondary appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}
