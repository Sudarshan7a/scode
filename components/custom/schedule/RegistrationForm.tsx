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
    console.log("Schedule form submitted", data);

    //TODO how do you get user id at client sides if they are in cookies
    //
    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId);
    if (userId) {
      data = { ...data, ownerId: userId };
    }
    // TODO: Handle schedule submission with enriched data
    // Including: userId, timeZone, language, browserTime, userAgent
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
