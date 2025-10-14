import { vi } from "vitest";
import * as rateLimiterModule from "../../../lib/rateLimiter";

export type RedisMockStore = Map<string, string>;

export type RedisMock = {
  store: RedisMockStore;
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
  expire: ReturnType<typeof vi.fn>;
  flushall: ReturnType<typeof vi.fn>;
};

export function createRedisMock(
  initial: Record<string, string> = {}
): RedisMock {
  const store: RedisMockStore = new Map(Object.entries(initial));

  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
      return "OK";
    }),
    del: vi.fn(async (key: string) => Number(store.delete(key))),
    expire: vi.fn(async () => true),
    flushall: vi.fn(async () => {
      store.clear();
      return "OK";
    }),
  };
}

export function mockRateLimiterLimit(
  result: { success: boolean } = { success: true },
  limiter: "login" | "signup" = "login"
) {
  const targetLimiter = limiter === "login" 
    ? rateLimiterModule.loginLimiter 
    : rateLimiterModule.signupLimiter;
  
  const spy = vi
    .spyOn(targetLimiter, "limit")
    .mockResolvedValue(
      result as Awaited<ReturnType<typeof targetLimiter.limit>>
    );
  return spy;
}
