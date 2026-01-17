# Video Module

This directory contains all video call functionality using Stream Video SDK. The code is organized into focused, single-responsibility modules for improved maintainability.

## Module Structure

### Core Files

#### `index.ts`

Central export point for all video utilities. Import from this file to access any video functionality:

```typescript
import {
  usePreJoinResources,
  useCameraPreview,
  applyInitialDeviceState,
} from "./video";
```

### API Layer

#### `tokenApi.ts`

Handles video authentication token fetching from the backend API.

**Exports:**

- `fetchVideoToken(roomId: string)` - Fetches token and userId for Stream Video authentication

### Call Management

#### `callOperations.ts`

Stream Video call lifecycle operations.

**Exports:**

- `isCallNotFound(error: unknown)` - Type guard for 404 errors
- `ensureHostCall(call: Call)` - Creates or retrieves a call (host only)
- `checkCallExists(call: Call)` - Checks if a call exists (participants)

### Device Control

#### `deviceState.ts`

Camera and microphone state management with proper permission handling.

**Important:** When permissions have been reset, the browser will automatically prompt the user when you call `enable()` on the camera or microphone. All device operations use try/catch blocks to handle permission denials gracefully.

**Critical Permission Behavior:**
- Users get **only ONE chance** to grant permissions when the browser prompts
- If denied, the browser will NOT prompt again automatically
- Users must manually reset permissions in browser settings:
  - Chrome: Settings → Privacy and security → Site Settings → Camera/Microphone → Allow
- Without proper UX, users won't know what the problem is and will complain the call doesn't work

**Exports:**

- `applyInitialDeviceState(call: Call, state: DeviceState)` - Sets camera/mic state before joining (with error handling)
- `enableCamera(call: Call)` - Safely enables camera with error handling
- `enableMicrophone(call: Call)` - Safely enables microphone with error handling
- `disableSpeakingWhileMutedNotification(call: Call)` - Disables speaking-while-muted detection for privacy

**Permission Handling:**

The browser shows its native permission prompt when `enable()` is called, provided:
- The user hasn't previously denied permissions
- Permissions have been reset

**Usage:**

```typescript
// Check permission status BEFORE attempting to enable
const { useCameraState } = useCallStateHooks();
const { hasBrowserPermission, isPromptingPermission } = useCameraState();

if (!hasBrowserPermission && !isPromptingPermission) {
  // Permission was denied - show UI guidance
  showToast("Please enable camera permissions in browser settings");
  return;
}

// Using individual device controls
try {
  const cameraEnabled = await enableCamera(call);
  const micEnabled = await enableMicrophone(call);

  if (!cameraEnabled || !micEnabled) {
    // Handle permission denial gracefully
    showToast("Please enable camera/microphone permissions");
  }
} catch (err) {
  console.error("Device setup failed", err);
}

// Using applyInitialDeviceState (wrapped in try/catch at call site)
try {
  await applyInitialDeviceState(call, {
    micMuted: false,
    cameraMuted: false,
  });
  await call.join();
} catch (err) {
  // Handle errors (permission denied, device not found, etc.)
  console.error("Device setup failed", err);
}
```

### React Hooks

#### `usePreJoinResources.ts`

Hook for initializing Stream Video client and call.

**Purpose:**

- Fetches authentication token
- Creates `StreamVideoClient` instance with token provider for auto-refresh
- Initializes `Call` object
- Verifies call existence (or creates if host)
- Properly disposes client on cleanup to prevent memory leaks

**Usage:**

```typescript
const { status, client, call, hostRoomExists, error } = usePreJoinResources({
  apiKey,
  roomId,
  isHost,
});
```

#### `useCameraPreview.ts`

Hook for managing camera preview lifecycle.

**Purpose:**

- Enables camera for preview
- Handles permission errors gracefully
- Auto-hides error messages after 5 seconds
- Cleans up camera when unmounting (unless user joined)

**Usage:**

```typescript
const { previewError, markJoined } = useCameraPreview(call);
```

#### `useDevicePermissions.ts`

Hook for monitoring camera and microphone permission states.

**Purpose:**

- Monitors real-time permission status for camera and microphone
- Detects when browser is prompting for permissions
- Detects when permissions have been denied
- Enables proactive UI/UX based on permission state

**CRITICAL**: Users only get ONE chance to grant permissions. If denied, they must manually reset in browser settings.

**Usage:**

```typescript
const permissions = useDevicePermissions();

// Check camera permission
if (!permissions.camera.hasBrowserPermission) {
  // Show UI guidance for denied permissions
  return <PermissionDeniedWarning device="camera" />;
}

// Check if prompting
if (permissions.camera.isPromptingPermission) {
  // Show loading UI while waiting for user response
  return <PermissionPrompting device="camera" />;
}

// Disable join button if permissions denied
const hasPermissionIssue = 
  (!permissions.camera.hasBrowserPermission && !permissions.camera.isPromptingPermission) ||
  (!permissions.microphone.hasBrowserPermission && !permissions.microphone.isPromptingPermission);

<Button disabled={hasPermissionIssue}>Join Call</Button>
```
- Auto-hides error messages after 5 seconds
- Cleans up camera when unmounting (unless user joined)

**Usage:**

```typescript
const { previewError, markJoined } = useCameraPreview(call);
```

## Design Principles

1. **Single Responsibility** - Each file has one clear purpose
2. **Separation of Concerns** - API, state, and UI logic are separated
3. **Reusability** - All utilities are framework-agnostic where possible
4. **Type Safety** - Full TypeScript coverage with explicit types
5. **Error Handling** - Graceful degradation with user-friendly messages

## Dependencies

- `@stream-io/video-react-sdk` - Stream Video SDK
- `react` - React hooks (for hook modules only)

## Usage Example

```typescript
import {
  usePreJoinResources,
  useCameraPreview,
  applyInitialDeviceState,
} from "./video";

function PreJoinPanel({ roomId, isHost }) {
  // Initialize video resources
  const { status, client, call, error } = usePreJoinResources({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    roomId,
    isHost,
  });

  // Manage camera preview
  const { previewError, markJoined } = useCameraPreview(call);

  // Apply device state before joining
  const handleJoin = async () => {
    await applyInitialDeviceState(call, {
      micMuted: false,
      cameraMuted: false,
    });
    await call.join({ create: isHost });
    markJoined();
  };
}
```

## Refactoring History

This module was refactored from a single `preJoinHooks.ts` file to improve:

- **Code maintainability** - Smaller, focused files are easier to understand
- **Testability** - Individual utilities can be tested in isolation
- **Reusability** - Functions can be imported independently
- **Code health** - Reduced cyclomatic complexity warnings
