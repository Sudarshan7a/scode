/**
 * Hook to listen for block and kick events from Stream Video
 * Automatically handles leaving the call when current user is blocked or kicked
 */

import { useEffect } from "react";
import type { Call } from "@stream-io/video-react-sdk";

interface UseBlockKickListenerParams {
  call: Call | null;
  currentUserId: string | null;
  onForcedExit: () => void | Promise<void>;
}

/**
 * Listens to call.blocked_user and call.kicked_user events
 * Triggers onForcedExit callback if the affected user is the current user
 *
 * @param call - The Stream Video call instance
 * @param currentUserId - The current user's ID
 * @param onForcedExit - Callback to execute when current user is blocked/kicked
 */
export function useBlockKickListener({
  call,
  currentUserId,
  onForcedExit,
}: UseBlockKickListenerParams): void {
  useEffect(() => {
    if (!call || !currentUserId) return;

    const handleBlockedUser = async (event: any) => {
      console.log("User blocked event received:", event);

      // Check if the blocked user is the current user
      const blockedUserId = event.user?.id;
      if (blockedUserId === currentUserId) {
        console.log("Current user was blocked. Exiting call...");
        await onForcedExit();
      }
    };

    const handleKickedUser = async (event: any) => {
      console.log("User kicked event received:", event);

      // Check if the kicked user is the current user
      const kickedUserId = event.user?.id;
      if (kickedUserId === currentUserId) {
        console.log("Current user was kicked. Exiting call...");
        await onForcedExit();
      }
    };

    // Register event listeners
    call.on("call.blocked_user", handleBlockedUser);
    call.on("call.kicked_user", handleKickedUser);

    // Cleanup listeners on unmount
    return () => {
      call.off("call.blocked_user", handleBlockedUser);
      call.off("call.kicked_user", handleKickedUser);
    };
  }, [call, currentUserId, onForcedExit]);
}
