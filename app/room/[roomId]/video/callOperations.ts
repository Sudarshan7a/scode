/**
 * Stream Video call operations
 * Utilities for checking and creating video calls
 */

import type { Call } from "@stream-io/video-react-sdk";

/**
 * Type guard to check if an error represents a 404 (call not found)
 */
export function isCallNotFound(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "status" in error &&
    (error as { status?: number }).status === 404
  );
}

/**
 * Ensures a host call exists (creates it if needed)
 * @param call - The Stream Video call instance
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function ensureHostCall(call: Call): Promise<boolean> {
  try {
    await call.getOrCreate();
    return true;
  } catch (error) {
    console.error("Host getOrCreate failed", error);
    return false;
  }
}

/**
 * Checks if a call exists (for participants)
 * @param call - The Stream Video call instance
 * @returns Promise resolving to true if call exists, false otherwise
 */
export async function checkCallExists(call: Call): Promise<boolean> {
  try {
    await call.get();
    return true;
  } catch (error) {
    if (!isCallNotFound(error)) {
      console.warn("Call get() failed (non-404)", error);
    }
    return false;
  }
}
