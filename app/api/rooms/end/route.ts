import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "./../../../../lib/authMiddleware";
import { connectToMongo } from "./../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Function to notify WebSocket server about room ending
async function notifyWebSocketServer(roomId: string) {
  try {
    const wsUrl =
      process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN || "ws://localhost:1234";

    // Convert ws:// to http:// for API calls
    const httpUrl = wsUrl
      .replace(/^ws:\/\//, "http://")
      .replace(/^wss:\/\//, "https://");

    console.log(
      `Attempting to notify WebSocket server at: ${httpUrl}/api/rooms/${roomId}/end`
    );

    // Send room end notification to WebSocket server
    const response = await fetch(`${httpUrl}/api/rooms/${roomId}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    console.log(`WebSocket server response status: ${response.status}`);
    console.log(
      `WebSocket server response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`WebSocket server error response: ${errorText}`);
      throw new Error(
        `WebSocket server responded with ${response.status}: ${errorText}`
      );
    }

    // Try to parse as JSON, fallback to text if it fails
    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    console.log("WebSocket server notification result:", result);
  } catch (error) {
    console.warn("Failed to notify WebSocket server about room ending:", error);
    // Don't fail the room ending if WebSocket notification fails
  }
}

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { roomId } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID format" },
        { status: 400 }
      );
    }

    const { roomsCollection } = await connectToMongo();

    // Find the room and verify host permissions
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify that the current user is the host
    if (String(room.ownerId) !== userId) {
      return NextResponse.json(
        { error: "Only the host can end the session" },
        { status: 403 }
      );
    }

    // Check if room is already ended
    if (room.status === "ended") {
      return NextResponse.json(
        { error: "Session is already ended" },
        { status: 400 }
      );
    }

    // Update room status to ended
    const endedAt = new Date();
    const updateResult = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      {
        $set: {
          status: "ended",
          endedAt: endedAt,
          endedBy: new ObjectId(userId),
          updatedAt: endedAt,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to end session" },
        { status: 500 }
      );
    }

    // Notify WebSocket server about room ending
    await notifyWebSocketServer(roomId);

    return NextResponse.json({
      status: "success",
      message: "Session ended successfully",
      roomId: roomId,
      endedAt: endedAt,
    });
  } catch (error) {
    console.error("Error ending session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
