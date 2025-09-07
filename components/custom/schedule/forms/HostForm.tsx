"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { startRoomSchema, type StartRoomSchema } from "../schemas/formSchemas";
import { RoomNameInput } from "../fields/RoomNameInput";
import { DescriptionInput } from "../fields/DescriptionInput";
import { RoomTypeSelect } from "../fields/RoomTypeSelect";
import { PrivacyLevelSelect } from "../fields/PrivacyLevelSelect";
import { EditorEnabledCheckbox } from "../fields/EditorEnabledCheckbox";

interface HostFormProps {
  onSubmit: (data: StartRoomSchema) => void;
  isLoading?: boolean;
}

export function HostForm({ onSubmit, isLoading = false }: HostFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StartRoomSchema>({
    resolver: zodResolver(startRoomSchema),
    defaultValues: {
      roomName: "",
      description: "",
      roomType: "interview",
      privacyLevel: "public",
      editorEnabled: false,
      languagePreference: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RoomNameInput register={register} errors={errors} />
      <DescriptionInput register={register} />
      <RoomTypeSelect setValue={setValue} errors={errors} />
      <PrivacyLevelSelect setValue={setValue} errors={errors} />
      <EditorEnabledCheckbox register={register} />
      <Button
        type="submit"
        disabled={isLoading}
        className=" w-full py-3 bg-mysecondary hover:bg-mysecondary-hover text-white transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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
          {isLoading ? "Starting Session..." : "Start Session"}
        </div>
      </Button>
    </form>
  );
}
