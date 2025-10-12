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

interface PrivacyLevelSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

export function PrivacyLevelSelect({
  setValue,
  errors,
}: PrivacyLevelSelectProps) {
  return (
    <div>
      <Label htmlFor="privacyLevel">Room Privacy</Label>
      <Select
        defaultValue="public"
        onValueChange={(value: string) =>
          setValue("privacyLevel", value as "public" | "private", {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          id="privacyLevel"
          className="border-1 border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border-1 border-mysecondary">
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>{" "}
      {errors.privacyLevel && (
        <p className="text-red-500 text-sm">
          {String(errors.privacyLevel?.message || "")}
        </p>
      )}
    </div>
  );
}
