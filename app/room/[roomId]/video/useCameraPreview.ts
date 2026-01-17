/**
 * Camera preview hook
 * Manages camera preview lifecycle and error handling
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Call } from "@stream-io/video-react-sdk";

interface CameraPreviewResult {
  previewError: string | null;
  markJoined: () => void;
}

/**
 * Hook to manage camera and microphone preview for pre-join screens
 *
 * - Camera: Disabled by default (user can enable via toggle button)
 * - Microphone: Enabled by default for audio testing
 * - Gracefully handles permission errors without showing warnings
 * - The PermissionStateMonitor component will show permission UI
 * - Disables devices on cleanup (unless user has joined)
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

    // Set default device states
    // Camera: Disabled by default (privacy-friendly)
    // Microphone: Enabled by default (for audio testing)
    const setupDevices = async () => {
      try {
        // Disable camera by default
        await call.camera.disable();
        
        // Enable microphone by default
        await call.microphone.enable();
      } catch (error) {
        if (cancelled) return;
        
        // Only log the error, don't show UI here
        // The PermissionStateMonitor component handles permission UI
        console.debug("[Device Setup] Device setup failed:", error);
        
        // Only show error for non-permission issues
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorName = error instanceof Error ? error.name : '';
        const isPermissionError = 
          errorMessage.toLowerCase().includes('permission') ||
          errorMessage.toLowerCase().includes('denied') ||
          errorName === 'NotAllowedError';
        
        if (!isPermissionError) {
          setPreviewError("Device unavailable. Please check your devices.");
          
          // Auto-hide error after 5 seconds
          hideTimer.current = setTimeout(() => {
            if (!cancelled) {
              setPreviewError(null);
            }
          }, 5000);
        }
      }
    };
    
    setupDevices();

    return () => {
      cancelled = true;

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }

      // Disable devices if user hasn't joined yet
      if (!joinedRef.current) {
        call.camera.disable().catch(() => undefined);
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
