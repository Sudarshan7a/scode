"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ScheduleFormValues, scheduleFormSchema } from "../schemas/formSchemas";
import { RoomNameInput } from "../fields/RoomNameInput";
import { DescriptionInput } from "../fields/DescriptionInput";
import { ScheduleFields } from "../fields/ScheduleFields";
import { RoomTypeSelect } from "../fields/RoomTypeSelect";
import { PrivacyLevelSelect } from "../fields/PrivacyLevelSelect";
import { EditorEnabledCheckbox } from "../fields/EditorEnabledCheckbox";

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormValues) => void;
}

export function ScheduleForm({ onSubmit }: ScheduleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: "",
      // ownerId is optional in the UI; server requires an ObjectId string
      ownerId: undefined,
      isPrivate: false,
      createdAt: new Date(),
      duration: 30,
      scheduledFor: undefined,
      description: undefined,
      language: undefined,
      savedCodeId: undefined,
      collaborators: [],
      endedAt: undefined,
      roomType: "interview",
      privacyLevel: "public",
      editorEnabled: false,
      languagePreference: undefined,
      date: undefined,
      time: undefined,
    },
  });

  const selectedDate = watch("scheduledFor");

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
      <PrivacyLevelSelect setValue={setValue} errors={errors} />
      <EditorEnabledCheckbox register={register} />
      <Button type="button" onClick={handleSubmit(onSubmit)}>
        Schedule Session
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
