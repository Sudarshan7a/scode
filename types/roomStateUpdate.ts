import { RoomState } from "@/lib/schemas/roomStateSchema";

/**
 * Request payload for room state update
 */
export interface RoomStateUpdateRequest {
  roomId: string;
  newStatus: RoomState;
  metadata?: {
    reason?: string;
    notes?: string;
    error?: string;
  };
}

/**
 * Response from room state update API
 */
export interface RoomStateUpdateResponse {
  success: boolean;
  roomId: string;
  oldStatus: RoomState;
  newStatus: RoomState;
  updatedAt: string;
  message?: string;
  error?: string;
}

/**
 * Error response from room state update API
 */
export interface RoomStateUpdateError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
