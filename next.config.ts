import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,

  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    // Monaco Editor compatibility fixes
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      // Ensure workers can be loaded properly
      config.output.globalObject = "self";

      // Suppress Monaco Editor dynamic import warnings
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (warning: any) => {
          // Ignore all Monaco editor module resolution warnings
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes("monaco-editor") &&
            warning.message &&
            warning.message.includes("Can't resolve")
          );
        },
      ];
    }

    return config;
  },
};

export default nextConfig;
