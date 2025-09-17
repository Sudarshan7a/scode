import { NextResponse } from "next/server";

/**
 * TEMPORARY DEVELOPMENT ENDPOINT
 * Always returns a static token & user id from environment variables so the client can proceed
 * while the secure signing implementation is under construction.
 *
 * Required env vars:
 *   STREAM_VIDEO_DEFAULT_TOKEN - pre-generated (or dummy) Stream user token for development
 * Optional:
 *   STREAM_VIDEO_DEFAULT_USER_ID - associated user id (default: "dev-user")
 */
export async function GET() {
  const token = process.env.STREAM_VIDEO_DEFAULT_TOKEN;
  const userId = process.env.STREAM_VIDEO_DEFAULT_USER_ID || "dev-user";

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "STREAM_VIDEO_DEFAULT_TOKEN not set. Add it to .env.local for temporary video auth.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, token, userId });
}
