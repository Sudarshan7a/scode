# Video Module

Stream Video SDK integration with modular architecture.

## ⚠️ Quick Setup

In [next.config.ts](../../next.config.ts), set:

```typescript
Permissions-Policy: "camera=(self), microphone=(self), geolocation=()"
```

❌ `camera=()` blocks everything  
✅ `camera=(self)` allows your site

## Module Structure

### Core Files

#### `index.ts`

Central export point for all video utilities. Import from this file to access any video functionality:

```typescript
import {
  usePreJoinResources,
  useCameraPreview,
  useDevicePermissions,
  useBlockKickListener,
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

Camera/mic controls with permission handling.

**Key Point:** Users get ONE shot at granting permissions. If denied, they must manually reset in browser settings.

**Exports:**

- `applyInitialDeviceState()` - Set camera/mic before joining
- `enableCamera()` - Turn on camera
- `enableMicrophone()` - Turn on mic

**Usage:**

```typescript
try {
  await applyInitialDeviceState(call, { micMuted: false, cameraMuted: false });
  await call.join({ create: isHost });
} catch {
  showToast("Check browser permissions");
}
```

### React Hooks

#### `usePreJoinResources.ts`

Hook for initializing Stream Video client and call.

**Purpose:**

- Fetches authentication token
- Creates `StreamVideoClient` instance
- Initializes `Call` object
- Verifies call existence (or creates if host)

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

- Camera: Disabled by default (user can enable via toggle button)
- Microphone: Enabled by default for audio testing
- Gracefully handles permission errors without showing warnings
- The PermissionStateMonitor component will show permission UI
- Disables devices on cleanup (unless user has joined)

**Usage:**

```typescript
const { previewError, markJoined } = useCameraPreview(call);
```

#### `useDevicePermissions.ts`

Monitors camera/mic permission states.

```typescript
const permissions = useDevicePermissions();

if (!permissions.camera.hasBrowserPermission) {
  return <PermissionDeniedWarning />;
}
```

#### `useBlockKickListener.ts`

Detects when user is kicked from call.

```typescript
useBlockKickListener({
  call,
  currentUserId: user?.id,
  onForcedExit: () => toast.error("Removed from call"),
});
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
  useDevicePermissions,
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

  // Monitor device permissions
  const permissions = useDevicePermissions();

  // Check if permissions are denied
  const cameraDenied = !permissions.camera.hasBrowserPermission &&
                       !permissions.camera.isPromptingPermission;
  const micDenied = !permissions.microphone.hasBrowserPermission &&
                    !permissions.microphone.isPromptingPermission;

  // Apply device state before joining
  const handleJoin = async () => {
    if (cameraDenied || micDenied) {
      showToast("Please enable camera/microphone permissions");
      return;
    }

    try {
      await applyInitialDeviceState(call, {
        micMuted: false,
        cameraMuted: false,
      });
      await call.join({ create: isHost });
      markJoined();
    } catch (error) {
      console.error("Failed to join call:", error);
      showToast("Unable to join call. Check your browser permissions.");
    }
  };

  return (
    <div>
      {permissions.camera.isPromptingPermission && (
        <PermissionPrompting device="camera" />
      )}
      {cameraDenied && <PermissionDeniedWarning device="camera" />}
      {/* ... rest of UI */}
    </div>
  );
}
```

## Refactoring History

This module was refactored from a single `preJoinHooks.ts` file to improve:

- **Code maintainability** - Smaller, focused files are easier to understand
- **Testability** - Individual utilities can be tested in isolation
- **Reusability** - Functions can be imported independently
- **Code health** - Reduced cyclomatic complexity warnings

## Troubleshooting

| Problem           | Fix                                                      |
| ----------------- | -------------------------------------------------------- |
| Permission denied | Check `next.config.ts` → `camera=(self)` not `camera=()` |
| No prompt         | User denied before → Lock icon 🔒 → Reset permissions    |
| Silent fail       | Missing env vars → Check `.env.local`                    |
| Call not found    | Host hasn't started → Wait or check `isHost`             |

**Quick checklist:**

- [ ] `next.config.ts` has `camera=(self), microphone=(self)`
- [ ] Stream API keys in `.env.local`
- [ ] Dev server restarted
- [ ] Browser permissions allowed
