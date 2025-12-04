import { useEffect, useRef, useCallback } from "react";
import { useRoomStateUpdate } from "./useRoomStateUpdate";

interface UseRoomAutoEndOptions {
  roomId: string;
  isHost: boolean;
  isLive: boolean;
  enabled?: boolean;
}

/**
 * Hook that automatically ends a room session when:
 * 1. Host closes browser tab/window
 * 2. Host navigates away from room page
 * 3. Component unmounts while room is live
 * 
 * Only active for hosts with live rooms.
 */
export function useRoomAutoEnd({
  roomId,
  isHost,
  isLive,
  enabled = true,
}: UseRoomAutoEndOptions) {
  const { updateState } = useRoomStateUpdate();
  const hasAttemptedEndRef = useRef(false);

  // Send beacon for reliable state update during page unload
  const sendEndBeacon = useCallback(() => {
    if (!isHost || !isLive || !enabled || hasAttemptedEndRef.current) {
      return;
    }

    hasAttemptedEndRef.current = true;

    // Use sendBeacon for reliable delivery during page unload
    // Beacon API queues the request and sends it even if page is closing
    const payload = JSON.stringify({
      roomId,
      newStatus: "ended",
      metadata: {
        reason: "auto-ended-page-unload",
        notes: "Host closed or refreshed the page",
      },
    });

    // Get auth token from cookies or session storage
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (token) {
      // Create a Blob with the payload and correct content type
      const blob = new Blob([payload], { type: "application/json" });
      
      // Try to send via beacon API
      const beaconSent = navigator.sendBeacon(
        "/api/rooms/update-state",
        blob
      );

      if (!beaconSent) {
        console.warn("Beacon API failed, room may not have ended properly");
      }
    }
  }, [roomId, isHost, isLive, enabled]);

  // Async method for regular cleanup (not during page unload)
  const endRoomAsync = useCallback(async () => {
    if (!isHost || !isLive || !enabled || hasAttemptedEndRef.current) {
      return;
    }

    hasAttemptedEndRef.current = true;

    try {
      await updateState(roomId, "ended", {
        reason: "auto-ended-navigation",
        notes: "Host navigated away from the room",
      });
    } catch (error) {
      console.error("Failed to auto-end room:", error);
      // Reset flag to allow retry
      hasAttemptedEndRef.current = false;
    }
  }, [roomId, isHost, isLive, enabled, updateState]);

  useEffect(() => {
    if (!enabled || !isHost || !isLive) {
      return;
    }

    // Handle browser close/refresh - use beacon for reliability
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      sendEndBeacon();
      
      // Show confirmation dialog
      e.preventDefault();
      e.returnValue = ""; // Modern browsers require this for the dialog
      return ""; // Fallback for older browsers
    };

    // Handle page visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User is leaving the page, send beacon as backup
        sendEndBeacon();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount (navigation within app)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // If component unmounts while room is still live, end it
      if (isHost && isLive && !hasAttemptedEndRef.current) {
        // Use beacon for unmount as well for reliability
        sendEndBeacon();
      }
    };
  }, [enabled, isHost, isLive, sendEndBeacon]);

  return {
    endRoomAsync,
    sendEndBeacon,
  };
}
