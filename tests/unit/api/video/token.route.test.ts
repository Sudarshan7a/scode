import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { GET } from "@/app/api/video/token/route";
import { createStreamClientMock } from "@/tests/mocks/stream";

const originalEnv = { ...process.env };

let cookiesStore: Record<string, string> = {};
let streamClientMock = createStreamClientMock();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      const value = cookiesStore[name];
      return value ? { name, value } : undefined;
    },
  })),
}));

vi.mock("@stream-io/node-sdk", () => ({
  StreamClient: vi.fn(() => streamClientMock),
}));

describe("GET /api/video/token", () => {
  beforeEach(() => {
    cookiesStore = {};
    streamClientMock = createStreamClientMock();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_STREAM_API_KEY = "test_api_key";
    process.env.STREAM_API_SECRET = "test_api_secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  it("returns 500 when API key is missing", async () => {
    delete process.env.NEXT_PUBLIC_STREAM_API_KEY;
    delete process.env.STREAM_API_SECRET;

    const response = await GET({} as never);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({
      ok: false,
      message:
        "Video service not configured (missing STREAM_API_KEY / STREAM_API_SECRET)",
    });
  });

  it("returns 401 when user cookie is missing", async () => {
    const response = await GET({} as never);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ ok: false, message: "Authentication required" });
  });

  it("returns 400 when user id is invalid", async () => {
    cookiesStore.userId = "invalid";

    const response = await GET({} as never);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ ok: false, message: "Invalid user id" });
  });

  it("returns token payload when successful", async () => {
    const userId = "507f1f77bcf86cd799439011";
    cookiesStore.userId = userId;

    const response = await GET({} as never);

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(streamClientMock.upsertUsers).toHaveBeenCalledWith([
      expect.objectContaining({ id: userId }),
    ]);
    expect(streamClientMock.generateUserToken).toHaveBeenCalledWith({
      user_id: userId,
      validity_in_seconds: 3600,
    });

    expect(body).toMatchObject({
      ok: true,
      token: "test-token",
      userId,
      validitySeconds: 3600,
      user: expect.objectContaining({ id: userId }),
    });
  });

  it("handles Stream client errors", async () => {
    cookiesStore.userId = "507f1f77bcf86cd799439011";
    streamClientMock.upsertUsers.mockRejectedValueOnce(
      new Error("Stream failure")
    );

    const response = await GET({} as never);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ ok: false, message: "Failed to generate token" });
  });
});
