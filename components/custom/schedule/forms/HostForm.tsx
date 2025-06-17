"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { hostFormSchema, type HostFormValues } from "../schemas/formSchemas";
import { RoomNameInput } from "../fields/RoomNameInput";
import { DescriptionInput } from "../fields/DescriptionInput";
import { RoomTypeSelect } from "../fields/RoomTypeSelect";
import { PrivacyLevelSelect } from "../fields/PrivacyLevelSelect";
import { EditorEnabledCheckbox } from "../fields/EditorEnabledCheckbox";

interface HostFormProps {
  onSubmit: (data: HostFormValues) => void;
}

export function HostForm({ onSubmit }: HostFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HostFormValues>({
    resolver: zodResolver(hostFormSchema),
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
      <Button type="submit">Start Session</Button>
    </form>
  );
}
