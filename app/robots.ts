import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://s-code.live";

export default function robots(): MetadataRoute.Robots {
  // Shared list of private/auth routes that no bot should index
  const privateRoutes = [
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
  ];

  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/how-it-works",
    "/explore",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return {
    rules: [
      // Default: allow public pages, throttle unknown bots slightly
      {
        userAgent: "*",
        allow: publicRoutes,
        disallow: privateRoutes,
        crawlDelay: 1,
      },

      // --- Search engine bots: full speed, they drive visibility ---
      {
        userAgent: "Googlebot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "Bingbot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "Slurp", // Yahoo
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "DuckDuckBot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "Baiduspider",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "YandexBot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },

      // --- SEO & analytics bots: help owners improve visibility ---
      {
        userAgent: "SemrushBot",
        allow: publicRoutes,
        disallow: privateRoutes,
        crawlDelay: 2,
      },
      {
        userAgent: "AhrefsBot",
        allow: publicRoutes,
        disallow: privateRoutes,
        crawlDelay: 2,
      },

      // --- Social media bots: help with link previews & sharing ---
      {
        userAgent: "facebookexternalhit",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "Twitterbot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },
      {
        userAgent: "LinkedInBot",
        allow: publicRoutes,
        disallow: privateRoutes,
      },

      // --- AI training bots: blocked (scrape content, no visibility) ---
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

      // --- Harmful scrapers: blocked (no visibility benefit) ---
      {
        userAgent: "Bytespider",
        disallow: ["/"],
      },
      {
        userAgent: "PetalBot",
        disallow: ["/"],
      },
      {
        userAgent: "MJ12bot",
        disallow: ["/"],
      },
      {
        userAgent: "DotBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
