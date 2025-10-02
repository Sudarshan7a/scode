"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

/**
 * Accessible preview control buttons for camera and microphone
 */
export function PreviewControls() {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();

  return (
    <div className="flex gap-4 justify-center">
      {/* Microphone Toggle Button */}
      <button
        type="button"
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          ${
            isMicMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-700 hover:bg-gray-600"
          }
        `}
        onClick={() =>
          isMicMuted ? microphone.enable() : microphone.disable()
        }
        aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMicMuted ? (
          <MicOff className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Mic className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>

      {/* Camera Toggle Button */}
      <button
        type="button"
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          ${
            isCameraMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-700 hover:bg-gray-600"
          }
        `}
        onClick={() => (isCameraMuted ? camera.enable() : camera.disable())}
        aria-label={isCameraMuted ? "Turn on camera" : "Turn off camera"}
        title={isCameraMuted ? "Turn on camera" : "Turn off camera"}
      >
        {isCameraMuted ? (
          <VideoOff className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Video className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
