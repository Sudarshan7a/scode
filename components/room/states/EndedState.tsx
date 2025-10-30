import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { useRoomContext } from "../RoomContext";

interface EndedStateProps {
  visible: boolean;
}

export default function EndedState({ visible }: EndedStateProps) {
  const { isHost, isStarting, isJoining, handleStartRoom, handleJoinRoom } = useRoomContext();
  
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
      onStart={handleStartRoom}
      onJoin={handleJoinRoom}
      isStarting={isStarting}
      isJoining={isJoining}
    />
  );
}