"use client";

import { clearAuthState } from "./authState";

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

  // Clear OAuth state
  clearAuthState();

  // Call logout API to clear server-side cookies
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const result = await res.json();

    // For OAuth users, also sign out from NextAuth
    if (result.isOAuthUser) {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
    }
  } catch {
    // Handle logout error silently - cookies might already be cleared
  }
}
