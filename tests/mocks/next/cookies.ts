import { vi } from "vitest";

type CookieValue = string | undefined;

export type MockCookie = {
  name: string;
  value: string;
};

export interface MockCookies {
  get: (name: string) => MockCookie | undefined;
  getAll: () => MockCookie[];
  has: (name: string) => boolean;
  set: (name: string, value: string) => void;
  delete: (name: string) => void;
  clear: () => void;
  toHeader: () => string | undefined;
}

const serializeCookieHeader = (cookies: Iterable<MockCookie>) => {
  const parts = [] as string[];
  for (const { name, value } of cookies) {
    parts.push(`${name}=${encodeURIComponent(value)}`);
  }
  return parts.length ? parts.join("; ") : undefined;
};

export function createMockCookies(
  initial: Record<string, CookieValue> = {}
): MockCookies {
  const store = new Map<string, string>();

  Object.entries(initial).forEach(([key, value]) => {
    if (typeof value === "string") {
      store.set(key, value);
    }
  });

  return {
    get(name) {
      const value = store.get(name);
      return value ? { name, value } : undefined;
    },
    getAll() {
      return Array.from(store.entries()).map(([name, value]) => ({
        name,
        value,
      }));
    },
    has(name) {
      return store.has(name);
    },
    set(name, value) {
      store.set(name, value);
    },
    delete(name) {
      store.delete(name);
    },
    clear() {
      store.clear();
    },
    toHeader() {
      return serializeCookieHeader(this.getAll());
    },
  };
}

let activeCookies = createMockCookies();

export function setActiveMockCookies(cookies: MockCookies) {
  activeCookies = cookies;
}

export function resetMockCookies(initial?: Record<string, CookieValue>) {
  activeCookies = createMockCookies(initial);
  return activeCookies;
}

vi.mock("next/headers", () => ({
  cookies: () => activeCookies,
}));

export function mockNextCookies(
  initial?: Record<string, CookieValue>
): MockCookies {
  const cookies = createMockCookies(initial);
  setActiveMockCookies(cookies);
  return cookies;
}
