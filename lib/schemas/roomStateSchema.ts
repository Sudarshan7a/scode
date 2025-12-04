import { z } from "zod";

/**
 * Room status states
 */
export const RoomStateEnum = z.enum(["scheduled", "live", "ended", "saved"]);
export type RoomState = z.infer<typeof RoomStateEnum>;

/**
 * Valid state transitions
 * Maps from current state to allowed next states
 */
export const VALID_STATE_TRANSITIONS: Record<RoomState, RoomState[]> = {
  scheduled: ["live", "ended"], // Can start or cancel
  live: ["ended"], // Can only end
  ended: ["saved"], // Can archive to saved
  saved: [], // Terminal state - no transitions
};

/**
 * Metadata for specific state transitions
 */
export const UpdateStateMetadataSchema = z
  .object({
    reason: z.string().optional(), // Cancellation reason, etc.
    endedBy: z.string().optional(), // Who ended it
    endedAt: z.string().datetime().optional(), // Timestamp
    notes: z.string().optional(), // Any notes about the transition
    error: z.string().optional(), // Error message if transition failed
  })
  .strict();

export type UpdateStateMetadata = z.infer<typeof UpdateStateMetadataSchema>;

/**
 * Room state update request schema
 */
export const UpdateRoomStateRequestSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  newStatus: RoomStateEnum,
  metadata: UpdateStateMetadataSchema.optional(),
});

export type UpdateRoomStateRequest = z.infer<
  typeof UpdateRoomStateRequestSchema
>;

/**
 * Room state update response schema
 */
export const UpdateRoomStateResponseSchema = z.object({
  success: z.boolean(),
  roomId: z.string(),
  oldStatus: RoomStateEnum,
  newStatus: RoomStateEnum,
  updatedAt: z.string().datetime(),
  message: z.string().optional(),
});

export type UpdateRoomStateResponse = z.infer<
  typeof UpdateRoomStateResponseSchema
>;

/**
 * Validate if a state transition is allowed
 */
export function isValidStateTransition(
  currentState: RoomState,
  newState: RoomState
): boolean {
  if (currentState === newState) {
    return false; // Can't transition to the same state
  }
  const allowedTransitions = VALID_STATE_TRANSITIONS[currentState];
  return allowedTransitions.includes(newState);
}

/**
 * Get human-readable error message for invalid transitions
 */
export function getTransitionErrorMessage(
  currentState: RoomState,
  newState: RoomState
): string {
  if (currentState === newState) {
    return `Room is already in "${newState}" state`;
  }
  const allowed = VALID_STATE_TRANSITIONS[currentState];
  if (allowed.length === 0) {
    return `Cannot transition from "${currentState}" state - it is a terminal state`;
  }
  return `Cannot transition from "${currentState}" to "${newState}". Allowed transitions: ${allowed.join(", ")}`;
}
