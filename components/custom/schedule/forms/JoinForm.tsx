"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { joinFormSchema, type JoinFormValues } from "../schemas/formSchemas";

interface JoinFormProps {
  onSubmit: (data: JoinFormValues) => void;
}

export function JoinForm({ onSubmit }: JoinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      roomName: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="joinRoomId">Room Link or ID</Label>
        <Input
          id="joinRoomId"
          placeholder="Paste room link or enter room ID"
          {...register("roomName")}
          className="mt-2"
        />
        {errors.roomName && (
          <p className="text-red-500 text-sm">{errors.roomName.message}</p>
        )}
      </div>
      <Button type="submit">Join Room</Button>
    </form>
  );
}
