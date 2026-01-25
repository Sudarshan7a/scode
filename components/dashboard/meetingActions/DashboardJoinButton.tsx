"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JoinForm } from "@/components/custom/schedule/forms/JoinForm";
import { JoinFormValues } from "@/components/custom/schedule/schemas/formSchemas";
import { axiosInstance } from "@/lib/axiosInstance";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
import styles from "@/components/custom/schedule/MyScheduleModal.module.css";
import JoinIcon from "@/components/icons/JoinIcon";

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

/**
 * DashboardJoinButton Component
 *
 * Dashboard-specific button for joining an existing meeting.
 * Includes the dialog and form logic, styled for dashboard use.
 */
export default function DashboardJoinButton() {
  const { error, promise } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleJoinSubmit = async (data: JoinFormValues) => {
    setIsJoining(true);
    setPasswordError(undefined);
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
        },
      );

      // Handle success - redirect to the room
      if (JoinRoomResult.data && JoinRoomResult.data.roomId) {
        setOpen(false);
        setShowPasswordField(false);
        window.location.href = `/room/${JoinRoomResult.data.roomId}`;
      } else {
        error("Unable to join room. Please check the room ID and try again.");
      }
    } catch (err: unknown) {
      console.error("Failed to join room:", err);
      // Check if password is required
      const axiosError = err as {
        response?: { data?: { requiresPassword?: boolean; error?: string } };
      };
      if (axiosError.response?.data?.requiresPassword) {
        setShowPasswordField(true);
        setPasswordError(
          axiosError.response?.data?.error ||
            "Password required for this private room",
        );
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-auto py-6 px-6 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900 dark:hover:to-purple-800 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600 text-purple-700 dark:text-purple-300 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg group-hover:bg-purple-300 dark:group-hover:bg-purple-700 transition-colors">
              <JoinIcon className="w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">Join Meeting</span>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-normal">
            Enter a room code or link
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`min-w-[40%] max-h-[70vh] overflow-y-auto ${styles.noScrollbar} border-0 p-0 bg-black/20 backdrop-blur-md shadow-none [&>[data-slot=dialog-close]]:bg-white/90 [&>[data-slot=dialog-close]]:backdrop-blur-md [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/30 [&>[data-slot=dialog-close]]:shadow-lg [&>[data-slot=dialog-close]_svg]:size-4`}
      >
        <div className="relative w-full">
          <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 bg-gradient-to-r from-mysecondary to-[#3c8de3]" />

          <div className="relative rounded-2xl bg-white/95 dark:bg-[#0f0f10]/95 border border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-lg overflow-hidden">
            <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  Join a Session
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Enter the room link or ID to join an existing session.
                </DialogDescription>
              </DialogHeader>
              <JoinForm
                onSubmit={handleJoinSubmit}
                isLoading={isJoining}
                showPasswordField={showPasswordField}
                passwordError={passwordError}
              />
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
