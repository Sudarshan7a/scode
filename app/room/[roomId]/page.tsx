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
interface ApiResponse extends Record<string, unknown> {
  status?: string;
  scheduledAt?: string | null;
  room?: unknown;
  error?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const hasStatus = (
  obj: Record<string, unknown>,
  status: string
): obj is ApiResponse => {
  return "status" in obj && obj.status === status;
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

  useEffect(() => {
    let mounted = true;

    async function checkRoom() {
      try {
        const resp = await axiosInstance.post("/api/rooms/join", {
          roomId,
        });

        if (!mounted) return;

        const data = resp.data as unknown;

        if (isObject(data) && hasStatus(data, "scheduled")) {
          setIsHost(!!(data.role === "host"));
          setRoomState("scheduled");
          setRoomInfo({ scheduledAt: data.scheduledAt ?? null });
          return;
        }

        if (isObject(data) && hasStatus(data, "ended")) {
          setIsHost(!!(data.role === "host"));
          setRoomState("ended");
          setRoomInfo({});
          return;
        }

        // Success response (status 200-299)
        if (isObject(data) && "room" in data) {
          setIsHost(!!(data.role === "host"));
          setRoomState("live");
          setRoomInfo((data.room as Record<string, unknown>) ?? data);
          return;
        }
        setRoomState("live");
        setRoomInfo(data as Record<string, unknown>);
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
            setRoomInfo({ message: "Unauthorized. Please sign in to join." });
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

      {/* For scheduled rooms: show status card for BOTH host and participants */}
      {roomState === "scheduled" && (
        <RoomStatusCard
          title={isHost ? "Ready to start your room" : "Room scheduled"}
          subtitle={
            isHost
              ? "Click 'Start Room' when you're ready to begin the session"
              : roomInfo && "scheduledAt" in roomInfo && roomInfo.scheduledAt
              ? new Date(String(roomInfo.scheduledAt)).toLocaleString()
              : "TBA"
          }
          details={
            isHost ? (
              <p>
                Starting the room will make it live and allow participants to join the collaborative session.
              </p>
            ) : (
              <p>
                Join the room when it starts — you&apos;ll be able to collaborate
                live.
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
          title="This room has ended"
          subtitle="The live session is over"
          details={<p>You can view saved code from the room list.</p>}
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
                Click &apos;Join Room&apos; to enter the collaborative editor and start coding with your participants.
              </p>
            ) : (
              <p>
                Join the room to start collaborating with other participants in real-time.
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
                <CollaborativeEditor roomId={roomId} />
              </AsyncErrorBoundary>
            </ResizablePanel>
          </ResizablePanelGroup>
        </AsyncErrorBoundary>
      )}
    </div>
  );
}
