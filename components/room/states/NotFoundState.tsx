import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";

interface NotFoundStateProps {
  visible: boolean;
}

export default function NotFoundState({ visible }: NotFoundStateProps) {
  if (!visible) return null;
  return (
    <RoomStatusCard
      title="404 — Room not found"
      subtitle="The room does not exist."
    />
  );
}