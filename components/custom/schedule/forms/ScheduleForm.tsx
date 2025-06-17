"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  scheduleFormSchema,
  type ScheduleFormValues,
} from "../schemas/formSchemas";
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
      roomName: "",
      description: "",
      date: new Date(),
      time: "10:30:00",
      duration: "30",
      roomType: "interview",
      privacyLevel: "public",
      editorEnabled: false,
      languagePreference: "",
    },
  });

  const selectedDate = watch("date");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RoomNameInput register={register} errors={errors} />
      <DescriptionInput register={register} />
      <ScheduleFields
        selectedDate={selectedDate}
        setValue={setValue}
        errors={errors}
      />
      <RoomTypeSelect setValue={setValue} errors={errors} />
      <PrivacyLevelSelect setValue={setValue} errors={errors} />
      <EditorEnabledCheckbox register={register} />
      <Button type="submit">Schedule Session</Button>
    </form>
  );
}
