const PROD_BASE_URL = "https://s-code-live.vercel.app";

function normalizeOrigin(value?: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function stripApiPath(value?: string): string | null {
  if (!value) return null;
  return normalizeOrigin(value.replace(/\/api\/?$/, ""));
}

function normalizeWebSocketOrigin(value?: string): string | null {
  const origin = normalizeOrigin(value);
  if (!origin) return null;

  return origin.startsWith("http://")
    ? origin.replace(/^http:\/\//, "ws://")
    : origin.startsWith("https://")
      ? origin.replace(/^https:\/\//, "wss://")
      : origin;
}

export function getAppBaseUrl(): string {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ||
    stripApiPath(process.env.NEXT_PUBLIC_API_URL) ||
    normalizeOrigin(process.env.MY_DOMAIN) ||
    PROD_BASE_URL
  );
}

export function getAllowedAppOrigins(): string[] {
  const origins = [
    normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL),
    stripApiPath(process.env.NEXT_PUBLIC_API_URL),
    normalizeOrigin(process.env.MY_DOMAIN),
    PROD_BASE_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(origins));
}

export function getAllowedWebSocketOrigins(): string[] {
  const origins = [
    normalizeWebSocketOrigin(process.env.NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN),
    "ws://localhost:1234",
    "ws://127.0.0.1:1234",
  ].filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(origins));
}
