/**
 * Video module exports
 * Central export point for all video-related utilities and hooks
 */

// Token API
export { fetchVideoToken } from "./tokenApi";

// Call operations
export { isCallNotFound, ensureHostCall, checkCallExists } from "./callOperations";

// Device state management
export { applyInitialDeviceState } from "./deviceState";

// Hooks
export { useCameraPreview } from "./useCameraPreview";
export { usePreJoinResources } from "./usePreJoinResources";

// Re-export types
export type { Call, StreamVideoClient, User } from "@stream-io/video-react-sdk";
