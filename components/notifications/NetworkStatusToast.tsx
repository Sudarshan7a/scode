"use client";

import { useEffect } from "react";
import { useToast, TOAST_MESSAGES } from "../../hooks/useToast";

/**
 * NetworkStatusToast - Automatically shows toast notifications for network status changes
 * Displays notifications when the user goes offline or comes back online
 */
export function NetworkStatusToast() {
  const { info, success } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      success(TOAST_MESSAGES.SYSTEM.ONLINE, {
        duration: 3000,
        position: "bottom-right",
      });
    };

    const handleOffline = () => {
      info(TOAST_MESSAGES.SYSTEM.OFFLINE, {
        duration: 8000, // Longer duration for offline message
        position: "bottom-right",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [info, success]);

  return null; // This component doesn't render anything
}

export default NetworkStatusToast;
