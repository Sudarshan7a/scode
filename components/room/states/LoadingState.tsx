import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface LoadingStateProps {
  visible: boolean;
}

export default function LoadingState({ visible }: LoadingStateProps) {
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