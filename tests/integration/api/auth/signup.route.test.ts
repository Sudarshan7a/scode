import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/auth/signup/route";
import { createNextRequest } from "@/tests/mocks/next";
import { mockConnectToMongo } from "@/tests/mocks/db";
import { mockRateLimiterLimit } from "@/tests/mocks/redis";

// Mock external dependencies
vi.mock("@/lib/sendActionToken", () => ({
  sendActionToken: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/refreshSession", () => ({
  issueRefreshSession: vi.fn().mockResolvedValue("mock-refresh-token"),
  setAuthCookies: vi.fn(),
}));

vi.mock("@/lib/getIp", () => ({
  getIP: vi.fn().mockReturnValue("192.168.1.1"),
}));

// Mock createUser service  
vi.mock("@/app/api/auth/signup/service", () => ({
  createUser: vi.fn(),
}));

// Mock email domain validation
vi.mock("@/types/mogodbValidation", () => ({
  isEmailDomainAllowed: vi.fn().mockReturnValue(true),
  allowedEmailDomains: ["example.com", "test.com"],
}));

import { sendActionToken } from "@/lib/sendActionToken";
import { issueRefreshSession, setAuthCookies } from "@/lib/refreshSession";
import { isEmailDomainAllowed } from "@/types/mogodbValidation";
import { createUser } from "@/app/api/auth/signup/service";

describe("POST /api/auth/signup", () => {
  let mongoMocks: ReturnType<typeof mockConnectToMongo>;
  let rateLimiterSpy: ReturnType<typeof mockRateLimiterLimit>;

  beforeEach(() => {
    vi.clearAllMocks();
    mongoMocks = mockConnectToMongo();
    rateLimiterSpy = mockRateLimiterLimit({ success: true }, "signup");
    // Reset isEmailDomainAllowed to return true by default
    (isEmailDomainAllowed as ReturnType<typeof vi.fn>).mockReturnValue(true);
    // Reset issueRefreshSession to return the mock token
    (issueRefreshSession as ReturnType<typeof vi.fn>).mockResolvedValue("mock-refresh-token");
    // Set up createUser mock default behavior
    (createUser as ReturnType<typeof vi.fn>).mockImplementation(async (email: string) => {
      // Simulate duplicate email check
      if (email === "existing@example.com") {
        return { error: "User already exists", status: 409 };
      }
      // Return successful user creation
      return {
        userId: "mock-user-id-123",
        user: {
          email,
          name: "testuser",
          role: "user",
          emailVerified: false,
          createdAt: new Date(),
        },
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rate Limiting", () => {
    it("returns 429 when rate limit is exceeded", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: false } as never);

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.ok).toBe(false);
      expect(data.message).toContain("Too many");
    });
  });

  describe("Input Validation", () => {
    it("returns 400 when email is missing", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("returns 400 when password is missing", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@example.com",
          username: "testuser",
          confirmPassword: "SecurePass123!",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("returns 400 for invalid email format", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "not-an-email",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 400 for disallowed email domain", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });
      (isEmailDomainAllowed as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@blocked-domain.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("returns 400 for weak password (Zod validation)", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "weak",
          confirmPassword: "weak",
          username: "testuser",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("Signup Process", () => {
    it("returns 409 for duplicate email", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "existing@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("successfully creates user and sends verification email", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "newuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.message).toBeDefined();
      expect(data.redirect).toBe("/check-email");

      // Verify verification email was sent
      expect(sendActionToken).toHaveBeenCalledWith({
        action: "verification",
        userId: "mock-user-id-123",
        email: "newuser@example.com",
      });
    });

    it("issues refresh session on successful signup", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "newuser",
        },
      });

      const response = await POST(request);

      expect(issueRefreshSession).toHaveBeenCalledWith(
        "mock-user-id-123",
        expect.objectContaining({ rotate: true })
      );

      expect(setAuthCookies).toHaveBeenCalledWith(
        response,
        "mock-refresh-token",
        "mock-user-id-123"
      );
    });

    it("handles optional username field", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "optionaluser",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("returns 500 when database connection fails", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });
      // Mock createUser to return a database error
      (createUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        error: "Database connection failed",
        status: 500,
      });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("returns 500 when email sending fails", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });
      (sendActionToken as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Email service unavailable")
      );

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "newuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("returns 500 when session issuance fails", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });
      (issueRefreshSession as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("JWT signing failed")
      );

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "newuser",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.ok).toBe(false);
      expect(data.message).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("handles email with uppercase characters", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "TestUser@Example.COM",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("trims whitespace from email", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "  test@example.com  ",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "testuser",
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("handles empty string username", async () => {
      rateLimiterSpy.mockResolvedValueOnce({ success: true });

      const request = createNextRequest({
        url: "/api/auth/signup",
        method: "POST",
        body: {
          email: "test@example.com",
          password: "SecurePass123!",
          confirmPassword: "SecurePass123!",
          username: "",
        },
      });

      const response = await POST(request);
      // Should fail - empty username is not allowed (min 2 chars)
      expect(response.status).toBe(400);
    });
  });
});
