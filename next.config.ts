import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd()),
      "@/components": path.resolve(process.cwd(), "components"),
      "@/constants": path.resolve(process.cwd(), "constants"),
      "@/types": path.resolve(process.cwd(), "types"),
      "@/lib": path.resolve(process.cwd(), "lib"),
      "@/hooks": path.resolve(process.cwd(), "hooks"),
      "@/app": path.resolve(process.cwd(), "app"),
    };
    return config;
  },
};

export default nextConfig;
