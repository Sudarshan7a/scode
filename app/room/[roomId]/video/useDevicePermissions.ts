/**
 * Device permissions hook
 * Monitors camera and microphone permission states
 */

import { useCallStateHooks } from "@stream-io/video-react-sdk";

export interface DevicePermissionState {
  camera: {
    hasBrowserPermission: boolean;
    isPromptingPermission: boolean;
  };
  microphone: {
    hasBrowserPermission: boolean;
    isPromptingPermission: boolean;
  };
}

/**
 * Hook to monitor device permission states
 * Useful for showing permission status UI and troubleshooting
 *
 * @returns Permission state for camera and microphone
 *
 * @example
 * ```tsx
 * const permissions = useDevicePermissions();
 * 
 * if (!permissions.camera.hasBrowserPermission) {
 *   return <PermissionDeniedWarning device="camera" />;
 * }
 * ```
 */
export function useDevicePermissions(): DevicePermissionState {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const cameraState = useCameraState();
  const microphoneState = useMicrophoneState();

  return {
    camera: {
      hasBrowserPermission: cameraState.hasBrowserPermission,
      isPromptingPermission: cameraState.isPromptingPermission,
    },
    microphone: {
      hasBrowserPermission: microphoneState.hasBrowserPermission,
      isPromptingPermission: microphoneState.isPromptingPermission,
    },
  };
}
