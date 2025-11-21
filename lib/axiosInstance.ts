"use client";
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/authTokenStore";

export const axiosInstance = axios.create({
  withCredentials: true, // Sends cookies like refresh token
});

// Track if we're currently refreshing the token to prevent multiple simultaneous requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function isAllowedDomain(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    const origin = parsed.origin;

    // Allow s-code.live domain
    if (origin === "https://s-code.live") {
      return true;
    }

    // Allow any localhost port for development
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// === REQUEST INTERCEPTOR ===
axiosInstance.interceptors.request.use(async (config) => {
  const isAuthNeeded = isAllowedDomain(config.url ?? "");

  if (!isAuthNeeded) return config;

  let token = await getAccessToken();

  if (!token) {
    // If already refreshing, wait for the token
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }

    isRefreshing = true;

    try {
      // Request a fresh access token using the refresh cookie
      const res = await axios.post(
        "/api/auth/get-access-token",
        {},
        { withCredentials: true }
      );
      token = res.data?.accessToken;
      if (token) {
        setAccessToken(token);
        onTokenRefreshed(token);
      }
    } catch (error) {
      void error;
      clearAccessToken();
      // Only redirect if we're not on a public page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.match(
          /^\/(login|signup|explore|how-it-works|forgot-password|verify-email|check-email|reset-password)$/
        )
      ) {
        window.location.href = "/login";
      }
      return Promise.reject("Token refresh failed");
    } finally {
      isRefreshing = false;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
