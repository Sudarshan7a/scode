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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
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
          className="border border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border border-mysecondary">
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
