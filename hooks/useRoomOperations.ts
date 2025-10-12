"use client";

import { useToast, TOAST_MESSAGES } from "./useToast";
import { useCallback } from "react";

export interface RoomOperationsReturn {
  copyRoomLink: (roomId: string) => Promise<void>;
  leaveRoom: (onLeave?: () => void) => Promise<void>;
  deleteRoom: (roomId: string, onDelete?: () => void) => Promise<void>;
  inviteToRoom: (roomId: string, email: string) => Promise<void>;
}

/**
 * Hook for common room operations with toast notifications
 * Provides standardized feedback for room-related actions
 */
export function useRoomOperations(): RoomOperationsReturn {
  const { success, error, promise } = useToast();

  const copyRoomLink = useCallback(
    async (roomId: string) => {
      try {
        const roomUrl = `${window.location.origin}/room/${roomId}`;
        await navigator.clipboard.writeText(roomUrl);
        success(TOAST_MESSAGES.ROOM.COPIED_LINK);
      } catch {
        error("Failed to copy link to clipboard");
      }
    },
    [success, error]
  );

  const leaveRoom = useCallback(
    async (onLeave?: () => void) => {
      try {
        // Add API call here when available
        success(TOAST_MESSAGES.ROOM.LEFT);
        onLeave?.();
      } catch {
        error("Failed to leave room");
      }
    },
    [success, error]
  );

  const deleteRoom = useCallback(
    async (roomId: string, onDelete?: () => void) => {
      try {
        await promise(fetch(`/api/rooms/${roomId}`, { method: "DELETE" }), {
          loading: "Deleting room...",
          success: TOAST_MESSAGES.ROOM.DELETED,
          error: TOAST_MESSAGES.ROOM.DELETE_ERROR,
        });
        onDelete?.();
      } catch (err) {
        void err;
        // Error already handled by promise toast
      }
    },
    [promise]
  );

  const inviteToRoom = useCallback(
    async (roomId: string, email: string) => {
      try {
        await promise(
          fetch(`/api/rooms/${roomId}/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }),
          {
            loading: "Sending invitation...",
            success: TOAST_MESSAGES.ROOM.INVITE_SENT,
            error: "Failed to send invitation",
          }
        );
      } catch (err) {
        void err;
        // Error already handled by promise toast
      }
    },
    [promise]
  );

  return {
    copyRoomLink,
    leaveRoom,
    deleteRoom,
    inviteToRoom,
  };
}

export default useRoomOperations;
