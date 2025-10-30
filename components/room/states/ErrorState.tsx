import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { useRoomContext } from "../RoomContext";

interface ErrorStateProps {
  visible: boolean;
}

export default function ErrorState({ visible }: ErrorStateProps) {
  const { roomInfo } = useRoomContext();
  
  if (!visible) return null;
  
  const subtitle = String(
    roomInfo && typeof roomInfo === "object" && "message" in roomInfo
      ? roomInfo.message
      : "Unknown error"
  );
  
  return <RoomStatusCard title="Unable to load room" subtitle={subtitle} />;
}