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

  const [roomInfo, setRoomInfo] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkRoom() {
      try {
        const resp = await fetch("/api/rooms/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        if (!mounted) return;

        if (resp.status === 404) {
          setRoomState("not-found");
          return;
        }

        if (resp.status === 401) {
          setRoomState("error");
          setRoomInfo({ message: "Unauthorized. Please sign in to join." });
          return;
        }

        const data = await resp.json();

        if (data?.status === "scheduled") {
          setRoomState("scheduled");
          setRoomInfo({ scheduledAt: data.scheduledAt ?? null });
          return;
        }

        if (data?.status === "ended") {
          setRoomState("ended");
          setRoomInfo({});
          return;
        }

        if (resp.ok) {
          setRoomState("live");
          setRoomInfo(data.room ?? data);
          return;
        }

        setRoomState("error");
        setRoomInfo({ message: data?.error ?? "Unknown error" });
      } catch (err) {
        if (!mounted) return;
        setRoomState("error");
        setRoomInfo({
          message: err instanceof Error ? err.message : String(err),
        });
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
            roomInfo?.scheduledAt
              ? new Date(roomInfo.scheduledAt).toLocaleString()
              : "TBA"
          }
          details={
            <p>
              Join the room when it starts — you'll be able to collaborate live.
            </p>
          }
        />
      )}

      {roomState === "ended" && (
        <RoomStatusCard
          title="This room has ended"
          subtitle="The live session is over"
          details={<p>You can view saved code from the room list.</p>}
        />
      )}

      {roomState === "error" && (
        <RoomStatusCard
          title="Unable to load room"
          subtitle={roomInfo?.message ?? "Unknown error"}
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
