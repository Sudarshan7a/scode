import { useState } from "react";
import RoomStatusCard from "../../../app/room/[roomId]/RoomStatusCard";
import { useRoomContext } from "../RoomContext";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Lock } from "lucide-react";

interface LivePreJoinStateProps {
  visible: boolean;
}

export default function LivePreJoinState({ visible }: LivePreJoinStateProps) {
  const { isHost, isStarting, isJoining, handleStartRoom, handleJoinRoom, roomId, isPrivate, requiresPassword, passwordError } = useRoomContext();
  const [password, setPassword] = useState("");
  
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

  // Handle join with password for private rooms
  const onJoinClick = () => {
    if (isPrivate && !isHost && requiresPassword) {
      handleJoinRoom(password);
    } else {
      handleJoinRoom();
    }
  };

  // Password input for private rooms (non-host only)
  const passwordSection = isPrivate && !isHost && requiresPassword ? (
    <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200/50 dark:border-amber-700/50">
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <Label className="text-sm font-medium text-amber-700 dark:text-amber-300">
          This is a private room
        </Label>
      </div>
      <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
        Please enter the password to join this room
      </p>
      <Input
        type="password"
        placeholder="Enter room password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 border-amber-300 dark:border-amber-700"
        autoComplete="off"
      />
      {passwordError && (
        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
      )}
    </div>
  ) : null;
  
  return (
    <RoomStatusCard
      title="Room is live!"
      subtitle={subtitle}
      details={details}
      roomState="live"
      isHost={isHost}
      onStart={handleStartRoom}
      onJoin={onJoinClick}
      isStarting={isStarting}
      isJoining={isJoining}
      roomId={roomId}
    >
      {passwordSection}
    </RoomStatusCard>
  );
}