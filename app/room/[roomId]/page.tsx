"use client";
import { useParams } from "next/navigation";
import { useRoomController } from "./useRoomController";
import { RoomProvider } from "@/components/room/RoomContext";
import LoadingState from "@/components/room/states/LoadingState";
import NotFoundState from "@/components/room/states/NotFoundState";
import ScheduledState from "@/components/room/states/ScheduledState";
import EndedState from "@/components/room/states/EndedState";
import ErrorState from "@/components/room/states/ErrorState";
import LivePreJoinState from "@/components/room/states/LivePreJoinState";
import LiveEditorState from "@/components/room/states/LiveEditorState";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const {
    roomState,
    isStarting,
    isJoining,
    isEnding,
    isLeaving,
    isHost,
    hasJoinedEditor,
    roomInfo,
    handleStartRoom,
    handleJoinRoom,
    handleEndSession,
    handleLeaveRoom,
  } = useRoomController(roomId);

  const contextValue = {
    roomId,
    isHost,
    roomInfo,
    isStarting,
    isJoining,
    isEnding,
    isLeaving,
    handleStartRoom,
    handleJoinRoom,
    handleEndSession,
    handleLeaveRoom,
  };

  return (
    <RoomProvider value={contextValue}>
      <div className="flex flex-col h-screen w-full">
        <LoadingState visible={roomState === "loading"} />
        <NotFoundState visible={roomState === "not-found"} />
        <ScheduledState visible={roomState === "scheduled"} />
        <EndedState visible={roomState === "ended"} />
        <ErrorState visible={roomState === "error"} />
        <LivePreJoinState visible={roomState === "live" && !hasJoinedEditor} />
        <LiveEditorState visible={roomState === "live" && hasJoinedEditor} />
      </div>
    </RoomProvider>
  );
}

