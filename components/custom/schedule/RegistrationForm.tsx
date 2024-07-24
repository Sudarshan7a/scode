"use client";

import React from "react";
import { ScheduleDialog } from "./dialogs/ScheduleDialog";
import { HostDialog } from "./dialogs/HostDialog";
import { JoinDialog } from "./dialogs/JoinDialog";

type RegistrationFormProps = {
  formType: "schedule" | "host" | "join";
  buttonUnderlineStyle?: string;
};

export default function RegistrationForm({
  formType,
  buttonUnderlineStyle,
}: RegistrationFormProps) {
  const handleScheduleSubmit = () => {
    // TODO: Handle schedule submission with enriched data
    // Including: userId, timeZone, language, browserTime, userAgent
  };

  const handleHostSubmit = () => {
    // TODO: Handle host submission with enriched data
    // Including: userId, timeZone, language, browserTime, userAgent
  };

  const handleJoinSubmit = () => {
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
