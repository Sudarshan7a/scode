import React from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomTypeSelectProps {
  setValue: UseFormSetValue<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function RoomTypeSelect({ setValue, errors }: RoomTypeSelectProps) {
  const error = errors.roomType;
  const errorMessage =
    error?.message || (typeof error === "string" ? error : "");

  return (
    <div>
      <Label htmlFor="roomType">Room Type</Label>
      <Select
        defaultValue="interview"
        onValueChange={(value: string) =>
          setValue("roomType", value as "interview" | "mock" | "pairing", {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          id="roomType"
          className="border-1 border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border-1 border-mysecondary">
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="mock">Mock</SelectItem>
          <SelectItem value="pairing">Pair Programming</SelectItem>
        </SelectContent>
      </Select>
      {errorMessage && (
        <p className="text-red-500 text-sm">{String(errorMessage)}</p>
      )}
    </div>
  );
}
