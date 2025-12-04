# Auto-End Room Feature

## Overview

This feature automatically transitions a room to "ended" state when the host closes their browser, navigates away from the room page, or explicitly clicks the "End Session" button. This ensures rooms are properly cleaned up even if the host doesn't manually end the session.

## Implementation Details

### Components

#### 1. `useRoomAutoEnd` Hook
**Location:** `hooks/useRoomAutoEnd.ts`

**Purpose:** Monitors page lifecycle events and automatically ends the room when the host leaves.

**Key Features:**
- Listens to `beforeunload` event (browser close/refresh)
- Listens to `visibilitychange` event (tab switch/minimize)
- Cleans up on component unmount (navigation within app)
- Uses `navigator.sendBeacon()` for reliable state updates during page unload
- Only active for hosts with live rooms

**Usage:**
```typescript
useRoomAutoEnd({
  roomId: string,
  isHost: boolean,
  isLive: boolean,
  enabled: boolean
});
```

#### 2. `ConfirmationDialog` Component
**Location:** `components/ui/ConfirmationDialog.tsx`

**Purpose:** Reusable confirmation dialog for destructive actions.

**Props:**
```typescript
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}
```

#### 3. Updated `useRoomController`
**Location:** `app/room/[roomId]/useRoomController.ts`

**Changes:**
- Integrated `useRoomAutoEnd` hook
- Updated `handleEndSession` to use new room state API
- Added toast notification for successful session end
- Uses `useRoomStateUpdate` hook for state transitions

#### 4. Updated `CollaborativeEditor`
**Location:** `app/room/[roomId]/CollaborativeEditor.tsx`

**Changes:**
- Added confirmation dialog before ending session
- Better UX with loading states
- Clear messaging about the impact of ending session

## State Transitions

### Manual End Session
1. Host clicks "End Session" button
2. Confirmation dialog appears
3. Host confirms
4. API call: `POST /api/rooms/update-state`
   - `newStatus: "ended"`
   - `metadata: { endReason: "manual", endedBy: "host-button" }`
5. Toast notification shown
6. Room state updated to "ended"
7. All participants see ended state

### Browser Close/Refresh
1. Host closes tab or refreshes page
2. `beforeunload` event fires
3. Confirmation browser dialog shown
4. `navigator.sendBeacon()` sends state update request
   - Uses Beacon API for reliable delivery
   - Works even as page is unloading
5. Room transitions to "ended" state
6. Metadata: `{ endReason: "auto-ended", endedBy: "host-page-unload" }`

### Navigation Away
1. Host navigates to different page (within app)
2. Component unmounts
3. Cleanup function in `useRoomAutoEnd` runs
4. Beacon API sends state update
5. Room transitions to "ended" state
6. Metadata: `{ endReason: "auto-ended", endedBy: "host-navigation" }`

### Tab Switch/Minimize
1. Host switches to different tab
2. `visibilitychange` event fires with `hidden` state
3. Beacon API sends state update as backup
4. Primary mechanism for handling unexpected closures

## API Integration

### Endpoint: `POST /api/rooms/update-state`

