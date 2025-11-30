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
let tokenRefreshPromise: Promise<string | null> | null = null;

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
// for Centralizing token refresh to prevent duplicates
async function refreshAccessToken(): Promise<string | null> {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }
  // if new request to get access token create a new promise for this refresh
  tokenRefreshPromise = (async () => {
    try {
      const res = await axios.post(
        "/api/auth/get-access-token",
        {},
        { withCredentials: true }
      );
      const token = res.data?.accessToken;
      if (token) {
        setAccessToken(token);
        return token;
      }
      return null;
    } catch (error) {
      void error;
      clearAccessToken();
    } finally {
      tokenRefreshPromise = null;
    }
  })();
  return tokenRefreshPromise;
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
      token = await refreshAccessToken();
      if (token) {
        onTokenRefreshed(token);
      }
    } catch (error) {
      void error;
      // Response interceptor will handle redirect on 401
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

// === RESPONSE INTERCEPTOR ===
// Handle 401 errors by refreshing the token and retrying the request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once and only for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
          // Add timeout to prevent hanging
          setTimeout(() => reject(error), 10000);
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        void refreshError;
        clearAccessToken();
        // Redirect to login for auth-required pages
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.match(
            /^\/(login|signup|explore|how-it-works|forgot-password|verify-email|check-email|reset-password)$/
          )
        ) {
          window.location.href = "/login";
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
