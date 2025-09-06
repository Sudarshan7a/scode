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
import { axiosInstance } from "../../../lib/axiosInstance";
import AsyncErrorBoundary from "../../../components/AsyncErrorBoundary";
import {
  ProgressIndicator,
  useProgressSteps,
} from "../../../components/ui/ProgressIndicator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

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

// Define loading steps for different operations
const scheduleSteps = [
  {
    id: "validate",
    label: "Validating form data",
    status: "pending" as const,
    description: "Checking room details and schedule",
  },
  {
    id: "create",
    label: "Creating room",
    status: "pending" as const,
    description: "Setting up collaborative environment",
  },
  {
    id: "schedule",
    label: "Scheduling session",
    status: "pending" as const,
    description: "Booking your time slot",
  },
  {
    id: "complete",
    label: "Room created successfully",
    status: "pending" as const,
    description: "Ready to share with participants",
  },
];

const hostSteps = [
  {
    id: "validate",
    label: "Validating form data",
    status: "pending" as const,
    description: "Checking room configuration",
  },
  {
    id: "create",
    label: "Creating room",
    status: "pending" as const,
    description: "Setting up collaborative environment",
  },
  {
    id: "start",
    label: "Starting session",
    status: "pending" as const,
    description: "Initializing live collaboration",
  },
  {
    id: "redirect",
    label: "Preparing editor",
    status: "pending" as const,
    description: "Loading collaborative tools",
  },
];

const joinSteps = [
  {
    id: "validate",
    label: "Validating room code",
    status: "pending" as const,
    description: "Checking room availability",
  },
  {
    id: "connect",
    label: "Connecting to room",
    status: "pending" as const,
    description: "Establishing connection",
  },
  {
    id: "join",
    label: "Joining session",
    status: "pending" as const,
    description: "Syncing with participants",
  },
  {
    id: "redirect",
    label: "Loading editor",
    status: "pending" as const,
    description: "Preparing your workspace",
  },
];

