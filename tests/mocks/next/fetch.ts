import { vi } from "vitest";

const originalFetch = global.fetch;

export type FetchMock = ReturnType<typeof vi.fn> & {
  json?: (data: unknown, init?: ResponseInit) => void;
};

const createJsonResponse = (data: unknown, init: ResponseInit = {}) => {
  const headers = new Headers(init.headers || {});
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
};

export function installFetchMock() {
  const mock = vi.fn();
  (mock as FetchMock).json = (data: unknown, init?: ResponseInit) => {
    mock.mockResolvedValueOnce(createJsonResponse(data, init));
  };
  global.fetch = mock as unknown as typeof fetch;
  return mock as FetchMock;
}

export function queueFetchJson(data: unknown, init?: ResponseInit) {
  const fetchMock = global.fetch as unknown as FetchMock | undefined;
  if (!fetchMock || typeof fetchMock.mockResolvedValueOnce !== "function") {
    throw new Error("Fetch mock not installed. Call installFetchMock() first.");
  }
  fetchMock.json?.(data, init);
}

export function resetFetchMock() {
  global.fetch = originalFetch;
}
