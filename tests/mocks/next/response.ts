import type { NextResponse } from "next/server";

export async function readJson<T = unknown>(res: NextResponse): Promise<T> {
  return (await res.json()) as T;
}

export function getHeader(res: NextResponse, name: string) {
  return res.headers.get(name) ?? undefined;
}

export function getSetCookieHeaders(res: NextResponse) {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return [] as string[];
  return setCookie.split(/,(?=[^;]+=[^;]+)/g).map((cookie) => cookie.trim());
}

export function status(res: NextResponse) {
  return res.status;
}
