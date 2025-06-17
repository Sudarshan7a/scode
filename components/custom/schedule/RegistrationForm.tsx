"use client";

import React from "react";
import { ScheduleDialog } from "./dialogs/ScheduleDialog";
import { HostDialog } from "./dialogs/HostDialog";
import { JoinDialog } from "./dialogs/JoinDialog";
import {
  ScheduleFormValues,
  HostFormValues,
  JoinFormValues,
} from "./schemas/formSchemas";

type RegistrationFormProps = {
  formType: "schedule" | "host" | "join";
  buttonUnderlineStyle?: string;
};

export default function RegistrationForm({
  formType,
  buttonUnderlineStyle,
}: RegistrationFormProps) {
  const handleScheduleSubmit = (data: ScheduleFormValues) => {
    const enrichedData = {
      ...data,
      userId: null,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    console.log("Schedule submitted:", enrichedData);
  };

  const handleHostSubmit = (data: HostFormValues) => {
    const enrichedData = {
      ...data,
      userId: null,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    console.log("Host submitted:", enrichedData);
  };

  const handleJoinSubmit = (data: JoinFormValues) => {
    const joinData = {
      ...data,
      joinTimestamp: new Date().toISOString(),
      userId: null,
      ipAddressRegion: null,
      deviceBrowserInfo: navigator.userAgent,
    };
    console.log("Join submitted:", joinData);
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
