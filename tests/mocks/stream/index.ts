import { vi } from "vitest";

export type StreamClientMock = {
  upsertUsers: ReturnType<typeof vi.fn>;
  generateUserToken: ReturnType<typeof vi.fn>;
};

export function createStreamClientMock(): StreamClientMock {
  return {
    upsertUsers: vi.fn().mockResolvedValue(undefined),
    generateUserToken: vi.fn().mockReturnValue("test-token"),
  };
}
