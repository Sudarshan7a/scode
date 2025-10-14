import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import { createNextRequest } from "@/tests/mocks/next";
import { mockConnectToMongo, mockRateLimiterLimit } from "@/tests/mocks/db";
import { ObjectId } from "mongodb";

// Mock external dependencies
vi.mock("@/auth/core/passwordHasher");
vi.mock("@/lib/sendActionToken");
vi.mock("@/lib/refreshSession");

const originalEnv = { ...process.env };

describe("POST /api/auth/login", () => {
  let mongoMocks: ReturnType<typeof mockConnectToMongo>;
  let rateLimiterSpy: ReturnType<typeof mockRateLimiterLimit>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      JWT_SECRET: "test-secret-key-32-characters-min",
    };
    
    mongoMocks = mockConnectToMongo();
    rateLimiterSpy = mockRateLimiterLimit({ success: true });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  describe("Rate Limiting", () => {
    it("returns 429 when rate limit exceeded", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: false } as never);

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: { email: "test@example.com", password: "Password123!" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.message).toContain("Too many login attempts");
    });
  });

  describe("Input Validation", () => {
    it("returns 400 for invalid input (Zod validation failure)", async () => {
      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: { email: "not-an-email", password: "" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
      expect(data.message).toContain("Invalid input data");
    });

    it("returns 400 when email is missing", async () => {
      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: { password: "password123" },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 400 when password is missing", async () => {
      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: { email: "test@example.com" },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("Authentication", () => {
    it("returns 404 when user not found", async () => {
      mongoMocks.collections.usersCollection.findOne.mockResolvedValueOnce(null);

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "nonexistent@example.com",
          password: "Password123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.ok).toBe(false);
      expect(data.message).toBe("User not found");
    });

    it("returns 401 for invalid password", async () => {
      const { verifyPassword } = await import("@/auth/core/passwordHasher");
      vi.mocked(verifyPassword).mockResolvedValueOnce(false);

      mongoMocks.collections.usersCollection.findOne.mockResolvedValueOnce({
        _id: new ObjectId(),
        email: "test@example.com",
        passwordHash: "hashed_password",
        name: "Test User",
        emailVerified: true,
      });

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "WrongPass123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.ok).toBe(false);
      expect(data.message).toContain("Invalid password");
    });

    it("returns 403 for unverified email and sends verification", async () => {
      const { verifyPassword } = await import("@/auth/core/passwordHasher");
      const { sendActionToken } = await import("@/lib/sendActionToken");
      
      vi.mocked(verifyPassword).mockResolvedValueOnce(true);

      const userId = new ObjectId();
      mongoMocks.collections.usersCollection.findOne.mockResolvedValueOnce({
        _id: userId,
        email: "unverified@example.com",
        passwordHash: "hashed_password",
        name: "Unverified User",
        emailVerified: false,
      });

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "unverified@example.com",
          password: "Password123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.ok).toBe(false);
      expect(data.message).toContain("verify your email");
      expect(data.redirect).toBe("/check-email");
      expect(sendActionToken).toHaveBeenCalledWith({
        action: "verification",
        userId: userId.toString(),
        email: "unverified@example.com",
      });
    });

    it("successfully logs in verified user and sets cookies", async () => {
      const { verifyPassword } = await import("@/auth/core/passwordHasher");
      const { issueRefreshSession, setAuthCookies } = await import(
        "@/lib/refreshSession"
      );

      vi.mocked(verifyPassword).mockResolvedValueOnce(true);
      vi.mocked(issueRefreshSession).mockResolvedValueOnce("refresh-token-123");
      vi.mocked(setAuthCookies).mockImplementation((res) => res);

      const userId = new ObjectId();
      mongoMocks.collections.usersCollection.findOne.mockResolvedValueOnce({
        _id: userId,
        email: "verified@example.com",
        passwordHash: "hashed_password",
        name: "Verified User",
        emailVerified: true,
      });

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "verified@example.com",
          password: "Password123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.message).toBe("Login successful");
      expect(data.user).toEqual({
        id: userId.toString(),
        name: "Verified User",
      });
      expect(data.redirect).toBe("/dashboard");

      expect(issueRefreshSession).toHaveBeenCalledWith(userId.toString(), {
        rotate: true,
      });
      expect(setAuthCookies).toHaveBeenCalledWith(
        expect.anything(),
        "refresh-token-123",
        userId.toString()
      );
    });
  });

  describe("Error Handling", () => {
    it("returns 500 for database connection errors", async () => {
      mongoMocks.spy.mockRejectedValueOnce(new Error("DB connection failed"));

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "Password123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.ok).toBe(false);
      expect(data.message).toBe("Internal server error");
    });

    it("returns 500 for unexpected errors during authentication", async () => {
      const { verifyPassword } = await import("@/auth/core/passwordHasher");
      
      mongoMocks.collections.usersCollection.findOne.mockResolvedValueOnce({
        _id: new ObjectId(),
        email: "test@example.com",
        passwordHash: "hashed_password",
        name: "Test User",
        emailVerified: true,
      });

      vi.mocked(verifyPassword).mockRejectedValueOnce(
        new Error("Crypto error")
      );

      const request = createNextRequest({
        url: "/api/auth/login",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "Password123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.ok).toBe(false);
    });
  });
});
