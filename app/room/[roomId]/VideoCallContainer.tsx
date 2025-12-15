"use client";
import { useCallback, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  useConnectedUser,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import PreJoinVideoPanel from "./PreJoinVideoPanel";
import { toast } from "sonner";
import { useBlockKickListener } from "./video/useBlockKickListener";

type Props = {
  roomId: string;
  isHost: boolean;
};

type StreamCallInstance = ReturnType<StreamVideoClient["call"]>;

function VideoUnavailableNotice() {
  return (
    <div className="w-full rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900 p-3 text-sm">
      Video is not configured. Set NEXT_PUBLIC_STREAM_API_KEY and implement
      /api/video/token.
    </div>
  );
}

function CallLoadingIndicator() {
  return (
    <div className="w-full rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-600 flex items-center gap-3">
      <LoadingSpinner size="small" />
      <span>Finalizing call…</span>
    </div>
  );
}

function CallWithListener({
  call,
  onForcedExit,
}: {
  call: StreamCallInstance;
  onForcedExit: () => void | Promise<void>;
}) {
  const connectedUser = useConnectedUser();

  useBlockKickListener({
    call,
    currentUserId: connectedUser?.id || null,
    onForcedExit,
  });

  return null;
}

function ActiveCallSurface({
  client,
  call,
  onLeave,
  onForcedExit,
}: {
  client: StreamVideoClient;
  call: StreamCallInstance;
  onLeave: () => void | Promise<void>;
  onForcedExit: () => void | Promise<void>;
}) {
  return (
    <div className="w-full h-full rounded-md border border-mysecodary bg-background overflow-hidden">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallWithListener call={call} onForcedExit={onForcedExit} />
          <StreamTheme className="h-full">
            <div className="flex flex-col justify-end h-full">
              <div className="min-h-64 h-full overflow-hidden">
                <SpeakerLayout mirrorLocalParticipantVideo />
              </div>
              <div className="border-t border-gray-200">
                <CallControls onLeave={onLeave} />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

export default function VideoCallContainer({ roomId, isHost }: Props) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<StreamCallInstance | null>(null);
  const [joined, setJoined] = useState(false);
  const [rejoinCounter, setRejoinCounter] = useState(0);

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

  const handleJoined = useCallback(
    (createdClient: StreamVideoClient, callInstance: StreamCallInstance) => {
      setClient(createdClient);
      setCall(callInstance);
      setJoined(true);
    },
    []
  );

  const resetSession = useCallback(() => {
    setCall(null);
    setJoined(false);
    setRejoinCounter((prev) => prev + 1);
  }, []);

  const handleLeave = useCallback(async () => {
    try {
      await call?.leave();
    } catch (error) {
      console.warn("Failed to leave call gracefully", error);
    } finally {
      resetSession();
    }
  }, [call, resetSession]);

  const handleForcedExit = useCallback(async () => {
    try {
      toast.info("You have been removed from the call");
      await call?.leave();
    } catch (error) {
      console.warn("Failed to leave call after being blocked/kicked", error);
      toast.error("Error leaving call");
    } finally {
      resetSession();
    }
  }, [call, resetSession]);

  if (!apiKey) {
    return <VideoUnavailableNotice />;
  }

  if (!joined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <PreJoinVideoPanel
          key={rejoinCounter}
          roomId={roomId}
          isHost={isHost}
          onJoined={handleJoined}
        />
      </div>
    );
  }

  if (!client || !call) {
    return <CallLoadingIndicator />;
  }

  return (
    <ActiveCallSurface
      client={client}
      call={call}
      onLeave={handleLeave}
      onForcedExit={handleForcedExit}
    />
  );
}
