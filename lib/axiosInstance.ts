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

    console.log(`[DEBUG] Checking domain: ${url} -> origin: ${origin}`);

    // Allow s-code.live domain
    if (origin === "https://s-code.live") {
      console.log(`[DEBUG] Allowed: s-code.live domain`);
      return true;
    }

    // Allow any localhost port for development
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      console.log(`[DEBUG] Allowed: localhost domain`);
      return true;
    }

    console.log(`[DEBUG] Not allowed: ${origin}`);
    return false;
  } catch (error) {
    console.log(`[DEBUG] Error parsing URL: ${url}`, error);
    return false;
  }
}

// === REQUEST INTERCEPTOR ===
axiosInstance.interceptors.request.use(async (config) => {
  console.log(`[DEBUG] Axios request to: ${config.url}`);
  
  const isAuthNeeded = isAllowedDomain(config.url ?? "");
  console.log(`[DEBUG] Auth needed: ${isAuthNeeded}`);

  if (!isAuthNeeded) return config;

  let token = await getAccessToken();
  console.log(`[DEBUG] Current access token: ${token ? 'exists' : 'missing'}`);

  if (!token) {
    try {
      console.log(`[DEBUG] Requesting new access token...`);
      // Request a fresh access token using the refresh cookie
      const res = await axios.post(
        "/api/auth/get-access-token",
        {},
        { withCredentials: true }
      );
      token = res.data?.accessToken;
      console.log(`[DEBUG] New access token received: ${token ? 'exists' : 'missing'}`);
      if (token) {
        setAccessToken(token);
      }
    } catch (error) {
      console.error("[DEBUG] Failed to get access token:", error);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject("Redirected to login after failed refresh");
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[DEBUG] Added Authorization header`);
  } else {
    console.log(`[DEBUG] No token available, request will be unauthenticated`);
  }

  return config;
});
