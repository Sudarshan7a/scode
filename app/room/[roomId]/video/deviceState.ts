/**
 * Device state management
 * Utilities for controlling camera and microphone state
 */

import type { Call } from "@stream-io/video-react-sdk";

interface DeviceState {
  micMuted: boolean;
  cameraMuted: boolean;
}

/**
 * Applies initial device state before joining a call
 * Ensures camera and microphone are in the desired state
 *
 * @param call - The Stream Video call instance
 * @param state - The desired device state (muted/unmuted)
 */
export async function applyInitialDeviceState(
  call: Call,
  { micMuted, cameraMuted }: DeviceState
): Promise<void> {
  if (cameraMuted) {
    await call.camera.disable();
  } else {
    await call.camera.enable();
  }

  if (micMuted) {
    await call.microphone.disable();
  } else {
    await call.microphone.enable();
  }
}