**Request:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "newStatus": "ended",
  "metadata": {
    "endReason": "manual",
    "endedBy": "host-button"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Room state updated successfully",
  "data": {
    "roomId": "507f1f77bcf86cd799439011",
    "previousStatus": "live",
    "newStatus": "ended",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

## Beacon API Implementation

### Why Beacon API?

The Beacon API is used for state updates during page unload because:

1. **Reliability:** Regular fetch/XHR requests are often cancelled during page unload
2. **Non-blocking:** Doesn't delay page navigation
3. **Browser Support:** Widely supported across modern browsers
4. **Guaranteed Delivery:** Browser queues the request and sends it even after page closes

### Implementation Details

```typescript
const payload = JSON.stringify({
  roomId,
  newStatus: "ended",
  metadata: {
    endReason: "auto-ended",
    endedBy: "host-page-unload",
  },
});

const blob = new Blob([payload], { type: "application/json" });
const beaconSent = navigator.sendBeacon("/api/rooms/update-state", blob);
```

### Authentication with Beacon

Since Beacon API has limited control over headers, authentication relies on:
- Cookies (automatically sent by browser)
- Session tokens stored in cookies

## Toast Notifications

### Added Toast Message
```typescript
TOAST_MESSAGES.ROOM.ENDED = "Room session ended successfully."
```

Used in `useRoomController` after successful manual end session.

## Testing

### Manual Testing Scenarios

1. **Manual End Session:**
   - Join a room as host
   - Click "End Session" button
   - Confirm dialog
   - Verify room transitions to "ended"
   - Verify toast notification

2. **Browser Close:**
   - Join a room as host
   - Close browser tab
   - Confirm browser dialog
   - Open new tab and check room status
   - Verify room is "ended"

3. **Browser Refresh:**
   - Join a room as host
   - Refresh page (F5 or Ctrl+R)
   - Confirm browser dialog
   - Verify room transitions to "ended"

4. **Navigation Within App:**
   - Join a room as host
   - Navigate to dashboard
   - Check room status
   - Verify room is "ended"

5. **Tab Switch:**
   - Join a room as host
   - Switch to different tab
   - Wait a few seconds
   - Return and verify room handling

### Automated Testing

```typescript
// Example test cases
describe('useRoomAutoEnd', () => {
  it('should end room on beforeunload', () => {
    // Test beacon API call on beforeunload
  });

  it('should end room on component unmount', () => {
    // Test cleanup function
  });

  it('should only work for hosts', () => {
    // Test isHost guard
  });

  it('should only work for live rooms', () => {
    // Test isLive guard
  });
});
```

## Edge Cases Handled

1. **Multiple End Attempts:** `hasAttemptedEndRef` prevents duplicate API calls
2. **Non-host Users:** Hook is disabled for non-hosts
3. **Non-live Rooms:** Hook is disabled when room is not live
4. **Token Expiration:** Graceful handling if auth token is missing
5. **Beacon Failure:** Console warning logged, but no blocking error
6. **Concurrent End Attempts:** Backend handles idempotent state transitions

## Browser Compatibility

### Beacon API Support
- ✅ Chrome 39+
- ✅ Firefox 31+
- ✅ Safari 11.1+
- ✅ Edge 14+

### Fallback Strategy
If Beacon API is not supported:
- Regular async API call attempted
- May not complete if page unloads quickly
- WebSocket disconnect can trigger server-side cleanup (future enhancement)

## Future Enhancements

1. **WebSocket Integration:**
   - Server detects host disconnect
   - Automatically end room after timeout
   - Redundant with client-side beacon

2. **Room Activity Monitoring:**
   - Track last host activity timestamp
   - Automatically end inactive rooms
   - Server-side cron job

3. **Participant Notifications:**
   - Show toast when host disconnects
   - Display reconnection timer
   - Allow participant promotion to host

4. **Analytics:**
   - Track end session reasons
   - Monitor beacon success rates
   - Identify connection issues

## Security Considerations

1. **Authorization:** Only room hosts can end sessions
2. **Rate Limiting:** 30 requests per 5 minutes per user
3. **State Validation:** Server validates state transitions
4. **Idempotency:** Safe to call multiple times
5. **XSS Protection:** All user inputs sanitized

## Performance Impact

- **Minimal:** Event listeners added only for host users with live rooms
- **No Polling:** Event-driven approach
- **Efficient Cleanup:** Single beacon call on exit
- **No Memory Leaks:** Proper cleanup in useEffect return

## Related Files

- `lib/schemas/roomStateSchema.ts` - State transition validation
- `lib/services/roomStateService.ts` - Business logic
- `app/api/rooms/update-state/route.ts` - API endpoint
- `types/roomStateUpdate.ts` - TypeScript types
- `docs/api/room-state-updates.md` - API documentation

## Troubleshooting

### Room Not Ending on Browser Close
1. Check browser console for beacon errors
2. Verify auth cookie is present
3. Check API endpoint logs
4. Confirm user is host
5. Verify room is in "live" state

### Confirmation Dialog Not Appearing
1. Check `showEndSessionDialog` state
2. Verify Dialog component import
3. Check z-index conflicts
4. Verify button onClick handler

### Multiple End Calls
1. Check `hasAttemptedEndRef` flag
2. Verify event listener cleanup
3. Check for duplicate hook instances

## Commits

1. `feat(room): add useRoomAutoEnd hook for automatic room cleanup on page close/navigation`
2. `feat(room): integrate auto-end logic and new state API in useRoomController`
3. `feat(ui): add confirmation dialog for end session with better UX`
