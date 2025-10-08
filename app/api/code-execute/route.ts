// app/api/code/execute/route.ts
import { NextRequest, NextResponse } from "next/server";

const EXECUTION_API_KEY = process.env.CODE_EXECUTION_API_KEY!;
const EXECUTION_API_URL = process.env.CODE_EXECUTION_API_URL!;
const EXECUTION_API_HOST = process.env.CODE_EXECUTION_API_HOST!;

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

  try {
    // 5. Call external execution API with YOUR secret key
    const response = await fetch(EXECUTION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": EXECUTION_API_KEY, // Secret stays server-side
        "x-rapidapi-host": EXECUTION_API_HOST,
      },
      body: JSON.stringify({
        language,
        stdin: "", // No stdin support yet
        files: [
          {
            name: "index.py",
            content: code,
          },
        ], // 5 second max
      }),
    });

    if (!response.ok) {
      throw new Error(`Execution API returned ${response.status}`);
    }
    const result = await response.json();
    console.log("[Code Execution] Result:", result);
    // 6. Sanitize response (remove sensitive data if needed)
    return NextResponse.json({
      ok: true,
      output: result.stdout || "",
      error: result.stderr || "",
      executionTime: result.time || 0,
    });
  } catch (error: any) {
    console.error("Code execution failed:", error);
    return NextResponse.json(
      { ok: false, message: "Execution failed. Please try again." },
      { status: 500 }
    );
  }
}
