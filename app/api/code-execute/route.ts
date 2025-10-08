// app/api/code/execute/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 3. Parse and validate request
  const body = await req.json();
  //TODO: add stdin in future updates
  const { code, language } = body;

  if (!code || !language) {
    return NextResponse.json(
      { ok: false, message: "Missing required fields: code, language" },
      { status: 400 }
    );
  }
  // Log execution details for debugging during initial development
  console.log("[Code Execution] Language:", language);
  console.log("[Code Execution] Code length:", code.length);
  console.log("[Code Execution] Code snippet:", code.substring(0, 100) + "...");
  // 4. Validate code length (prevent abuse)
  if (code.length > 50000) {
    return NextResponse.json(
      { ok: false, message: "Code too long (max 50KB)" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      ok: true,
      message: "Code execution request received",
      data: {
        language,
        codeLength: code.length,
      },
    },
    { status: 200 }
  );
}
