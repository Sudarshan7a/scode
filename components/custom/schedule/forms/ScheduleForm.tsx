"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { CreateRoomSchema, createRoomSchema } from "../schemas/formSchemas";
import { RoomNameInput } from "../fields/RoomNameInput";
import { DescriptionInput } from "../fields/DescriptionInput";
import { ScheduleFields } from "../fields/ScheduleFields";
import { RoomTypeSelect } from "../fields/RoomTypeSelect";
import { PrivacyLevelSelect } from "../fields/PrivacyLevelSelect";
import { EditorEnabledCheckbox } from "../fields/EditorEnabledCheckbox";

interface ScheduleFormProps {
  onSubmit: (data: CreateRoomSchema) => void;
  isLoading?: boolean;
}

export function ScheduleForm({
  onSubmit,
  isLoading = false,
}: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      title: "",
      isPrivate: false,
      roomPassword: "",
      createdAt: new Date(),
      duration: 30,
      description: undefined,
      language: undefined,
      collaborators: [],
      roomType: "interview",
      privacyLevel: "public",
      editorEnabled: false,
      // Remove default values for required fields to force user selection
      scheduledAt: undefined,
      time: undefined,
    },
  });

  const selectedDate = watch("scheduledAt");
  const privacyLevel = watch("privacyLevel");

  return (
    <form className="space-y-4">
      <RoomNameInput register={register} errors={errors} fieldName="title" />
      <DescriptionInput register={register} />
      <ScheduleFields
        selectedDate={selectedDate || new Date()}
        setValue={setValue}
        errors={errors}
      />
      <RoomTypeSelect setValue={setValue} errors={errors} />
      <PrivacyLevelSelect setValue={setValue} watch={watch} errors={errors} />

      {/* Password field for private rooms */}
      {privacyLevel === "private" && (
        <div>
          <Label htmlFor="roomPassword">Room Password</Label>
          <Input
            id="roomPassword"
            type="text"
            placeholder="Enter password for private room"
            {...register("roomPassword")}
            autoComplete="new-password"
            className="mt-2 border border-mysecondary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Participants will need this password to join
          </p>
        </div>
      )}

      <EditorEnabledCheckbox register={register} />
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
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
          {isLoading ? "Scheduling Session..." : "Schedule Session"}
        </div>
      </Button>
    </form>
  );
}

//room validation mongo db

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'title',
//       'ownerId',
//       'isPrivate',
//       'createdAt',
//       'duration'
//     ],
//     properties: {
//       title: {
//         bsonType: 'string',
//         description: 'Title of the room'
//       },
//       ownerId: {
//         bsonType: 'objectId',
//         description: 'Creator of the room'
//       },
//       collaborators: {
//         bsonType: 'array',
//         items: {
//           bsonType: 'object',
//           properties: {
//             userId: {
//               bsonType: 'objectId'
//             },
//             role: {
//               'enum': [
//                 'host',
//                 'participant'
//               ]
//             },
//             joinedAt: {
//               bsonType: 'date'
//             }
//           }
//         },
//         description: 'Optional list of collaborators'
//       },
//       isPrivate: {
//         bsonType: 'bool'
//       },
//       createdAt: {
//         bsonType: 'date'
//       },
//       duration: {
//         bsonType: [
//           'int',
//           'double'
//         ],
//         description: 'Duration of the room in minutes'
//       },
//       scheduledFor: {
//         bsonType: 'date',
//         description: 'Exact date+time when room starts'
//       },
//       description: {
//         bsonType: 'string',
//         description: 'Short description of the room/session'
//       },
//       language: {
//         bsonType: 'string'
//       },
//       savedCodeId: {
//         bsonType: 'objectId'
//       },
//       endedAt: {
//         bsonType: 'date'
//       }
//     }
//   }
// }
