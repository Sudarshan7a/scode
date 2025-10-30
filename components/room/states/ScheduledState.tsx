import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { useRoomContext } from "../RoomContext";
import type { RoomInfo } from "@/types/room";

interface ScheduledStateProps {
  visible: boolean;
}

export default function ScheduledState({ visible }: ScheduledStateProps) {
  const { isHost, roomInfo, roomId, isStarting, isJoining, handleStartRoom, handleJoinRoom } = useRoomContext();
  
  if (!visible) return null;
  
  const subtitle = isHost
    ? "Click 'Start Room' when you're ready to begin the session"
    : roomInfo &&
      typeof roomInfo === "object" &&
      "scheduledAt" in roomInfo &&
      roomInfo.scheduledAt
    ? `Scheduled for: ${new Date(String(roomInfo.scheduledAt)).toLocaleString()}`
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
      onStart={handleStartRoom}
      onJoin={handleJoinRoom}
      isStarting={isStarting}
      isJoining={isJoining}
      roomId={roomId}
    />
  );
}