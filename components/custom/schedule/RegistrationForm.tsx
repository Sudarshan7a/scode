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
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";

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
  const { error, promise } = useToast();
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
      // DEBUG: Log form data
      console.log("[DEBUG] ScheduleForm data:", JSON.stringify(data, null, 2));

      const StartRoomPayload = {
        ...data,
        // Map privacyLevel to isPrivate for API
        isPrivate: data.privacyLevel === "private",
        // Include roomPassword for private rooms
        roomPassword:
          data.privacyLevel === "private" ? data.roomPassword : null,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      // DEBUG: Log payload being sent to API
      console.log(
        "[DEBUG] ScheduleRoomPayload:",
        JSON.stringify(StartRoomPayload, null, 2)
      );

      const CreateRoomResult = await promise(
        axiosInstance.post("/api/rooms/create", StartRoomPayload),
        {
          loading: "Scheduling your room...",
          success: TOAST_MESSAGES.ROOM.SCHEDULED,
          error: TOAST_MESSAGES.ROOM.SCHEDULE_ERROR,
        }
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
        error(
          "Room scheduled but no room ID was returned. Please check your dashboard."
        );
      }
    } catch (err) {
      // Promise toast will handle the error message
      console.error("Failed to schedule room:", err);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleHostSubmit = async (data: StartRoomSchema) => {
    setIsHosting(true);
    try {
      // DEBUG: Log form data
      console.log("[DEBUG] HostForm data:", JSON.stringify(data, null, 2));

      const StartRoomPayload = {
        ...data,
        // Map privacyLevel to isPrivate for API
        isPrivate: data.privacyLevel === "private",
        // Include roomPassword for private rooms
        roomPassword:
          data.privacyLevel === "private" ? data.roomPassword : null,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      // DEBUG: Log payload being sent to API
      console.log(
        "[DEBUG] StartRoomPayload:",
        JSON.stringify(StartRoomPayload, null, 2)
      );

      const StartRoomResult = await promise(
        axiosInstance.post("/api/rooms/start", StartRoomPayload),
        {
          loading: "Creating your room...",
          success: TOAST_MESSAGES.ROOM.CREATED,
          error: TOAST_MESSAGES.ROOM.CREATE_ERROR,
        }
      );

      // Handle success - redirect to the room
      if (StartRoomResult.data && StartRoomResult.data.roomId) {
        window.location.href = `/room/${StartRoomResult.data.roomId}`;
      } else {
        error(
          "Room created but no room ID was returned. Please check your dashboard."
        );
      }
    } catch (err) {
      // Promise toast will handle the error message
      console.error("Failed to start room:", err);
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

      const JoinRoomResult = await promise(
        axiosInstance.post("/api/rooms/join", JoinRoomPayload),
        {
          loading: "Joining room...",
          success: TOAST_MESSAGES.ROOM.JOINED,
          error: TOAST_MESSAGES.ROOM.JOIN_ERROR,
        }
      );

      // Handle success - redirect to the room
      if (JoinRoomResult.data && JoinRoomResult.data.roomId) {
        window.location.href = `/room/${JoinRoomResult.data.roomId}`;
      } else {
        error("Unable to join room. Please check the room ID and try again.");
      }
    } catch (err) {
      // Promise toast will handle the error message
      console.error("Failed to join room:", err);
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
