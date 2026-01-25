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
  isLoading?: boolean;
  showPasswordField?: boolean;
  passwordError?: string;
}

export function JoinForm({
  onSubmit,
  isLoading = false,
  showPasswordField = false,
  passwordError,
}: JoinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      roomName: "",
      password: "",
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

      {/* Password field for private rooms */}
      {showPasswordField && (
        <div>
          <Label htmlFor="roomPassword">Room Password</Label>
          <Input
            id="roomPassword"
            type="password"
            placeholder="Enter room password"
            {...register("password")}
            className="mt-2"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-mysecondary hover:bg-mysecondary-hover text-white transition-all duration-200 shadow-sm hover:shadow-md font-medium"
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isLoading ? "Joining Room..." : "Join Room"}
        </div>
      </Button>
    </form>
  );
}
