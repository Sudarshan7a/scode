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

  type ScheduledInfo = { scheduledAt: string | null };
  type ErrorInfo = { message: string };
  type RoomInfo = ScheduledInfo | ErrorInfo | Record<string, unknown> | null;

  // Type guards for API response
  interface ApiResponse extends Record<string, unknown> {
    status?: string;
    scheduledAt?: string | null;
    room?: unknown;
    error?: string;
  }

  const [roomInfo, setRoomInfo] = useState<RoomInfo>(null);

  // Type guards for API response - moved outside useEffect
  const isObject = (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === "object";
  };

  const hasStatus = (
    obj: Record<string, unknown>,
    status: string
  ): obj is ApiResponse => {
    return "status" in obj && obj.status === status;
  };

  // Button handlers
  const handleStartRoom = async () => {
    setIsStarting(true);
    try {
      const resp = await axiosInstance.post("/api/rooms/start", {
        roomId,
      });

      if (resp.data) {
        // Room started successfully, refresh the room state
        window.location.reload();
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
        // Successfully joined, refresh the room state
        window.location.reload();
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
        />
      )}

      {roomState === "not-found" && (
        <RoomStatusCard
          title="404 — Room not found"
          subtitle="The room does not exist."
        />
      )}

      {roomState === "scheduled" && (
        <RoomStatusCard
          title="Room scheduled"
          subtitle={
            roomInfo && "scheduledAt" in roomInfo && roomInfo.scheduledAt
              ? new Date(String(roomInfo.scheduledAt)).toLocaleString()
              : "TBA"
          }
          details={
            <p>
              Join the room when it starts — you&apos;ll be able to collaborate
              live.
            </p>
          }
          roomState="scheduled"
          isHost={isHost}
          onStart={handleStartRoom}
          onJoin={handleJoinRoom}
          isStarting={isStarting}
          isJoining={isJoining}
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

      {roomState === "live" && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={30} defaultSize={40}>
            <LeftTools />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30} defaultSize={60}>
            <CollaborativeEditor roomId={roomId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
