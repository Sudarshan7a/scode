import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import { RoomStateService } from "@/lib/services/roomStateService";
import { UpdateRoomStateRequestSchema } from "@/lib/schemas/roomStateSchema";
import { roomUpdateLimiter } from "@/lib/rateLimiter";

/**
 * POST /api/rooms/update-state
 * Updates the state of a room (e.g., scheduled → live → ended)
 *
 * Requires authentication
 * Rate limited: 30 requests per 5 minutes per user
 *
 * Request body:
 * {
 *   "roomId": "string",
 *   "newStatus": "live" | "scheduled" | "ended" | "saved",
 *   "metadata": {
 *     "reason": "optional string",
 *     "notes": "optional string"
 *   }
 * }
 *
 * Response:
 * {
 *   "success": boolean,
 *   "roomId": "string",
 *   "oldStatus": "string",
 *   "newStatus": "string",
 *   "updatedAt": "ISO 8601 timestamp",
 *   "message": "optional success message"
 * }
 */
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    // Rate limiting by userId
    const { success: rateLimitSuccess } = await roomUpdateLimiter.limit(
      userId
    );

    if (!rateLimitSuccess) {
      console.warn(
        `[RateLimit] Room state update blocked: user ${userId} (too many requests)`
      );
      return NextResponse.json(
        {
          error:
            "Too many room state update requests. Maximum 30 per 5 minutes. Please slow down.",
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const bodyData = await request.json();
    const validationResult = UpdateRoomStateRequestSchema.safeParse(bodyData);

    if (!validationResult.success) {
      console.warn("[UpdateState] Validation failed:", validationResult.error);
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { roomId, newStatus, metadata } = validationResult.data;

    console.log(
      `[UpdateState] User ${userId} attempting to update room ${roomId} to ${newStatus}`
    );

    // Call service layer
    const result = await RoomStateService.updateRoomStateWithHistoryAndNotification(
      roomId,
      newStatus,
      userId,
      metadata
    );

    if (!result.success) {
      console.error(`[UpdateState] Failed to update room ${roomId}:`, result.error);
      return NextResponse.json(
        {
          error: "Failed to update room state",
          message: result.error,
        },
        { status: 400 }
      );
    }

    console.log(
      `[UpdateState] Successfully updated room ${roomId} from ${result.oldStatus} to ${result.newStatus}`
    );

    return NextResponse.json(
      {
        success: result.success,
        roomId: result.roomId,
        oldStatus: result.oldStatus,
        newStatus: result.newStatus,
        updatedAt: result.updatedAt.toISOString(),
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UpdateState] Unexpected error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
});
