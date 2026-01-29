/**
 * Camera preview hook
 * Manages camera preview lifecycle and error handling
 *
 * Default behavior: Audio ON, Video OFF
 * - Enables microphone by default for audio preview
 * - Camera is disabled by default (user can enable manually)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Call } from "@stream-io/video-react-sdk";

interface CameraPreviewResult {
  previewError: string | null;
  markJoined: () => void;
}

/**
 * Hook to manage device preview for pre-join screens
 *
 * - Enables microphone by default (audio ON)
 * - Keeps camera disabled by default (video OFF)
 * - Handles permission errors gracefully
 * - Auto-hides error messages after 5 seconds
 * - Disables microphone on cleanup (unless user has joined)
 *
 * @param call - The Stream Video call instance (null before ready)
 * @returns Preview error state and markJoined callback
 */
export function useCameraPreview(call: Call | null): CameraPreviewResult {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const joinedRef = useRef(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!call) return;

    let cancelled = false;
    setPreviewError(null);

    // Disable camera by default (video OFF)
    call.camera.disable().catch(() => undefined);

    // Enable microphone by default (audio ON)
    call.microphone.enable().catch((error) => {
      if (cancelled) return;
      console.warn("Microphone preview failed", error);
      setPreviewError(
        "Microphone unavailable. Check your browser permissions."
      );

      // Auto-hide error after 5 seconds
      hideTimer.current = setTimeout(() => {
        if (!cancelled) {
          setPreviewError(null);
        }
      }, 5000);
    });

    return () => {
      cancelled = true;

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }

      // Only disable microphone if user hasn't joined yet
      if (!joinedRef.current) {
        call.microphone.disable().catch(() => undefined);
      }
    };
  }, [call]);

  const markJoined = useCallback(() => {
    joinedRef.current = true;
  }, []);

  return {
    previewError,
    markJoined,
  };
}
