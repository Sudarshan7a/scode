import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://s-code.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/how-it-works",
          "/explore",
          "/privacy-policy",
          "/terms-of-service",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/room/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-email-change",
          "/check-email",
          "/test-error-boundaries",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about",
          "/contact",
          "/how-it-works",
          "/explore",
          "/privacy-policy",
          "/terms-of-service",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/room/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-email-change",
          "/check-email",
          "/test-error-boundaries",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/about",
          "/contact",
          "/how-it-works",
          "/explore",
          "/privacy-policy",
          "/terms-of-service",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/room/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-email-change",
          "/check-email",
          "/test-error-boundaries",
        ],
        crawlDelay: 2,
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
