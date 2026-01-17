/**
 * Video module exports
 * Central export point for all video-related utilities and hooks
 */
// Video event listener for block/kick events
export { useBlockKickListener } from "./useBlockKickListener";

// Token API
export { fetchVideoToken } from "./tokenApi";

// Call operations
export {
  isCallNotFound,
  ensureHostCall,
  checkCallExists,
} from "./callOperations";

// Device state management
export {
  applyInitialDeviceState,
  enableCamera,
  enableMicrophone,
  disableSpeakingWhileMutedNotification,
} from "./deviceState";

// Hooks
export { useCameraPreview } from "./useCameraPreview";
export { usePreJoinResources } from "./usePreJoinResources";
export { useDevicePermissions } from "./useDevicePermissions";

// Re-export types
export type { Call, StreamVideoClient, User } from "@stream-io/video-react-sdk";
export type { DevicePermissionState } from "./useDevicePermissions";
