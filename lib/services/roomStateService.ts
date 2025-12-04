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
        message: `Room transitioned from "${currentStatus}" to "${newStatus}"`,
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
      const result = await roomsCollection.updateOne(
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
              metadata,
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
        message: `Room transitioned from "${currentStatus}" to "${newStatus}"`,
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
}
