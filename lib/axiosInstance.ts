"use client";
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/authTokenStore";

// Only send auth to these domains
const ALLOWED_DOMAINS = ["https://s-code.live", "http://localhost:3000"];

export const axiosInstance = axios.create({
  withCredentials: true, // Sends cookies like refresh token
});

function isAllowedDomain(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return ALLOWED_DOMAINS.includes(parsed.origin);
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
    try {
      // Request a fresh access token using the refresh cookie
      const res = await axios.post(
        "/api/auth/get-access-token",
        {},
        { withCredentials: true }
      );
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("axiosInstance: refresh response", {
          status: res.status,
          data: res.data,
        });
      }
      token = res.data?.accessToken;
      if (token) {
        setAccessToken(token);
      }
    } catch {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject("Redirected to login after failed refresh");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
