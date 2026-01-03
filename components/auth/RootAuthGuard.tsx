"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken, setAccessToken } from "@/lib/authTokenStore";
import { useSession } from "next-auth/react";
import { setOAuthUser } from "@/lib/authState";

export function RootAuthGuard({ children }: { children: React.ReactNode }) {
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { data: session, status } = useSession();
  const isOAuthUser = !!session?.user; // If NextAuth session exists, user is OAuth
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") {
      setIsChecking(true);
      return;
    }

    // Set the global OAuth flag for axiosInstance to use
    setOAuthUser(isOAuthUser);

    if (isOAuthUser) {
      setIsSessionValid(true);
    }

    setIsChecking(false);
  }, [status, isOAuthUser]);

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/explore", // Allow guest access to explore rooms
    "/how-it-works",
    "/forgot-password",
    "/verify-email",
    "/verify-email-change", // Email change verification
    "/check-email",
    "/reset-password", // base (fallback) – actual page is /reset-password/[token]
    "/privacy-policy",
    "/terms-of-service",
    "/about",
    "/contact",
  ];

  // Dynamic route patterns
  const isDynamicVerifyRoute = pathname.startsWith("/verify-email/");
  const isDynamicResetRoute = pathname.startsWith("/reset-password/");
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    isDynamicVerifyRoute ||
    isDynamicResetRoute;

  useEffect(() => {
    // OAuth users don't need token refresh - they use session cookies
    if (isOAuthUser || isSessionValid || isChecking) {
      return;
    }

    (async () => {
      // Skip auth check for public routes
      if (isPublicRoute) {
        return;
      }

      // Check if we have an access token in memory
      if (!getAccessToken()) {
        // Try to get a new access token using refresh token
        try {
          const res = await fetch("/api/auth/get-access-token", {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) {
            router.push("/login");
            return;
          }

          const { accessToken } = await res.json();
          setAccessToken(accessToken);
        } catch {
          router.push("/login");
          return;
        }
      }
    })();
  }, [
    pathname,
    router,
    isPublicRoute,
    isSessionValid,
    isChecking,
    isOAuthUser,
  ]);

  if (isChecking) {
    return null;
  }

  if (isSessionValid) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
