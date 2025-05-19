"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MyDatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
  selected,
  onSelect,
  className,
}) => {
  // Initialize with the selected date or current date
  const initialDate = selected || new Date();

  // State for current view (month and year)
  const [month, setMonth] = useState<number>(initialDate.getMonth());
  const [year, setYear] = useState<number>(initialDate.getFullYear());

  // State for the current date in view
  const [date, setDate] = useState<Date>(initialDate);

  // Update internal date when props change
  useEffect(() => {
    if (selected) {
      setMonth(selected.getMonth());
      setYear(selected.getFullYear());
      setDate(selected);
    }
  }, [selected]);

  // Generate month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year options (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Handle month change
  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value, 10);
    setMonth(newMonth);
    const newDate = new Date(date);
    newDate.setMonth(newMonth);
    setDate(newDate);
  };

  // Handle year change
  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10);
    setYear(newYear);
    const newDate = new Date(date);
    newDate.setFullYear(newYear);
    setDate(newDate);
  };

  // Handle date selection
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
    }
    onSelect(newDate);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-2">
        <Select value={month.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[140px] border-1 border-mysecondary">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((monthName, index) => (
              <SelectItem key={monthName} value={index.toString()}>
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[100px] border-1 border-mysecondary">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={date}
        onMonthChange={setDate}
        className="rounded-md border"
        classNames={{
          nav_button: "hidden", // Hide default navigation since we're using our own
          caption: "hidden", // Hide default caption since we're using our own selects
        }}
      />
    </div>
  );
};

export default MyDatePicker;
