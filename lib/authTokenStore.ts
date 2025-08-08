"use client";

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

// Clear all authentication data (client-side)
export async function clearAuth() {
  // Clear in-memory access token
  clearAccessToken();

  // Call logout API to clear server-side cookies
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  } catch {
    // Handle logout error silently - cookies might already be cleared
  }
}
