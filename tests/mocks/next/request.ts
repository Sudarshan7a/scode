import { NextRequest } from "next/server";
import { createMockCookies } from "./cookies";

export interface CreateNextRequestOptions {
  url?: string;
  baseUrl?: string;
  method?: string;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  cookies?: Record<string, string>;
}

const DEFAULT_BASE_URL = "https://localhost.test";

const toUrlString = (url: string, baseUrl: string) => {
  if (/^https?:/i.test(url)) return url;
  return new URL(url, baseUrl).toString();
};

const ensureBody = (value: unknown) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" || value instanceof ArrayBuffer) return value;
  if (value instanceof URLSearchParams) return value;
  return JSON.stringify(value);
};

export function createNextRequest(
  options: CreateNextRequestOptions = {}
): NextRequest {
  const {
    url = "/api/test",
    baseUrl = DEFAULT_BASE_URL,
    method = "GET",
    headers = {},
    query,
    body,
    cookies,
  } = options;

  const requestUrl = new URL(toUrlString(url, baseUrl));
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        requestUrl.searchParams.set(key, String(value));
      }
    });
  }

  const headersObj = new Headers(headers);

  if (cookies && Object.keys(cookies).length) {
    const cookieHeader = createMockCookies(cookies).toHeader();
    if (cookieHeader) headersObj.set("cookie", cookieHeader);
  }

  const bodyContent = ensureBody(body);
  if (bodyContent && !headersObj.has("content-type")) {
    headersObj.set("content-type", "application/json");
  }

  return new NextRequest(requestUrl, {
    method,
    headers: headersObj,
    body: bodyContent as BodyInit | null | undefined,
  });
}

export function createJsonRequest(
  url: string,
  data: unknown,
  init: Omit<CreateNextRequestOptions, "url" | "body" | "headers"> & {
    headers?: HeadersInit;
  } = {}
): NextRequest {
  const headers = new Headers(init.headers ?? {});
  headers.set("content-type", "application/json");
  return createNextRequest({
    url,
    ...init,
    headers,
    body: JSON.stringify(data),
  });
}
