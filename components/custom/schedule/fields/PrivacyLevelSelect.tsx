import React from "react";
import { UseFormSetValue, FieldErrors, UseFormWatch } from "react-hook-form";
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
  watch: UseFormWatch<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

export function PrivacyLevelSelect({
  setValue,
  watch,
  errors,
}: PrivacyLevelSelectProps) {
  const currentValue = watch("privacyLevel") || "public";

  return (
    <div>
      <Label htmlFor="privacyLevel">Room Privacy</Label>
      <Select
        value={currentValue}
        onValueChange={(value: string) => {
          setValue("privacyLevel", value as "public" | "private", {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      >
        <SelectTrigger
          id="privacyLevel"
          className="border border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border border-mysecondary">
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
