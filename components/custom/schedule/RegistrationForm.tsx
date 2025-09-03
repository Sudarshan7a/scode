"use client";

import React from "react";
import { ScheduleDialog } from "./dialogs/ScheduleDialog";
import { HostDialog } from "./dialogs/HostDialog";
import { JoinDialog } from "./dialogs/JoinDialog";
import type {
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
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      browserTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
  };

  const handleHostSubmit = (data: HostFormValues) => {
    console.log("Host form submitted", data);
    // TODO: Handle host submission with enriched data
    // Including: userId, timeZone, language, browserTime, userAgent
  };

  const handleJoinSubmit = (data: JoinFormValues) => {
    console.log("Join form submitted", data);
    // TODO: Handle join submission with enriched data
    // Including: joinTimestamp, userId, ipAddressRegion, deviceBrowserInfo
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
