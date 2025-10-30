import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { useRoomContext } from "../RoomContext";

interface LivePreJoinStateProps {
  visible: boolean;
}

export default function LivePreJoinState({ visible }: LivePreJoinStateProps) {
  const { isHost, isStarting, isJoining, handleStartRoom, handleJoinRoom, roomId } = useRoomContext();
  
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
      onStart={handleStartRoom}
      onJoin={handleJoinRoom}
      isStarting={isStarting}
      isJoining={isJoining}
      roomId={roomId}
    />
  );
}