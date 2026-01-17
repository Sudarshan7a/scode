"use client";
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Call, StreamVideoClient } from "@stream-io/video-react-sdk";
import {
  StreamVideo,
  StreamCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { PreviewControls } from "./PreviewControls";
import { useToast } from "@/hooks/useToast";
import {
  applyInitialDeviceState,
  isCallNotFound,
  usePreJoinResources,
  useCameraPreview,
  useDevicePermissions,
} from "./video";
import {
  PermissionDeniedWarning,
  PermissionPrompting,
} from "@/components/room/PermissionWarnings";

type Props = {
  roomId: string;
  isHost: boolean;
  onJoined: (client: StreamVideoClient, call: Call) => void;
};

export default function PreJoinVideoPanel({ roomId, isHost, onJoined }: Props) {
  const [joining, setJoining] = useState(false);
  const { error: showErrorToast, info: showInfoToast } = useToast();

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const resources = usePreJoinResources({ apiKey, roomId, isHost });
  const { previewError, markJoined } = useCameraPreview(resources.call);

  const handleJoin = useJoinHandler({
    ...resources,
    isHost,
    joining,
    setJoining,
    markJoined,
    onJoined,
    showErrorToast,
    showInfoToast,
  });

  if (!apiKey) {
    return <MissingApiKeyNotice />;
  }

  return (
    <PreJoinCard
      status={resources.status}
      error={resources.error}
      previewError={previewError}
      isHost={isHost}
      hostRoomExists={resources.hostRoomExists}
      joining={joining}
      onJoin={handleJoin}
      client={resources.client}
      call={resources.call}
    />
  );
}

function MissingApiKeyNotice() {
  return (
    <div className="p-3 text-xs rounded border border-yellow-300 bg-yellow-50 text-yellow-800">
      Video unavailable (missing NEXT_PUBLIC_STREAM_API_KEY)
    </div>
  );
}

type PreJoinCardProps = {
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  previewError: string | null;
  isHost: boolean;
  hostRoomExists: boolean | null;
  joining: boolean;
  onJoin: () => void;
  client: StreamVideoClient | null;
  call: Call | null;
};

function PreJoinCard({
  status,
  error,
  previewError,
  isHost,
  hostRoomExists,
  joining,
  onJoin,
  client,
  call,
}: PreJoinCardProps) {
  const showPreview = status === "ready" && client && call;

  return (
    <div className="w-full max-w-md rounded-xl border-1 border-mysecondary bg-background p-4 shadow-sm">
      {status === "loading" && <LoadingState />}
      {status === "error" && error && <ErrorBanner message={error} />}
      {showPreview && (
        <PreviewContent
          client={client}
          call={call}
          previewError={previewError}
          isHost={isHost}
          hostRoomExists={hostRoomExists}
          joining={joining}
          onJoin={onJoin}
        />
      )}
    </div>
  );
}

function PreviewContent({
  client,
  call,
  previewError,
  isHost,
  hostRoomExists,
  joining,
  onJoin,
}: {
  client: StreamVideoClient;
  call: Call;
  previewError: string | null;
  isHost: boolean;
  hostRoomExists: boolean | null;
  joining: boolean;
  onJoin: () => void;
}) {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="flex flex-col gap-3">
          <PermissionStateMonitor />
          <PreviewSurface previewError={previewError} />
          {!isHost && (
            <div className="text-center text-xs text-foreground">
              {hostRoomExists === false
                ? "Click 'Join Call' to check if the host has started."
                : "Ready to join the call."}
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <PreviewControls />
          </div>
          <Button
            size="default"
            className="w-full font-semibold"
            disabled={joining}
            onClick={onJoin}
          >
            {joining ? "Joining…" : "Join Call"}
          </Button>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}

/**
 * Component to monitor and display permission states
 * Shows warnings when permissions are denied or prompting
 */
function PermissionStateMonitor() {
  const permissions = useDevicePermissions();

  const cameraPrompting = permissions.camera.isPromptingPermission;
  const micPrompting = permissions.microphone.isPromptingPermission;
  const cameraDenied = !permissions.camera.hasBrowserPermission && !cameraPrompting;
  const micDenied = !permissions.microphone.hasBrowserPermission && !micPrompting;

  // Show prompting state
  if (cameraPrompting && micPrompting) {
    return <PermissionPrompting device="both" />;
  }
  if (cameraPrompting) {
    return <PermissionPrompting device="camera" />;
  }
  if (micPrompting) {
    return <PermissionPrompting device="microphone" />;
  }

  // Show denied state
  if (cameraDenied && micDenied) {
    return <PermissionDeniedWarning device="both" />;
  }
  if (cameraDenied) {
    return <PermissionDeniedWarning device="camera" />;
  }
  if (micDenied) {
    return <PermissionDeniedWarning device="microphone" />;
  }

  return null;
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-xs text-foreground">
      <LoadingSpinner size="small" />
      <span>Preparing preview…</span>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
      {message}
    </div>
  );
}

function PreviewSurface({ previewError }: { previewError: string | null }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-black/60"
      style={{ aspectRatio: "16/9" }}
    >
      <div className=" [&_video]:!object-contain [&_video]:object-[0%_0%]">
        <VideoPreview className="!max-h-full !max-w-full" />
      </div>
      {previewError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-3 text-center text-xs text-red-200">
          {previewError}
        </div>
      )}
    </div>
  );
}

interface JoinHandlerParams {
  client: StreamVideoClient | null;
  call: Call | null;
  isHost: boolean;
  joining: boolean;
  setJoining: Dispatch<SetStateAction<boolean>>;
  markJoined: () => void;
  onJoined: (client: StreamVideoClient, call: Call) => void;
  showErrorToast: ReturnType<typeof useToast>["error"];
  showInfoToast: ReturnType<typeof useToast>["info"];
}

function useJoinHandler(params: JoinHandlerParams) {
  const {
    client,
    call,
    isHost,
    joining,
    setJoining,
    markJoined,
    onJoined,
    showErrorToast,
    showInfoToast,
  } = params;

  return useCallback(async () => {
    const cannotJoin = !client || !call || joining;
    if (cannotJoin) {
      return;
    }

    setJoining(true);
    try {
      // Get current mic and camera state from the call
      const isMicMuted =
        !call.microphone.state.status ||
        call.microphone.state.status === "disabled";
      const isCameraMuted =
        !call.camera.state.status || call.camera.state.status === "disabled";

      await applyInitialDeviceState(call, {
        micMuted: isMicMuted,
        cameraMuted: isCameraMuted,
      });

      await call.join({ create: isHost });
      markJoined();
      onJoined(client, call);
    } catch (error) {
      if (!isHost && isCallNotFound(error)) {
        showInfoToast(
          "The host hasn't started the call yet. Please try again.",
          {
            duration: 4000,
          }
        );
      } else {
        const message =
          error instanceof Error ? error.message : "Failed to join call";
        showErrorToast(message, { duration: 5000 });
      }
    } finally {
      setJoining(false);
    }
  }, [
    call,
    client,
    isHost,
    joining,
    markJoined,
    onJoined,
    setJoining,
    showErrorToast,
    showInfoToast,
  ]);
}
