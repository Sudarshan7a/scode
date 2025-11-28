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
import PlusIcon from "@/components/icons/PlusIcon";
import { HostForm } from "@/components/custom/schedule/forms/HostForm";
import type { HostFormValues } from "@/components/custom/schedule/schemas/formSchemas";
import { axiosInstance } from "@/lib/axiosInstance";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";

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

function RoomJoinForm() {
  const { error, promise } = useToast();
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hostDialogOpen, setHostDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");

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

      if (StartRoomResult.data && StartRoomResult.data.roomId) {
        setHostDialogOpen(false);
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

  const handleJoinClick = async () => {
    if (!roomInput.trim()) {
      error("Please enter a room ID or link");
      return;
    }

    setIsJoining(true);
    try {
      const JoinRoomPayload = {
        roomId: roomInput.trim(),
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

      if (JoinRoomResult.data && JoinRoomResult.data.roomId) {
        window.location.href = `/room/${JoinRoomResult.data.roomId}`;
      } else {
        error("Unable to join room. Please check the room ID and try again.");
      }
    } catch (err) {
      console.error("Failed to join room:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJoinClick();
    }
  };

  return (
    <div className=" flex w-full max-w-md items-center justify-start gap-2 lg:flex-row lg:gap-4">
      {/* Host Dialog */}
      <Dialog open={hostDialogOpen} onOpenChange={setHostDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="rounded-full flex items-center gap-2 px-4 py-2"
          >
            <PlusIcon className="scale-150" />
            <p className="scale-105 font-secondary font-medium">New meeting</p>
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

      {/* Join Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Enter Room ID or Link"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isJoining}
          className="w-full py-2 px-2 pl-3 pr-20 border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          onClick={handleJoinClick}
          disabled={isJoining}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-mysecondary-hover hover:bg-mysecondary-hover/80 text-white h-8 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining ? "Joining..." : "Join"}
        </Button>
      </div>
    </div>
  );
}

export default RoomJoinForm;
