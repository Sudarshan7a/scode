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
import { HostForm } from "@/components/custom/schedule/forms/HostForm";
import { HostFormValues } from "@/components/custom/schedule/schemas/formSchemas";
import { axiosInstance } from "@/lib/axiosInstance";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
import VideoIcon from "@/components/icons/VideoIcon";

/**
 * DashboardHostButton Component
 *
 * Dashboard-specific button for hosting a new meeting.
 * Includes the dialog and form logic, styled for dashboard use.
 */
export default function DashboardHostButton() {
  const { error, promise } = useToast();
  const [isHosting, setIsHosting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleHostSubmit = async (data: HostFormValues) => {
    setIsHosting(true);
    try {
      const StartRoomPayload = {
        ...data,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

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
        setOpen(false);
        window.location.href = `/room/${StartRoomResult.data.roomId}`;
      } else {
        error(
          "Room created but no room ID was returned. Please check your dashboard."
        );
      }
    } catch (err) {
      console.error("Failed to start room:", err);
    } finally {
      setIsHosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="w-full h-auto py-6 px-6 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
              <VideoIcon className="w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">New Meeting</span>
          </div>
          <p className="text-sm text-blue-100 font-normal">
            Start an instant meeting
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto overflow-x-hidden border-0 p-0 bg-black/20 backdrop-blur-md shadow-none [&>[data-slot=dialog-close]]:bg-white/90 [&>[data-slot=dialog-close]]:backdrop-blur-md [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-white/30 [&>[data-slot=dialog-close]]:shadow-lg [&>[data-slot=dialog-close]_svg]:size-4">
        <div className="relative w-full">
          <div className="relative rounded-2xl bg-white/95 dark:bg-[#0f0f10]/95 border border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-lg overflow-hidden">
            <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  Host a Session
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Fill in the details below to host a session immediately.
                </DialogDescription>
              </DialogHeader>
              <HostForm onSubmit={handleHostSubmit} isLoading={isHosting} />
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
