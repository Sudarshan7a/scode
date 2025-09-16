"use client";
import { useEffect, useState } from "react";
import RoomStatusCard from "./RoomStatusCard";
import { axiosInstance } from "@/lib/axiosInstance";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
import LiveEditorPanels from "./LiveEditorPanels";
import {
  RoomInfo,
  RoomState,
  isValidObjectId,
  hasAxiosResponse,
  logRequestError,
  deriveRoomState,
  deriveErrorState,
  isObject,
} from "./roomStateUtils";

// page component now focuses on orchestration and rendering decisions only

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const router = useRouter();
  const { success } = useToast();

  // roomState: loading | not-found | scheduled | ended | live | error
  const [roomState, setRoomState] = useState<RoomState>("loading");

  const [isStarting, setIsStarting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hasJoinedEditor, setHasJoinedEditor] = useState(false);

  const [roomInfo, setRoomInfo] = useState<RoomInfo>(null);

  // Button handlers
  const handleStartRoom = async () => {
    setIsStarting(true);
    try {
      // Basic client-side validation: Mongo ObjectId is 24 hex chars
      if (!isValidObjectId(roomId)) {
        console.error("Invalid roomId format, aborting start:", roomId);
        setIsStarting(false);
        return;
      }
      const resp = await axiosInstance.post("/api/rooms/start", {
        roomId,
      });

      if (resp.data) {
        // Room started successfully, update state to live and set joined flag
        setRoomState("live");
        setHasJoinedEditor(true);
      }
    } catch (error: unknown) {
      // Log server response body when available for easier debugging
      logRequestError("Failed to start room", error);
      // You could show an error message here
    } finally {
      setIsStarting(false);
    }
  };

  const handleJoinRoom = async () => {
    setIsJoining(true);
    try {
      if (!isValidObjectId(roomId)) {
        console.error("Invalid roomId format, aborting join:", roomId);
        setIsJoining(false);
        return;
      }
      const resp = await axiosInstance.post("/api/rooms/join", {
        roomId,
      });

      if (resp.data) {
        // Successfully joined, set joined flag
        setHasJoinedEditor(true);
      }
    } catch (error: unknown) {
      logRequestError("Failed to join room", error);
      // You could show an error message here
    } finally {
      setIsJoining(false);
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      // Attempt to end session for room

      const resp = await axiosInstance.post("/api/rooms/end", {
        roomId,
      });

      if (resp.data && resp.data.status === "success") {
        // Session ended successfully, update state to ended
        setRoomState("ended");
        setHasJoinedEditor(false);
      }
    } catch (error: unknown) {
      // If authentication failed, redirect to login. Also log server response.
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
      // You could show an error message here
    } finally {
      setIsEnding(false);
    }
  };

  const handleLeaveRoom = async () => {
    setIsLeaving(true);
    try {
      // No server route required: unmounting the editor will disconnect.
      setHasJoinedEditor(false);
      // Show confirmation toast and navigate using client routing so toast persists
      success(TOAST_MESSAGES.ROOM.LEFT);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to leave room:", error);
    } finally {
      setIsLeaving(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function checkRoom() {
      try {
        const resp = await axiosInstance.post("/api/rooms/details", {
          roomId,
        });

        if (!mounted) return;
        const data = resp.data as unknown;
        if (isObject(data)) {
          const { nextState, nextInfo, isHost } = deriveRoomState(
            data as {
              isHost?: boolean;
              status?: string;
              scheduledAt?: string | null;
              title?: unknown;
              description?: unknown;
              endedAt?: unknown;
              room?: unknown;
            }
          );
          setIsHost(isHost);
          setRoomState(nextState);
          setRoomInfo(nextInfo);
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

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Render different UIs based on room state */}
      {roomState === "loading" && (
        <RoomStatusCard
          title="Loading room"
          subtitle="Please wait while we verify the room."
          details={
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner
                size="medium"
                text="Verifying room access..."
                showText
              />
            </div>
          }
        />
      )}

      {roomState === "not-found" && (
        <RoomStatusCard
          title="404 — Room not found"
          subtitle="The room does not exist."
        />
      )}

      {/* For scheduled rooms: different behavior for host vs participants */}
      {roomState === "scheduled" && (
        <RoomStatusCard
          title={isHost ? "Ready to start your room" : "Room is scheduled"}
          subtitle={
            isHost
              ? "Click 'Start Room' when you're ready to begin the session"
              : roomInfo && "scheduledAt" in roomInfo && roomInfo.scheduledAt
              ? `Scheduled for: ${new Date(
                  String(roomInfo.scheduledAt)
                ).toLocaleString()}`
              : "Waiting for the host to start the session"
          }
          details={
            isHost ? (
              <p>
                Starting the room will make it live and allow participants to
                join the collaborative session.
              </p>
            ) : (
              <p>
                The room will become available when the host starts the session.
                You&apos;ll be able to join once it&apos;s live.
              </p>
            )
          }
          roomState="scheduled"
          isHost={isHost}
          onStart={handleStartRoom}
          onJoin={handleJoinRoom}
          isStarting={isStarting}
          isJoining={isJoining}
          roomId={roomId}
        />
      )}

      {roomState === "ended" && (
        <RoomStatusCard
          title={isHost ? "Your room has ended" : "This room has ended"}
          subtitle="The live session is over"
          details={
            isHost ? (
              <p>
                Your coding session has concluded. You can create a new room to
                start another session.
              </p>
            ) : (
              <p>
                The collaborative session has ended. Thank you for
                participating!
              </p>
            )
          }
          roomState="ended"
          isHost={isHost}
          onStart={handleStartRoom}
          onJoin={handleJoinRoom}
          isStarting={isStarting}
          isJoining={isJoining}
        />
      )}

      {roomState === "error" && (
        <RoomStatusCard
          title="Unable to load room"
          subtitle={String(
            roomInfo && "message" in roomInfo
              ? roomInfo.message
              : "Unknown error"
          )}
        />
      )}

      {/* For live rooms: show status card until user explicitly joins */}
      {roomState === "live" && !hasJoinedEditor && (
        <RoomStatusCard
          title="Room is live!"
          subtitle={
            isHost
              ? "Your room is now active and ready for collaboration"
              : "The host has started the room - you can now join"
          }
          details={
            isHost ? (
              <p>
                Click &apos;Join Room&apos; to enter the collaborative editor
                and start coding with your participants.
              </p>
            ) : (
              <p>
                Join the room to start collaborating with other participants in
                real-time.
              </p>
            )
          }
          roomState="live"
          isHost={isHost}
          onStart={handleStartRoom}
          onJoin={handleJoinRoom}
          isStarting={isStarting}
          isJoining={isJoining}
          roomId={roomId}
        />
      )}

      {/* Show collaborative editor ONLY for live rooms where user has joined */}
      {roomState === "live" && hasJoinedEditor && (
        <div className="flex-1 min-h-0">
          <LiveEditorPanels
            roomId={roomId}
            isHost={isHost}
            onEndSession={handleEndSession}
            isEnding={isEnding}
            onLeaveRoom={handleLeaveRoom}
            isLeaving={isLeaving}
          />
        </div>
      )}
    </div>
  );
}
