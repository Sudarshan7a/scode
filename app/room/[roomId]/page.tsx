"use client";
import LeftTools from "./LeftTools";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CollaborativeEditor from "./CollaborativeEditor";
import { use } from "react";
import { useEffect, useState } from "react";
import RoomStatusCard from "./RoomStatusCard";
import { axiosInstance } from "@/lib/axiosInstance";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Type guards for API response - moved outside component
const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  // roomState: loading | not-found | scheduled | ended | live | error
  const [roomState, setRoomState] = useState<
    "loading" | "not-found" | "scheduled" | "ended" | "live" | "error"
  >("loading");

  const [isStarting, setIsStarting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hasJoinedEditor, setHasJoinedEditor] = useState(false);

  type ScheduledInfo = { scheduledAt: string | null };
  type ErrorInfo = { message: string };
  type RoomInfo = ScheduledInfo | ErrorInfo | Record<string, unknown> | null;

  const [roomInfo, setRoomInfo] = useState<RoomInfo>(null);

  // Button handlers
  const handleStartRoom = async () => {
    setIsStarting(true);
    try {
      const resp = await axiosInstance.post("/api/rooms/start", {
        roomId,
      });

      if (resp.data) {
        // Room started successfully, update state to live and set joined flag
        setRoomState("live");
        setHasJoinedEditor(true);
      }
    } catch (error) {
      console.error("Failed to start room:", error);
      // You could show an error message here
    } finally {
      setIsStarting(false);
    }
  };

  const handleJoinRoom = async () => {
    setIsJoining(true);
    try {
      const resp = await axiosInstance.post("/api/rooms/join", {
        roomId,
      });

      if (resp.data) {
        // Successfully joined, set joined flag
        setHasJoinedEditor(true);
      }
    } catch (error) {
      console.error("Failed to join room:", error);
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
    } catch (error) {
      // If authentication failed, redirect to login
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          window.location.href = "/login";
        }
      }
      // You could show an error message here
    } finally {
      setIsEnding(false);
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
          // Set host status from API response
          const isUserHost = !!data.isHost;
          setIsHost(isUserHost);

          // Handle different room statuses based on host/participant role
          if (data.status === "scheduled") {
            setRoomState("scheduled");
            setRoomInfo({
              scheduledAt: data.scheduledAt ?? null,
              title: data.title,
              description: data.description,
            });
            return;
          }

          if (data.status === "ended") {
            setRoomState("ended");
            setRoomInfo({
              title: data.title,
              endedAt: data.endedAt,
            });
            return;
          }

          if (data.status === "live") {
            setRoomState("live");
            setRoomInfo({
              title: data.title,
              description: data.description,
              room: data.room,
            });

            // If user is host and room is live, automatically join the editor
            if (isUserHost) {
              setHasJoinedEditor(true);
            }
            return;
          }

          // Default fallback
          setRoomState("error");
          setRoomInfo({ message: "Unknown room status" });
        }
      } catch (err: unknown) {
        if (!mounted) return;

        // Handle Axios errors
        if (err && typeof err === "object" && "response" in err) {
          const axiosErr = err as {
            response: { status: number; data: unknown };
          };
          const status = axiosErr.response.status;
          const errorData = axiosErr.response.data;

          if (status === 404) {
            setRoomState("not-found");
            return;
          }

          if (status === 401) {
            setRoomState("error");
            setRoomInfo({
              message: "Unauthorized. Please sign in to view this room.",
            });
            return;
          }

          setRoomState("error");
          setRoomInfo({
            message: String(
              isObject(errorData) && errorData.error
                ? errorData.error
                : "Unknown error"
            ),
          });
        } else {
          // Network or other errors
          setRoomState("error");
          setRoomInfo({
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    checkRoom();

    return () => {
      mounted = false;
    };
  }, [roomId]);

  return (
    <div className="flex h-screen w-full justify-between">
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
        <AsyncErrorBoundary
          fallbackTitle="Editor Failed to Load"
          fallbackMessage="The collaborative editor encountered an error. Please refresh the page to continue."
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={30} defaultSize={40}>
              <AsyncErrorBoundary
                fallbackTitle="Tools Failed to Load"
                fallbackMessage="Unable to load the sidebar tools."
              >
                <LeftTools />
              </AsyncErrorBoundary>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={30} defaultSize={60}>
              <AsyncErrorBoundary
                fallbackTitle="Code Editor Failed to Load"
                fallbackMessage="The code editor encountered an error. Please refresh to continue coding."
              >
                <CollaborativeEditor
                  roomId={roomId}
                  isHost={isHost}
                  onEndSession={handleEndSession}
                  isEnding={isEnding}
                />
              </AsyncErrorBoundary>
            </ResizablePanel>
          </ResizablePanelGroup>
        </AsyncErrorBoundary>
      )}
    </div>
  );
}
