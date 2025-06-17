import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

interface RoomNameInputProps {
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function RoomNameInput({ register, errors }: RoomNameInputProps) {
  const error = errors.roomName;
  const errorMessage =
    error?.message || (typeof error === "string" ? error : "");

  return (
    <>
      <Label htmlFor="roomName">Room Name</Label>
      <Input
        className="mt-2"
        placeholder="Room name...."
        {...register("roomName")}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm">{String(errorMessage)}</p>
      )}
    </>
  );
}
