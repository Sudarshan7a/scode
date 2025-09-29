"use client";
import RoomStatusCard from "./RoomStatusCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useParams } from "next/navigation";
import LiveEditorPanels from "./LiveEditorPanels";
import { useRoomController } from "./useRoomController";
import type { RoomInfo } from "@/types/room";

// RoomPage orchestrates top-level room states and delegates UI to small components.
// Controller hook encapsulates networking, role, and transitions.

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

  return (
    <div className="flex flex-col h-screen w-full">
      <LoadingState visible={roomState === "loading"} />
      <NotFoundState visible={roomState === "not-found"} />
      <ScheduledState
        visible={roomState === "scheduled"}
        isHost={isHost}
        roomInfo={roomInfo}
        roomId={roomId}
        isStarting={isStarting}
        isJoining={isJoining}
        onStart={handleStartRoom}
        onJoin={handleJoinRoom}
      />
      <EndedState
        visible={roomState === "ended"}
        isHost={isHost}
        isStarting={isStarting}
        isJoining={isJoining}
        onStart={handleStartRoom}
        onJoin={handleJoinRoom}
      />
      <ErrorState visible={roomState === "error"} roomInfo={roomInfo} />
      <LivePreJoinState
        visible={roomState === "live" && !hasJoinedEditor}
        isHost={isHost}
        isStarting={isStarting}
        isJoining={isJoining}
        onStart={handleStartRoom}
        onJoin={handleJoinRoom}
        roomId={roomId}
      />
      <LiveEditorState
        visible={roomState === "live" && hasJoinedEditor}
        roomId={roomId}
        isHost={isHost}
        onEndSession={handleEndSession}
        isEnding={isEnding}
        onLeaveRoom={handleLeaveRoom}
        isLeaving={isLeaving}
      />
    </div>
  );
}

// --- Small presentation components (pure) ---
type VisibleProps = { visible: boolean };

function LoadingState({ visible }: VisibleProps) {
  if (!visible) return null;
  return (
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
  );
}

function NotFoundState({ visible }: VisibleProps) {
  if (!visible) return null;
  return (
    <RoomStatusCard
      title="404 — Room not found"
      subtitle="The room does not exist."
    />
  );
}

interface ScheduledStateProps extends VisibleProps {
  isHost: boolean;
  roomInfo: RoomInfo; // lightweight metadata for scheduled banner
  roomId: string;
  isStarting: boolean;
  isJoining: boolean;
  onStart: () => void;
  onJoin: () => void;
}
function ScheduledState({
  visible,
  isHost,
  roomInfo,
  roomId,
  isStarting,
  isJoining,
  onStart,
  onJoin,
}: ScheduledStateProps) {
  if (!visible) return null;
  const subtitle = isHost
    ? "Click 'Start Room' when you're ready to begin the session"
    : roomInfo && typeof roomInfo === "object" && "scheduledAt" in roomInfo && roomInfo.scheduledAt
    ? `Scheduled for: ${new Date(
        String(roomInfo.scheduledAt)
      ).toLocaleString()}`
    : "Waiting for the host to start the session";
  const details = isHost ? (
    <p>
      Starting the room will make it live and allow participants to join the
      collaborative session.
    </p>
  ) : (
    <p>
      The room will become available when the host starts the session.
      You&apos;ll be able to join once it&apos;s live.
    </p>
  );
  return (
    <RoomStatusCard
      title={isHost ? "Ready to start your room" : "Room is scheduled"}
      subtitle={subtitle}
      details={details}
      roomState="scheduled"
      isHost={isHost}
      onStart={onStart}
      onJoin={onJoin}
      isStarting={isStarting}
      isJoining={isJoining}
      roomId={roomId}
    />
  );
}

interface EndedStateProps extends VisibleProps {
  isHost: boolean;
  isStarting: boolean;
  isJoining: boolean;
  onStart: () => void;
  onJoin: () => void;
}
function EndedState({
  visible,
  isHost,
  isStarting,
  isJoining,
  onStart,
  onJoin,
}: EndedStateProps) {
  if (!visible) return null;
  const details = isHost ? (
    <p>
      Your coding session has concluded. You can create a new room to start
      another session.
    </p>
  ) : (
    <p>The collaborative session has ended. Thank you for participating!</p>
  );
  return (
    <RoomStatusCard
      title={isHost ? "Your room has ended" : "This room has ended"}
      subtitle="The live session is over"
      details={details}
      roomState="ended"
      isHost={isHost}
      onStart={onStart}
      onJoin={onJoin}
      isStarting={isStarting}
      isJoining={isJoining}
    />
  );
}

interface ErrorStateProps extends VisibleProps {
  roomInfo: RoomInfo;
}
function ErrorState({ visible, roomInfo }: ErrorStateProps) {
  if (!visible) return null;
  const subtitle = String(
    roomInfo && typeof roomInfo === "object" && "message" in roomInfo ? roomInfo.message : "Unknown error"
  );
  return <RoomStatusCard title="Unable to load room" subtitle={subtitle} />;
}

interface LivePreJoinStateProps extends VisibleProps {
  isHost: boolean;
  isStarting: boolean;
  isJoining: boolean;
  onStart: () => void;
  onJoin: () => void;
  roomId: string;
}
function LivePreJoinState({
  visible,
  isHost,
  isStarting,
  isJoining,
  onStart,
  onJoin,
  roomId,
}: LivePreJoinStateProps) {
  if (!visible) return null;
  const subtitle = isHost
    ? "Your room is now active and ready for collaboration"
    : "The host has started the room - you can now join";
  const details = isHost ? (
    <p>
      Click &apos;Join Room&apos; to enter the collaborative editor and start
      coding with your participants.
    </p>
  ) : (
    <p>
      Join the room to start collaborating with other participants in real-time.
    </p>
  );
  return (
    <RoomStatusCard
      title="Room is live!"
      subtitle={subtitle}
      details={details}
      roomState="live"
      isHost={isHost}
      onStart={onStart}
      onJoin={onJoin}
      isStarting={isStarting}
      isJoining={isJoining}
      roomId={roomId}
    />
  );
}

interface LiveEditorStateProps extends VisibleProps {
  roomId: string;
  isHost: boolean;
  onEndSession: () => Promise<void>;
  isEnding: boolean;
  onLeaveRoom: () => Promise<void>;
  isLeaving: boolean;
}
function LiveEditorState({
  visible,
  roomId,
  isHost,
  onEndSession,
  isEnding,
  onLeaveRoom,
  isLeaving,
}: LiveEditorStateProps) {
  if (!visible) return null;
  return (
    <div className="flex-1 min-h-0">
      <LiveEditorPanels
        roomId={roomId}
        isHost={isHost}
        onEndSession={onEndSession}
        isEnding={isEnding}
        onLeaveRoom={onLeaveRoom}
        isLeaving={isLeaving}
      />
    </div>
  );
}
