import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { Resend } from "resend";
import { emailChangeLimiter } from "@/lib/rateLimiter";

export async function POST(request: NextRequest) {
  try {
    // Get userId from httpOnly cookie
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Rate limiting by userId
    const { success } = await emailChangeLimiter.limit(userId);

    if (!success) {
      console.warn(
        `[RateLimit] Email change blocked: user ${userId} (too many change requests)`
      );
      return NextResponse.json(
        {
          error:
            "Too many email change requests. Maximum 3 per hour. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { newEmail } = body;

    if (!newEmail) {
      return NextResponse.json(
        { error: "New email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { usersCollection } = await connectToMongo();

    // Check if new email already exists
    const existingUser = await usersCollection.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already in use" },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update user with pending email change
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          pendingEmail: {
            newEmail,
            verificationToken,
            tokenExpiry,
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send verification email to new email address
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email-change?token=${verificationToken}`;

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "verify@s-code.live",
        to: newEmail,
        subject: "Verify Your Email Change",
        html: generateEmailChangeTemplate(verificationUrl, newEmail),
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Roll back the pending email change
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $unset: { pendingEmail: "" } }
      );
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Verification link sent to your new email address. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error initiating email change:", error);
    return NextResponse.json(
      { error: "Failed to initiate email change" },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML template for email change verification
 */
function generateEmailChangeTemplate(
  verificationUrl: string,
  newEmail: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Email Change</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">S-Code</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Email Change</h2>
        
        <p>Hi there,</p>
        
        <p>You requested to change your email address to <strong>${newEmail}</strong>.</p>
        
        <p>To confirm this change, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 14px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;
                    font-weight: 600;">
            Verify Email Change
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This link will expire in 30 minutes for security reasons.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          If you didn't request this change, please ignore this email or contact support if you're concerned about your account security.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} S-Code. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
