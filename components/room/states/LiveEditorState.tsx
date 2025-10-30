import LiveEditorPanels from "../../../app/room/[roomId]/LiveEditorPanels";
import { useRoomContext } from "../RoomContext";

interface LiveEditorStateProps {
  visible: boolean;
}

export default function LiveEditorState({ visible }: LiveEditorStateProps) {
  const { roomId, isHost, handleEndSession, isEnding, handleLeaveRoom, isLeaving } = useRoomContext();
  
  if (!visible) return null;
  
  return (
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
  );
}