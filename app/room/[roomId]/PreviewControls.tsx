"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff, Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * Accessible preview control buttons for camera and microphone
 */
export function PreviewControls() {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const [isMicTransitioning, setIsMicTransitioning] = useState(false);
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false);

  // Handle mic toggle with debounce
  const handleMicToggle = async () => {
    if (isMicTransitioning) return;

    setIsMicTransitioning(true);
    try {
      await (isMicMuted ? microphone.enable() : microphone.disable());
    } catch (err) {
      console.error("Mic toggle failed", err);
    } finally {
      setTimeout(() => setIsMicTransitioning(false), 500);
    }
  };

  // Handle camera toggle with debounce
  const handleCameraToggle = async () => {
    if (isCameraTransitioning) return;

    setIsCameraTransitioning(true);
    try {
      await (isCameraMuted ? camera.enable() : camera.disable());
    } catch (err) {
      console.error("Camera toggle failed", err);
    } finally {
      setTimeout(() => setIsCameraTransitioning(false), 500);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      {/* Microphone Toggle Button */}
      <button
        type="button"
        disabled={isMicTransitioning}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${
            isMicMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-700 hover:bg-gray-600"
          }
        `}
        onClick={handleMicToggle}
        aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMicTransitioning ? (
          <Loader2
            className="h-5 w-5 text-foreground animate-spin"
            aria-hidden="true"
          />
        ) : isMicMuted ? (
          <MicOff className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Mic className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>

      {/* Camera Toggle Button */}
      <button
        type="button"
        disabled={isCameraTransitioning}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${
            isCameraMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-700 hover:bg-gray-600"
          }
        `}
        onClick={handleCameraToggle}
        aria-label={isCameraMuted ? "Turn on camera" : "Turn off camera"}
        title={isCameraMuted ? "Turn on camera" : "Turn off camera"}
      >
        {isCameraTransitioning ? (
          <Loader2
            className="h-5 w-5 text-foreground animate-spin"
            aria-hidden="true"
          />
        ) : isCameraMuted ? (
          <VideoOff className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Video className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
