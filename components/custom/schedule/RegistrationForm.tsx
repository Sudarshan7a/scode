"use client";

import React from "react";
import { ScheduleDialog } from "./dialogs/ScheduleDialog";
import { HostDialog } from "./dialogs/HostDialog";
import { JoinDialog } from "./dialogs/JoinDialog";
import type {
  CreateRoomSchema,
  StartRoomSchema,
  JoinRoomSchema,
} from "./schemas/formSchemas";
import { axiosInstance } from "@/lib/axiosInstance";

type RegistrationFormProps = {
  formType: "schedule" | "host" | "join";
  buttonUnderlineStyle?: string;
};

function getUserDeviceBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    cookieEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
  };
}

export default function RegistrationForm({
  formType,
  buttonUnderlineStyle,
}: RegistrationFormProps) {
  const handleScheduleSubmit = async (data: CreateRoomSchema) => {
    const StartRoomPayload = {
      ...data,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    const CreateRoomResult = await axiosInstance.post(
      "/api/rooms/create",
      StartRoomPayload
    );

    console.log(
      "-------- Schedule form submission result --------",
      CreateRoomResult
    );
  };

  const handleHostSubmit = async (data: StartRoomSchema) => {
    const StartRoomPayload = {
      ...data,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    const StartRoomResult = await axiosInstance.post(
      "/api/rooms/start",
      StartRoomPayload
    );

    console.log(
      "-------- Host form submission result --------",
      StartRoomResult
    );
  };
  // Including: userId, timeZone, language, browserTime, userAgent

  const handleJoinSubmit = async (data: JoinRoomSchema) => {
    const JoinRoomPayload = {
      ...data,
      joinTimestamp: new Date().toISOString(),
      deviceBrowserInfo: getUserDeviceBrowserInfo(),
    };
    const JoinRoomResult = await axiosInstance.post(
      "/api/rooms/join",
      JoinRoomPayload
    );

    console.log(
      "-------- Join form submission result --------",
      JoinRoomResult
    );
  };

  switch (formType) {
    case "schedule":
      return (
        <ScheduleDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleScheduleSubmit}
        />
      );
    case "host":
      return (
        <HostDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleHostSubmit}
        />
      );
    case "join":
      return (
        <JoinDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleJoinSubmit}
        />
      );
    default:
      return null;
  }
}
