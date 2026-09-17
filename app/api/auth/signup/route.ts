import { NextResponse } from "next/server";
import { EMAIL_AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth/emailAuthAvailability";

export function POST() {
  return NextResponse.json(
    { ok: false, message: EMAIL_AUTH_UNAVAILABLE_MESSAGE },
    { status: 503 }
  );
}