export default function RegistrationFormLoading({
  formType,
  buttonUnderlineStyle,
}: RegistrationFormProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Progress tracking
  const {
    steps: scheduleProgress,
    startStep: startScheduleStep,
    completeStep: completeScheduleStep,
    failStep: failScheduleStep,
    resetSteps: resetScheduleSteps,
  } = useProgressSteps(scheduleSteps);
  const {
    steps: hostProgress,
    startStep: startHostStep,
    completeStep: completeHostStep,
    failStep: failHostStep,
    resetSteps: resetHostSteps,
  } = useProgressSteps(hostSteps);
  const {
    steps: joinProgress,
    startStep: startJoinStep,
    completeStep: completeJoinStep,
    failStep: failJoinStep,
    resetSteps: resetJoinSteps,
  } = useProgressSteps(joinSteps);

  // Success dialog state for scheduling
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    roomId: string;
    roomTitle: string;
    scheduledAt?: string;
  } | null>(null);

  const handleScheduleSubmit = async (data: CreateRoomSchema) => {
    setIsScheduling(true);
    resetScheduleSteps();

    try {
      // Step 1: Validate
      startScheduleStep("validate");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate validation
      completeScheduleStep("validate");

      // Step 2: Create room
      startScheduleStep("create");
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
      completeScheduleStep("create");

      // Step 3: Schedule
      startScheduleStep("schedule");
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate scheduling
      completeScheduleStep("schedule");

      // Step 4: Complete
      startScheduleStep("complete");

      if (CreateRoomResult.data && CreateRoomResult.data.roomId) {
        setSuccessData({
          roomId: CreateRoomResult.data.roomId,
          roomTitle: data.title,
          scheduledAt: data.scheduledAt?.toISOString(),
        });
        completeScheduleStep("complete");

        // Show success dialog after a brief delay
        setTimeout(() => {
          setShowSuccessDialog(true);
          setIsScheduling(false);
        }, 1000);
      } else {
        failScheduleStep("complete", "No room ID returned");
        throw new Error("No room ID returned from server");
      }
    } catch (error) {
      console.error("Failed to schedule room:", error);
      const currentStep = scheduleProgress.find(
        (step) => step.status === "loading"
      );
      if (currentStep) {
        failScheduleStep(currentStep.id, "Operation failed");
      }
      setIsScheduling(false);
    }
  };

  const handleHostSubmit = async (data: StartRoomSchema) => {
    setIsHosting(true);
    resetHostSteps();

    try {
      // Step 1: Validate
      startHostStep("validate");
      await new Promise((resolve) => setTimeout(resolve, 300));
      completeHostStep("validate");

      // Step 2: Create room
      startHostStep("create");
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
      completeHostStep("create");

      // Step 3: Start session
      startHostStep("start");
      await new Promise((resolve) => setTimeout(resolve, 500));
      completeHostStep("start");

      // Step 4: Redirect
      startHostStep("redirect");

      if (StartRoomResult.data && StartRoomResult.data.roomId) {
        completeHostStep("redirect");

        // Redirect after completion
        setTimeout(() => {
          window.location.href = `/room/${StartRoomResult.data.roomId}`;
        }, 1000);
      } else {
        failHostStep("redirect", "No room ID returned");
        throw new Error("No room ID returned from server");
      }
    } catch (error) {
      console.error("Failed to start room:", error);
      const currentStep = hostProgress.find(
        (step) => step.status === "loading"
      );
      if (currentStep) {
        failHostStep(currentStep.id, "Operation failed");
      }
      setIsHosting(false);
    }
  };

  const handleJoinSubmit = async (data: JoinRoomSchema) => {
    setIsJoining(true);
    resetJoinSteps();

    try {
      // Step 1: Validate
      startJoinStep("validate");
      await new Promise((resolve) => setTimeout(resolve, 300));
      completeJoinStep("validate");

      // Step 2: Connect
      startJoinStep("connect");
      const JoinRoomPayload = {
        ...data,
        joinTimestamp: new Date().toISOString(),
        deviceBrowserInfo: getUserDeviceBrowserInfo(),
      };

      const JoinRoomResult = await axiosInstance.post(
        "/api/rooms/join",
        JoinRoomPayload
      );
      completeJoinStep("connect");

      // Step 3: Join
      startJoinStep("join");
      await new Promise((resolve) => setTimeout(resolve, 400));
      completeJoinStep("join");

      // Step 4: Redirect
      startJoinStep("redirect");

      if (JoinRoomResult.data && JoinRoomResult.data.roomId) {
        completeJoinStep("redirect");

        setTimeout(() => {
          window.location.href = `/room/${JoinRoomResult.data.roomId}`;
        }, 1000);
      } else {
        failJoinStep("redirect", "Room not found");
        throw new Error("Room not found or invalid");
      }
    } catch (error) {
      console.error("Failed to join room:", error);
      const currentStep = joinProgress.find(
        (step) => step.status === "loading"
      );
      if (currentStep) {
        failJoinStep(currentStep.id, "Operation failed");
      }
      setIsJoining(false);
    }
  };

  return (
    <AsyncErrorBoundary>
      {/* Progress Dialogs */}
      <Dialog open={isScheduling}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LoadingSpinner size="small" />
              Scheduling Your Room
            </DialogTitle>
          </DialogHeader>
          <ProgressIndicator steps={scheduleProgress} />
        </DialogContent>
      </Dialog>

      <Dialog open={isHosting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LoadingSpinner size="small" />
              Starting Your Room
            </DialogTitle>
          </DialogHeader>
          <ProgressIndicator steps={hostProgress} />
        </DialogContent>
      </Dialog>

      <Dialog open={isJoining}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LoadingSpinner size="small" />
              Joining Room
            </DialogTitle>
          </DialogHeader>
          <ProgressIndicator steps={joinProgress} />
        </DialogContent>
      </Dialog>

      {/* Form Dialogs */}
      {formType === "schedule" && (
        <ScheduleDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleScheduleSubmit}
          isLoading={isScheduling}
        />
      )}

      {formType === "host" && (
        <HostDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleHostSubmit}
          isLoading={isHosting}
        />
      )}

      {formType === "join" && (
        <JoinDialog
          buttonUnderlineStyle={buttonUnderlineStyle}
          onSubmit={handleJoinSubmit}
          isLoading={isJoining}
        />
      )}

      {/* Success Dialog */}
      {showSuccessDialog && successData && (
        <ScheduleSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          roomId={successData.roomId}
          roomTitle={successData.roomTitle}
          scheduledAt={successData.scheduledAt}
        />
      )}
    </AsyncErrorBoundary>
  );
}
