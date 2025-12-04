# Room State Update API Documentation

## Overview

The Room State Update API provides a unified mechanism for transitioning rooms between different states within the S-Code platform. This API handles validation of state transitions, tracks history, and notifies connected clients via WebSocket.

## API Endpoint

```
POST /api/rooms/update-state
```

## Authentication

**Required:** Yes (Bearer token in Authorization header)

**Rate Limit:** 30 requests per 5 minutes per user

## Request Body

```json
{
  "roomId": "string (required)",
  "newStatus": "live" | "scheduled" | "ended" | "saved" (required),
  "metadata": {
    "reason": "string (optional)",
    "notes": "string (optional)",
    "error": "string (optional)"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roomId` | string | Yes | The MongoDB ObjectId of the room to update |
| `newStatus` | enum | Yes | Target room status (live, scheduled, ended, saved) |
| `metadata.reason` | string | No | Reason for state change (e.g., cancellation reason) |
| `metadata.notes` | string | No | Additional notes about the transition |
| `metadata.error` | string | No | Error information if transition is due to error |

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "roomId": "507f1f77bcf86cd799439011",
  "oldStatus": "live",
  "newStatus": "ended",
  "updatedAt": "2025-12-04T10:30:00.000Z",
  "message": "Room transitioned from \"live\" to \"ended\""
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Failed to update room state",
  "message": "Cannot transition from \"ended\" to \"live\". Allowed transitions: saved"
}
```

### Rate Limit Response (429 Too Many Requests)

```json
{
  "error": "Too many room state update requests. Maximum 30 per 5 minutes. Please slow down."
}
```

### Authentication Error (401 Unauthorized)

```json
{
  "error": "No access token found"
}
```

## Valid State Transitions

```
scheduled ──→ live
       ↓
       └──→ ended
              ↓
            saved
```

| From State | Valid Transitions | Description |
|------------|-------------------|-------------|
| `scheduled` | `live`, `ended` | Room can be started or cancelled |
| `live` | `ended` | Room can only be ended |
| `ended` | `saved` | Room can be archived |
| `saved` | *(none)* | Terminal state - no transitions |

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | State transition successful |
| 400 | Bad Request | Invalid request body or invalid state transition |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission (not room host) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error during state update |

## Examples

### Example 1: Start a Scheduled Room

**Request:**
```bash
curl -X POST http://localhost:3000/api/rooms/update-state \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "507f1f77bcf86cd799439011",
    "newStatus": "live"
  }'
```

**Response:**
```json
{
  "success": true,
  "roomId": "507f1f77bcf86cd799439011",
  "oldStatus": "scheduled",
  "newStatus": "live",
  "updatedAt": "2025-12-04T10:15:00.000Z",
  "message": "Room transitioned from \"scheduled\" to \"live\""
}
```

### Example 2: End a Live Room with Notes

**Request:**
```bash
curl -X POST http://localhost:3000/api/rooms/update-state \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "507f1f77bcf86cd799439011",
    "newStatus": "ended",
    "metadata": {
      "notes": "Session completed successfully"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "roomId": "507f1f77bcf86cd799439011",
  "oldStatus": "live",
  "newStatus": "ended",
  "updatedAt": "2025-12-04T10:45:00.000Z",
  "message": "Room transitioned from \"live\" to \"ended\""
}
```

### Example 3: Invalid Transition (Error)

**Request:**
```bash
curl -X POST http://localhost:3000/api/rooms/update-state \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "507f1f77bcf86cd799439011",
    "newStatus": "live"
  }'
```

**Response (with room already ended):**
```json
{
  "error": "Failed to update room state",
  "message": "Cannot transition from \"ended\" to \"live\". Allowed transitions: saved"
}
```

## Frontend Integration

### Using the Hook

```typescript
"use client";

import { useRoomStateUpdate } from "@/hooks/useRoomStateUpdate";

export function RoomControlPanel({ roomId }: { roomId: string }) {
  const { updateState, isLoading, error } = useRoomStateUpdate({
    showToast: true,
    onSuccess: (response) => {
      console.log("Room state updated:", response);
      // Refresh room data or trigger UI updates
    },
  });

  const handleStartRoom = async () => {
    await updateState(roomId, "live");
  };

  const handleEndRoom = async () => {
    await updateState(roomId, "ended", {
      notes: "Session ended by host",
    });
  };

  return (
    <div>
      <button onClick={handleStartRoom} disabled={isLoading}>
        Start Room
      </button>
      <button onClick={handleEndRoom} disabled={isLoading}>
        End Room
      </button>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
```

## WebSocket Integration

When a room state is successfully updated, the API automatically notifies connected WebSocket clients:

```json
{
  "event": "roomStateChanged",
  "roomId": "507f1f77bcf86cd799439011",
  "oldStatus": "live",
  "newStatus": "ended",
  "changedBy": "user-id",
  "timestamp": "2025-12-04T10:45:00.000Z"
}
```

## Database Schema

### Room Document Updates

When a room state is updated, the following fields are modified:

```javascript
{
  _id: ObjectId,
  status: "live", // Updated
  updatedAt: Date, // Updated
  liveAt: Date, // Set when transitioning to "live"
  endedAt: Date, // Set when transitioning to "ended"
  savedAt: Date, // Set when transitioning to "saved"
  
  // State history tracking
  stateHistory: [
    {
      from: "scheduled",
      to: "live",
      changedBy: ObjectId,
      changedAt: Date,
      metadata: { /* optional metadata */ }
    },
    // ... more transitions
  ],
  
  // Current state metadata
  stateMetadata: {
    changedBy: ObjectId,
    changedAt: Date,
    previousStatus: "scheduled",
    reason: "Room started by host", // optional
    notes: "Session notes", // optional
  }
}
```

## Best Practices

1. **Check for loading state** before showing UI updates
2. **Handle errors gracefully** with user-friendly messages
3. **Use metadata** to provide context for state transitions
4. **Implement optimistic updates** while waiting for server response
5. **Listen to WebSocket events** for real-time state changes across clients
6. **Validate state transitions** on both client and server
7. **Track state history** for auditing purposes

## Limitations & Edge Cases

1. **Concurrent updates:** If multiple clients try to update the room simultaneously, the last update wins
2. **Terminal states:** Once a room reaches "saved", it cannot be transitioned further
3. **Authentication:** Only room owners or host collaborators can update room state
4. **Rate limiting:** Excessive requests will be throttled

## Future Enhancements

- [ ] Batch state updates for multiple rooms
- [ ] Scheduled state transitions (e.g., auto-end at specific time)
- [ ] State transition hooks for custom logic
- [ ] Rollback capability for state transitions
- [ ] State transition audit logs
