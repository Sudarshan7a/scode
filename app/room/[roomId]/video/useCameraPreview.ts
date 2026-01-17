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
 * Hook to manage camera preview for pre-join screens
 *
 * - Attempts to enable camera preview when call is available
 * - Gracefully handles permission errors without showing warnings
 * - The PermissionStateMonitor component will show permission UI
 * - Disables camera on cleanup (unless user has joined)
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

    // Attempt to enable camera for preview
    // If this fails due to permissions, the PermissionStateMonitor
    // component will show appropriate UI guidance
    call.camera.enable().catch((error) => {
      if (cancelled) return;
      
      // Only log the error, don't show UI here
      // The PermissionStateMonitor component handles permission UI
      console.debug("[Camera Preview] Camera enable failed:", error.message || error);
      
      // Only show error for non-permission issues
      const isPermissionError = 
        error?.message?.toLowerCase().includes('permission') ||
        error?.message?.toLowerCase().includes('denied') ||
        error?.name === 'NotAllowedError';
      
      if (!isPermissionError) {
        setPreviewError("Camera unavailable. Please check your device.");
        
        // Auto-hide error after 5 seconds
        hideTimer.current = setTimeout(() => {
          if (!cancelled) {
            setPreviewError(null);
          }
        }, 5000);
      }
    });

    return () => {
      cancelled = true;

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }

      // Only disable camera if user hasn't joined yet
      if (!joinedRef.current) {
        call.camera.disable().catch(() => undefined);
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
