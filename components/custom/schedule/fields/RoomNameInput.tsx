import React from "react";
import { UseFormRegister, FieldErrors, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

interface RoomNameInputProps<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
> {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  fieldName?: keyof TFieldValues | string; // allow schedule form to register `title` instead of `roomName`
}

export function RoomNameInput<T extends Record<string, unknown>>({
  register,
  errors,
  fieldName = "roomName",
}: RoomNameInputProps<T>) {
  const key = String(fieldName);
  const error = (errors as unknown as Record<string, unknown>)[key];
  type ErrorLike = { message?: string };
  const errorMessage =
    typeof error === "object" && error && "message" in (error as ErrorLike)
      ? (error as ErrorLike).message
      : typeof error === "string"
      ? error
      : "";

  return (
    <>
      <Label htmlFor={key}>{key === "roomName" ? "Room Name" : "Title"}</Label>
      <Input
        id={key}
        className="mt-2"
        placeholder={key === "roomName" ? "Room name...." : "Title..."}
        {...register(key as Path<T>)}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm">{String(errorMessage)}</p>
      )}
    </>
  );
}
