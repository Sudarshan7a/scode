"use client";

import React, { useState } from "react";
import { ScheduleDialog } from "./dialogs/ScheduleDialog";
import { HostDialog } from "./dialogs/HostDialog";
import { JoinDialog } from "./dialogs/JoinDialog";
import { ScheduleSuccessDialog } from "./dialogs/ScheduleSuccessDialog";
import type {
  CreateRoomSchema,
  StartRoomSchema,
  JoinRoomSchema,
} from "./schemas/formSchemas";
import { axiosInstance } from "@/lib/axiosInstance";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";

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
  const [isScheduling, setIsScheduling] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Success dialog state for scheduling
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    roomId: string;
    roomTitle: string;
    scheduledAt?: string;
  } | null>(null);

  const handleScheduleSubmit = async (data: CreateRoomSchema) => {
    setIsScheduling(true);
    try {
      const StartRoomPayload = {
        ...data,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      console.log("Submitting schedule payload:", StartRoomPayload);

      const CreateRoomResult = await axiosInstance.post(
        "/api/rooms/create",
        StartRoomPayload
      );

      console.log(
        "-------- Schedule form submission result --------",
        CreateRoomResult
      );

      // Handle success - show success dialog instead of redirecting
      if (CreateRoomResult.data && CreateRoomResult.data.roomId) {
        setSuccessData({
          roomId: CreateRoomResult.data.roomId,
          roomTitle: data.title,
          scheduledAt: data.scheduledAt?.toISOString(),
        });
        setShowSuccessDialog(true);
      } else {
        console.warn(
          "No roomId returned from schedule API",
          CreateRoomResult.data
        );
      }
    } catch (error) {
      console.error("Failed to schedule room:", error);
      // Handle error - maybe show toast or error message
    } finally {
      setIsScheduling(false);
    }
  };

  const handleHostSubmit = async (data: StartRoomSchema) => {
    setIsHosting(true);
    try {
      const StartRoomPayload = {
        ...data,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      console.log("Submitting host payload:", StartRoomPayload);

      const StartRoomResult = await axiosInstance.post(
        "/api/rooms/start",
        StartRoomPayload
      );

      console.log(
        "-------- Host form submission result --------",
        StartRoomResult
      );

      // Handle success - redirect to the room
      if (StartRoomResult.data && StartRoomResult.data.roomId) {
        console.log("Redirecting to room:", StartRoomResult.data.roomId);
        window.location.href = `/room/${StartRoomResult.data.roomId}`;
      } else {
        console.warn("No roomId returned from start API", StartRoomResult.data);
      }
    } catch (error) {
      console.error("Failed to start room:", error);
      // Handle error - maybe show toast or error message
    } finally {
      setIsHosting(false);
    }
  };
  // Including: userId, timeZone, language, browserTime, userAgent

  const handleJoinSubmit = async (data: JoinRoomSchema) => {
    setIsJoining(true);
    try {
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

      // Handle success - redirect to the room
      if (JoinRoomResult.data && JoinRoomResult.data.roomId) {
        window.location.href = `/room/${JoinRoomResult.data.roomId}`;
      } else {
        console.warn("No roomId returned from join API", JoinRoomResult.data);
      }
    } catch (error) {
      console.error("Failed to join room:", error);
      // Handle error - maybe show toast or error message
    } finally {
      setIsJoining(false);
    }
  };

  switch (formType) {
    case "schedule":
      return (
        <AsyncErrorBoundary
          fallbackTitle="Schedule Form Error"
          fallbackMessage="Unable to load the scheduling form. Please refresh and try again."
        >
          <ScheduleDialog
            buttonUnderlineStyle={buttonUnderlineStyle}
            onSubmit={handleScheduleSubmit}
            isLoading={isScheduling}
          />
          {successData && (
            <ScheduleSuccessDialog
              isOpen={showSuccessDialog}
              onClose={() => {
                setShowSuccessDialog(false);
                setSuccessData(null);
              }}
              roomId={successData.roomId}
              roomTitle={successData.roomTitle}
              scheduledAt={successData.scheduledAt}
            />
          )}
        </AsyncErrorBoundary>
      );
    case "host":
      return (
        <AsyncErrorBoundary
          fallbackTitle="Host Form Error"
          fallbackMessage="Unable to load the host form. Please refresh and try again."
        >
          <HostDialog
            buttonUnderlineStyle={buttonUnderlineStyle}
            onSubmit={handleHostSubmit}
            isLoading={isHosting}
          />
        </AsyncErrorBoundary>
      );
    case "join":
      return (
        <AsyncErrorBoundary
          fallbackTitle="Join Form Error"
          fallbackMessage="Unable to load the join form. Please refresh and try again."
        >
          <JoinDialog
            buttonUnderlineStyle={buttonUnderlineStyle}
            onSubmit={handleJoinSubmit}
            isLoading={isJoining}
          />
        </AsyncErrorBoundary>
      );
    default:
      return null;
  }
}
