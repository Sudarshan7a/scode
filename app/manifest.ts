import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "S-Code – Real-time Collaborative Coding Platform",
    short_name: "S-Code",
    description:
      "Code together, think faster. The collaborative coding platform built for pair programming with real-time sync, voice chat, and AI assistance.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
