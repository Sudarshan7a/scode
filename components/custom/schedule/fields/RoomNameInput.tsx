import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

interface RoomNameInputProps {
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  fieldName?: string; // allow schedule form to register `title` instead of `roomName`
}

export function RoomNameInput({
  register,
  errors,
  fieldName = "roomName",
}: RoomNameInputProps) {
  const error = (errors as any)[fieldName];
  const errorMessage =
    error?.message || (typeof error === "string" ? error : "");

  return (
    <>
      <Label htmlFor={fieldName}>
        {fieldName === "roomName" ? "Room Name" : "Title"}
      </Label>
      <Input
        id={fieldName}
        className="mt-2"
        placeholder={fieldName === "roomName" ? "Room name...." : "Title..."}
        {...register(fieldName)}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm">{String(errorMessage)}</p>
      )}
    </>
  );
}
