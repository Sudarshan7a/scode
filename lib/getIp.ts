import { NextRequest } from "next/server";

export function getIP(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown"
  );
}
