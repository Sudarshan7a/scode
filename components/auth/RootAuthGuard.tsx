"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken, setAccessToken } from "@/lib/authTokenStore";

export function RootAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/how-it-works"];

  // Check for dynamic routes
  const isDynamicVerifyRoute = pathname.startsWith("/verify-email/");
  const isPublicRoute = publicRoutes.includes(pathname) || isDynamicVerifyRoute;

  useEffect(() => {
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
            // No valid refresh token, redirect to login
            router.push("/login");
            return;
          }

          const { accessToken } = await res.json();
          setAccessToken(accessToken);
        } catch {
          // Error getting access token, redirect to login
          router.push("/login");
          return;
        }
      }
    })();
  }, [pathname, router, isPublicRoute]);

  return <>{children}</>;
}
