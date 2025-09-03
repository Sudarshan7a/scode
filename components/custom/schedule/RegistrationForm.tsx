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
    const CreateRoomResult = await fetch("/api/rooms/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(StartRoomPayload),
    }).then((res) => res.json());

    console.log("Schedule form submission result", CreateRoomResult);
  };

  const handleHostSubmit = async (data: StartRoomSchema) => {
    const StartRoomPayload = {
      ...data,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    const StartRoomResult = await fetch("/api/rooms/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(StartRoomPayload),
    }).then((res) => res.json());

    console.log("Host form submission result", StartRoomResult);
  };
  // Including: userId, timeZone, language, browserTime, userAgent

  const handleJoinSubmit = async (data: JoinRoomSchema) => {
    const JoinRoomPayload = {
      ...data,
      joinTimestamp: new Date().toISOString(),
      deviceBrowserInfo: getUserDeviceBrowserInfo(),
    };
    const JoinRoomResult = await fetch("/api/rooms/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JoinRoomPayload),
    }).then((res) => res.json());

    console.log("Join form submission result", JoinRoomResult);
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
