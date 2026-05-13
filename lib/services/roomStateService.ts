import { ObjectId } from "mongodb";
import { connectToMongo } from "@/lib/mongodb";
import {
  RoomState,
  UpdateStateMetadata,
  isValidStateTransition,
  getTransitionErrorMessage,
} from "@/lib/schemas/roomStateSchema";

export interface UpdateStateResult {
  success: boolean;
  roomId: string;
  oldStatus: RoomState;
  newStatus: RoomState;
  updatedAt: Date;
  message?: string;
  error?: string;
}

/**
 * Notify WebSocket server about room state change
 */
async function notifyWebSocketServer(
  roomId: string,
  oldStatus: RoomState,
  newStatus: RoomState,
  userId: string
): Promise<void> {
  try {
    const wsUrl =
      process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN || "ws://localhost:1234";

    // Convert ws:// to http:// for API calls
    const httpUrl = wsUrl
      .replace(/^ws:\/\//, "http://")
      .replace(/^wss:\/\//, "https://")
      .replace(/\/$/, ""); // Remove trailing slash

    const response = await fetch(`${httpUrl}/api/rooms/${roomId}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        event: "roomStateChanged",
        oldStatus,
        newStatus,
        changedBy: userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn(
        `WebSocket server responded with ${response.status} for room state change`
      );
      // Don't throw - WebSocket notification is non-critical
    }
  } catch (error) {
    console.warn(
      "Failed to notify WebSocket server about room state change:",
      error
    );
    // Don't throw - WebSocket notification is non-critical
  }
}

/**
 * Service for handling room state transitions
 */
export class RoomStateService {
  /**
   * Verify user is room owner or collaborator with host role
   */
  static async verifyRoomAccess(
    roomId: string,
    userId: string
  ): Promise<{ isHost: boolean; isCollaborator: boolean }> {
    const { roomsCollection } = await connectToMongo();

    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    if (!room) {
      throw new Error("Room not found");
    }

    const isHost = room.ownerId.toString() === userId;
    const isCollaborator = room.collaborators?.some(
      (c: { userId: ObjectId; role: string }) =>
        c.userId.toString() === userId && c.role === "host"
    );

    return {
      isHost,
      isCollaborator: isCollaborator || false,
    };
  }

  /**
   * Get current room status
   */
  static async getRoomStatus(roomId: string): Promise<RoomState> {
    const { roomsCollection } = await connectToMongo();

    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    if (!room) {
      throw new Error("Room not found");
    }

    return room.status as RoomState;
  }

  /**
   * Update room state
   */
  static async updateRoomState(
    roomId: string,
    newStatus: RoomState,
    userId: string,
    metadata?: UpdateStateMetadata
  ): Promise<UpdateStateResult> {
    try {
      // Verify user has access
      const access = await this.verifyRoomAccess(roomId, userId);
      if (!access.isHost && !access.isCollaborator) {
        throw new Error(
          "Only room hosts or host collaborators can update room state"
        );
      }

      // Get current status
      const currentStatus = await this.getRoomStatus(roomId);

      // Validate transition
      if (!isValidStateTransition(currentStatus, newStatus)) {
        throw new Error(
          getTransitionErrorMessage(currentStatus, newStatus)
        );
      }

      // Update in database
      const { roomsCollection } = await connectToMongo();

      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date(),
        [`${newStatus}At`]: new Date(), // Set statusAt field (liveAt, endedAt, savedAt)
      };

      // Add metadata if provided
      if (metadata) {
        updateData.stateMetadata = {
          ...metadata,
          changedBy: userId,
          changedAt: new Date(),
          previousStatus: currentStatus,
        };
      }

      const result = await roomsCollection.updateOne(
        { _id: new ObjectId(roomId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error("Room not found during update");
      }

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update room status");
      }

      return {
        success: true,
        roomId,
        oldStatus: currentStatus,
        newStatus,
        updatedAt: new Date(),
        message:
          newStatus === "ended"
            ? "Room session ended successfully."
            : undefined,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        roomId,
        oldStatus: (await this.getRoomStatus(roomId)) as RoomState,
        newStatus,
        updatedAt: new Date(),
        error: errorMessage,
      };
    }
  }

  /**
   * Update room state with WebSocket notification
   */
  static async updateRoomStateWithNotification(
    roomId: string,
    newStatus: RoomState,
    userId: string,
    metadata?: UpdateStateMetadata
  ): Promise<UpdateStateResult> {
    try {
      // Get current status before update
      const currentStatus = await this.getRoomStatus(roomId);

      // Perform the update
      const result = await this.updateRoomState(roomId, newStatus, userId, metadata);

      // Notify WebSocket server if update was successful
      if (result.success) {
        // Fire and forget - don't wait for WebSocket notification
        notifyWebSocketServer(roomId, currentStatus, newStatus, userId).catch(
          (error) => {
            console.warn(
              "WebSocket notification failed but room state was updated:",
              error
            );
          }
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const currentStatus = await this.getRoomStatus(roomId);
      return {
        success: false,
        roomId,
        oldStatus: currentStatus as RoomState,
        newStatus,
        updatedAt: new Date(),
        error: errorMessage,
      };
    }
  }

  /**
   * Update room state with state history tracking
   */
  static async updateRoomStateWithHistory(
    roomId: string,
    newStatus: RoomState,
    userId: string,
    metadata?: UpdateStateMetadata
  ): Promise<UpdateStateResult> {
    const { roomsCollection } = await connectToMongo();

    try {
      // Verify user has access
      const access = await this.verifyRoomAccess(roomId, userId);
      if (!access.isHost && !access.isCollaborator) {
        throw new Error(
          "Only room hosts or host collaborators can update room state"
        );
      }

      // Get current status
      const currentStatus = await this.getRoomStatus(roomId);

      // Validate transition
      if (!isValidStateTransition(currentStatus, newStatus)) {
        throw new Error(
          getTransitionErrorMessage(currentStatus, newStatus)
        );
      }

      const now = new Date();

      // Update with history push
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (roomsCollection as any).updateOne(
        { _id: new ObjectId(roomId) },
        {
          $set: {
            status: newStatus,
            updatedAt: now,
            [`${newStatus}At`]: now,
          },
          $push: {
            stateHistory: {
              from: currentStatus,
              to: newStatus,
              changedBy: userId,
              changedAt: now,
              metadata: metadata || {},
            },
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Room not found during update");
      }

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update room status");
      }

      return {
        success: true,
        roomId,
        oldStatus: currentStatus,
        newStatus,
        updatedAt: now,
        message:
          newStatus === "ended"
            ? "Room session ended successfully."
            : undefined,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const currentStatus = await this.getRoomStatus(roomId);
      return {
        success: false,
        roomId,
        oldStatus: currentStatus as RoomState,
        newStatus,
        updatedAt: new Date(),
        error: errorMessage,
      };
    }
  }

  /**
   * Update room state with history tracking and WebSocket notification
   */
  static async updateRoomStateWithHistoryAndNotification(
    roomId: string,
    newStatus: RoomState,
    userId: string,
    metadata?: UpdateStateMetadata
  ): Promise<UpdateStateResult> {
    try {
      // Get current status before update
      const currentStatus = await this.getRoomStatus(roomId);

      // Perform the update with history
      const result = await this.updateRoomStateWithHistory(
        roomId,
        newStatus,
        userId,
        metadata
      );

      // Notify WebSocket server if update was successful
      if (result.success) {
        // Fire and forget - don't wait for WebSocket notification
        notifyWebSocketServer(roomId, currentStatus, newStatus, userId).catch(
          (error) => {
            console.warn(
              "WebSocket notification failed but room state was updated:",
              error
            );
          }
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const currentStatus = await this.getRoomStatus(roomId);
      return {
        success: false,
        roomId,
        oldStatus: currentStatus as RoomState,
        newStatus,
        updatedAt: new Date(),
        error: errorMessage,
      };
    }
  }
}
