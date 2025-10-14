import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/rooms/create/route";
import { createNextRequest } from "@/tests/mocks/next";
import { mockConnectToMongo } from "@/tests/mocks/db";
import { ObjectId } from "mongodb";

// Mock auth middleware to bypass authentication for testing
vi.mock("@/lib/authMiddleware", () => ({
  withAuth: (handler: (req: Request) => unknown) => handler,
}));

describe("POST /api/rooms/create", () => {
  let mongoMocks: ReturnType<typeof mockConnectToMongo>;
  const mockUserId = new ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
    mongoMocks = mockConnectToMongo();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authorization", () => {
    it("returns 401 when userId cookie is missing", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          duration: 60,
        },
        // No cookies provided
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Input Validation", () => {
    it("returns 400 when title is missing", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          duration: 60,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("returns 400 when title is empty string", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "",
          duration: 60,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid duration (negative number)", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          duration: -30,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid duration (zero)", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          duration: 0,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 400 for non-integer duration", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          duration: 45.5,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("Successful Room Creation", () => {
    it("creates room with minimal fields", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Minimal Room",
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe("Room created successfully");
      expect(data.roomId).toBe(insertedId.toString());

      expect(mongoMocks.collections.roomsCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Minimal Room",
          ownerId: expect.any(ObjectId),
          isPrivate: false,
          duration: 30, // default
          scheduledAt: null,
          description: null,
          language: null,
          status: "scheduled",
        })
      );
    });

    it("creates room with all optional fields", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const scheduledDate = new Date("2025-12-25T10:00:00Z").toISOString();

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Complete Room",
          duration: 90,
          scheduledAt: scheduledDate,
          description: "A test room with all fields",
          language: "javascript",
          isPrivate: true,
          status: "live",
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe("Room created successfully");
      expect(data.roomId).toBe(insertedId.toString());

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall).toMatchObject({
        title: "Complete Room",
        duration: 90,
        description: "A test room with all fields",
        language: "javascript",
        isPrivate: true,
        status: "live",
      });
      expect(insertCall.scheduledAt).toBeInstanceOf(Date);
      expect(insertCall.createdAt).toBeInstanceOf(Date);
    });

    it("converts userId string to ObjectId", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
        },
        cookies: { userId: mockUserId },
      });

      await POST(request);

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall.ownerId).toBeInstanceOf(ObjectId);
      expect(insertCall.ownerId.toString()).toBe(mockUserId);
    });

    it("defaults isPrivate to false when not provided", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Public Room",
        },
        cookies: { userId: mockUserId },
      });

      await POST(request);

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall.isPrivate).toBe(false);
    });

    it("respects isPrivate=true when provided", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Private Room",
          isPrivate: true,
        },
        cookies: { userId: mockUserId },
      });

      await POST(request);

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall.isPrivate).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 when MongoDB insertion fails", async () => {
      mongoMocks.collections.roomsCollection.insertOne.mockRejectedValueOnce(
        new Error("Database write error")
      );

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain("Database write error");
    });

    it("returns 500 when database connection fails", async () => {
      mongoMocks.spy.mockRejectedValueOnce(new Error("Connection timeout"));

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it("returns 500 for invalid ObjectId in userId cookie", async () => {
      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
        },
        cookies: { userId: "invalid-object-id" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("handles null scheduledAt gracefully", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          scheduledAt: null,
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall.scheduledAt).toBeNull();
    });

    it("handles empty description as null", async () => {
      const insertedId = new ObjectId();
      mongoMocks.collections.roomsCollection.insertOne.mockResolvedValueOnce({
        insertedId,
        acknowledged: true,
      });

      const request = createNextRequest({
        url: "/api/rooms/create",
        method: "POST",
        body: {
          title: "Test Room",
          description: "",
        },
        cookies: { userId: mockUserId },
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const insertCall = mongoMocks.collections.roomsCollection.insertOne.mock.calls[0][0];
      expect(insertCall.description).toBe("");
    });
  });
});
