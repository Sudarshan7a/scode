import React from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Calendar24 } from "../../MyDateAndTimePicker";
import { CreateRoomSchema } from "../schemas/formSchemas";

interface ScheduleFieldsProps {
  selectedDate: Date;
  setValue: UseFormSetValue<CreateRoomSchema>;
  errors: FieldErrors<CreateRoomSchema>;
}

export function ScheduleFields({
  selectedDate,
  setValue,
  errors,
}: ScheduleFieldsProps) {
  return (
    <div>
      <Label htmlFor="scheduledAt">Select Date and Time *</Label>
      <div className="mt-2 border-mysecondary">
        <Calendar24
          selected={selectedDate}
          onChangeDate={(date: Date) => {
            setValue("scheduledAt", date, { shouldValidate: true });
          }}
          onChangeTime={(time: string) => {
            setValue("time", time, { shouldValidate: true });
          }}
        />
      </div>
      {errors.scheduledAt && (
        <p className="text-red-500 text-sm">
          {errors.scheduledAt.message as string}
        </p>
      )}
      {errors.time && (
        <p className="text-red-500 text-sm">{errors.time.message as string}</p>
      )}
      <div className="mt-2">
        <Label htmlFor="duration">Duration in minutes</Label>
        <Select
          defaultValue="30"
          onValueChange={(value: string) =>
            setValue("duration", Number(value), { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="duration"
            className="border-1 border-mysecondary mt-1"
          >
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent className="border-1 border-mysecondary">
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-red-500 text-sm">
            {errors.duration.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
