/**
 * Device state management
 * Utilities for controlling camera and microphone state with proper permission handling
 *
 * When permissions have been reset, the browser will automatically prompt the user
 * when attempting to enable the camera or microphone via the enable() method.
 * All device operations should be wrapped in try/catch blocks to handle permission
 * denials and other errors gracefully.
 */

import type { Call } from "@stream-io/video-react-sdk";

interface DeviceState {
  micMuted: boolean;
  cameraMuted: boolean;
}

/**
 * Safely enables a camera device with error handling
 * Triggers browser permission prompt if permissions were reset
 *
 * @param call - The Stream Video call instance
 * @returns true if successful, false if failed
 */
export async function enableCamera(call: Call): Promise<boolean> {
  try {
    await call.camera.enable();
    return true;
  } catch (err) {
    console.error("Failed to enable camera", err);
    return false;
  }
}

/**
 * Safely enables a microphone device with error handling
 * Triggers browser permission prompt if permissions were reset
 *
 * @param call - The Stream Video call instance
 * @returns true if successful, false if failed
 */
export async function enableMicrophone(call: Call): Promise<boolean> {
  try {
    await call.microphone.enable();
    return true;
  } catch (err) {
    console.error("Failed to enable microphone", err);
    return false;
  }
}

/**
 * Disables "speaking while muted" notification
 * Some users may be uncomfortable with the microphone staying on for detection
 * Call this if users prefer complete microphone privacy when muted
 *
 * @param call - The Stream Video call instance
 */
export async function disableSpeakingWhileMutedNotification(
  call: Call
): Promise<void> {
  try {
    await call.microphone.disableSpeakingWhileMutedNotification();
  } catch (err) {
    console.warn("Failed to disable speaking-while-muted notification", err);
  }
}

/**
 * Applies initial device state before joining a call
 * Ensures camera and microphone are in the desired state
 *
 * The browser will show its native permission prompt when enable() is called,
 * provided the user hasn't previously denied permissions or the permissions
 * have been reset.
 *
 * @param call - The Stream Video call instance
 * @param state - The desired device state (muted/unmuted)
 * @throws Error if device permissions are denied or devices are unavailable
 *
 * @example
 * ```typescript
 * try {
 *   await applyInitialDeviceState(call, {
 *     micMuted: false,
 *     cameraMuted: false
 *   });
 *   await call.join();
 * } catch (err) {
 *   console.error("Failed to set up devices", err);
 *   // Show user-friendly error message
 * }
 * ```
 */
export async function applyInitialDeviceState(
  call: Call,
  { micMuted, cameraMuted }: DeviceState
): Promise<void> {
  try {
    // Handle camera state
    if (cameraMuted) {
      await call.camera.disable();
    } else {
      // Browser will show native permission prompt if permissions were reset
      await call.camera.enable();
    }

    // Handle microphone state
    if (micMuted) {
      await call.microphone.disable();
    } else {
      // Browser will show native permission prompt if permissions were reset
      await call.microphone.enable();
    }
  } catch (err) {
    // Handle device permission errors gracefully
    // This catches: permission denied, device not found, or device in use
    console.error("Failed to enable device(s)", err);
    throw new Error(
      "Unable to access camera or microphone. Please check your browser permissions."
    );
  }
}
