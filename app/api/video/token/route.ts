import { NextRequest, NextResponse } from "next/server";

// Minimal token endpoint stub. Replace with real implementation that signs a Stream JWT for the current user.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json(
        { ok: false, message: "roomId is required" },
        { status: 400 }
      );
    }
    //send this token to the client

    // TODO: Implement real Stream token minting using your server secret and authenticated user id
    // For now, indicate to the client that it's not implemented.
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhiZDM4NTA0MjI3ZTEwMzYwNWQwODNiIiwiZXhwIjoxNzU4MDQ1MDIxfQ.g2jfN7aG1Ivv4BFCPtMy6bZrqc3Qeo6gVZSMuET0cmU";
    return NextResponse.json(
      {
        ok: true,
        message: "Stream token generated",
        token,
        userId: "68bd38504227e103605d083b",
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
