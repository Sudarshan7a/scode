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

  console.log("Axios request:", {
    url: config.url,
    isAuthNeeded,
    origin: window.location.origin,
  });

  if (!isAuthNeeded) return config;

  let token = await getAccessToken();

  console.log("Current access token:", token ? "exists" : "missing");

  if (!token) {
    try {
      console.log("Requesting fresh access token...");
      // Request a fresh access token using the refresh cookie
      const res = await axios.post(
        "/api/auth/get-access-token",
        {},
        { withCredentials: true }
      );
      token = res.data?.accessToken;
      if (token) {
        setAccessToken(token);
        console.log("Fresh access token obtained");
      } else {
        console.log("No access token in response");
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject("Redirected to login after failed refresh");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header");
  } else {
    console.log("No token to add to Authorization header");
  }

  return config;
});
