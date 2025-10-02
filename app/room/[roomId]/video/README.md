# Video Module

This directory contains all video call functionality using Stream Video SDK. The code is organized into focused, single-responsibility modules for improved maintainability.

## Module Structure

### Core Files

#### `index.ts`
Central export point for all video utilities. Import from this file to access any video functionality:

```typescript
import { usePreJoinResources, useCameraPreview, applyInitialDeviceState } from './video';
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
Camera and microphone state management.

**Exports:**
- `applyInitialDeviceState(call: Call, state: DeviceState)` - Sets camera/mic state before joining

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
  isHost
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
  applyInitialDeviceState
} from './video';

function PreJoinPanel({ roomId, isHost }) {
  // Initialize video resources
  const { status, client, call, error } = usePreJoinResources({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    roomId,
    isHost
  });

  // Manage camera preview
  const { previewError, markJoined } = useCameraPreview(call);

  // Apply device state before joining
  const handleJoin = async () => {
    await applyInitialDeviceState(call, {
      micMuted: false,
      cameraMuted: false
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
