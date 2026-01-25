import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
import { useRoomStateUpdate } from "@/hooks/useRoomStateUpdate";
import { useRoomAutoEnd } from "@/hooks/useRoomAutoEnd";
import {
  isValidObjectId,
  hasAxiosResponse,
  logRequestError,
  deriveRoomState,
  deriveErrorState,
  isObject,
} from "./roomStateUtils";
import type { RoomInfo, RoomState } from "@/types/room";

export function useRoomController(roomId: string) {
  const router = useRouter();
  const { success } = useToast();
  const { updateState } = useRoomStateUpdate();

  const [roomState, setRoomState] = useState<RoomState>("loading");
  const [isStarting, setIsStarting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hasJoinedEditor, setHasJoinedEditor] = useState(false);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Auto-end room when host closes tab or navigates away
  useRoomAutoEnd({
    roomId,
    isHost,
    isLive: roomState === "live",
    enabled: true,
  });

  const handleStartRoom = useCallback(async () => {
    setIsStarting(true);
    try {
      if (!isValidObjectId(roomId)) {
        console.error("Invalid roomId format, aborting start:", roomId);
        return;
      }
      const resp = await axiosInstance.post("/api/rooms/start", { roomId });
      if (resp.data) {
        setRoomState("live");
        setHasJoinedEditor(true);
      }
    } catch (error: unknown) {
      logRequestError("Failed to start room", error);
    } finally {
      setIsStarting(false);
    }
  }, [roomId]);

  const handleJoinRoom = useCallback(async (password?: string) => {
    setIsJoining(true);
    setPasswordError("");
    try {
      if (!isValidObjectId(roomId)) {
        console.error("Invalid roomId format, aborting join:", roomId);
        return;
      }
      const resp = await axiosInstance.post("/api/rooms/join", { roomId, password });
      if (resp.data) {
        setRequiresPassword(false);
        setHasJoinedEditor(true);
      }
    } catch (error: unknown) {
      logRequestError("Failed to join room", error);
      // Check if password is required
      if (hasAxiosResponse(error) && error.response.data?.requiresPassword) {
        setRequiresPassword(true);
        setPasswordError(error.response.data?.error || "Password required for this private room");
      }
    } finally {
      setIsJoining(false);
    }
  }, [roomId]);

  const handleEndSession = useCallback(async () => {
    if (!isValidObjectId(roomId)) {
      console.error("Invalid roomId format, aborting end session:", roomId);
      return;
    }

    setIsEnding(true);
    try {
      // Use new room state API to transition to ended
      await updateState(roomId, "ended", {
        reason: "manual-host-button",
        notes: "Host manually ended the session",
      });

      // Update local state
      setRoomState("ended");
      setHasJoinedEditor(false);
      success(TOAST_MESSAGES.ROOM.ENDED);
    } catch (error: unknown) {
      if (hasAxiosResponse(error)) {
        console.error(
          "Failed to end session - server response:",
          error.response.data
        );
        if (error.response.status === 401) {
          router.push("/login");
        }
      } else {
        console.error("Failed to end session:", error);
      }
    } finally {
      setIsEnding(false);
    }
  }, [roomId, router, updateState, success]);

  const handleLeaveRoom = useCallback(async () => {
    setIsLeaving(true);
    try {
      setHasJoinedEditor(false);
      success(TOAST_MESSAGES.ROOM.LEFT);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to leave room:", error);
    } finally {
      setIsLeaving(false);
    }
  }, [router, success]);

  useEffect(() => {
    let mounted = true;
    async function checkRoom() {
      try {
        const resp = await axiosInstance.post("/api/rooms/details", { roomId });
        if (!mounted) return;
        const data = resp.data as unknown;
        if (isObject(data)) {
          const typedData = data as {
            isHost?: boolean;
            status?: string;
            scheduledAt?: string | null;
            title?: unknown;
            description?: unknown;
            endedAt?: unknown;
            room?: unknown;
            isPrivate?: boolean;
            hasPassword?: boolean;
          };
          const { nextState, nextInfo, isHost } = deriveRoomState(typedData);
          
          setIsHost(isHost);
          setRoomState(nextState);
          setRoomInfo(nextInfo);
          // Set isPrivate from room details
          setIsPrivate(!!typedData.isPrivate);
          // If user is not host and room has password protection, they'll need password
          const needsPassword = !isHost && typedData.hasPassword;
          if (needsPassword) {
            setRequiresPassword(true);
          }
          return;
        }
      } catch (err: unknown) {
        if (!mounted) return;
        const { nextState, nextInfo } = deriveErrorState(err);
        setRoomState(nextState);
        setRoomInfo(nextInfo);
      }
    }
    checkRoom();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  return {
    // state
    roomState,
    isStarting,
    isJoining,
    isEnding,
    isLeaving,
    isHost,
    hasJoinedEditor,
    roomInfo,
    isPrivate,
    requiresPassword,
    passwordError,
    // setters (limited exposure)
    setHasJoinedEditor,
    setRoomState,
    // handlers
    handleStartRoom,
    handleJoinRoom,
    handleEndSession,
    handleLeaveRoom,
  } as const;
}
