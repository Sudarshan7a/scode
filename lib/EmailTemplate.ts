export function generateEmailTemplate(type: string, data: string): string {
  let title = "You're Almost In!";
  let buttonText = "Confirm & Start Coding";
  let middlePath = "verify-email";
  let contextText =
    "Welcome to s-code! We're excited to see what you'll create. Just one final step to secure your account and unlock your new coding environment.";
  let expiryText = "";

  if (type === "verification") {
    title = "Verify your email address";
    buttonText = "Verify Email";
    middlePath = "verify-email";
    contextText =
      "Thanks for signing up for s-code. Please confirm this email address to activate your account.";
    // Token TTL is 10 minutes in verifyToken.ts (redis.set ex: 600)
    expiryText = "This verification link expires in 10 minutes.";
  } else if (type === "forgotPassword") {
    title = "Reset Your Password";
    buttonText = "Reset Password";
    middlePath = "reset-password";
    contextText =
      "We received a request to reset your password. Click the button below to continue.";
  }

  const actionUrl = `${process.env.MY_DOMAIN}/${middlePath}/${data}`;

  return `
<div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 8px; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

<h1 style="color: #333333; font-family: Arial, sans-serif;">${title}</h1>

<p style="color: #555555; font-size: 16px; line-height: 1.5;">${contextText}</p>
${
  expiryText
    ? `<p style="color:#777; font-size: 13px; margin-top: 8px;">${expiryText}</p>`
    : ""
}

<div style="margin: 30px 0;">
  <a href="${actionUrl}" aria-label="${buttonText}" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
    ${buttonText}
    </br>
    
<p style="color: #555555; font-size: 14px;">
  If you're having trouble clicking the button, copy and paste the URL below into your web browser:
</p>

<p style="word-break: break-all;">
  <a href="${actionUrl}" style="color: #007bff; text-decoration: none;">${actionUrl}</a>
  </p>

<hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">

<p style="color: #555555; font-size: 14px; line-height: 1.5;">
  Happy Coding,<br>
  – The s-code Team
</p>

<p style="color: #888888; font-size: 12px; margin-top: 20px; line-height: 1.5;">
  If you did not sign up for this account, you can safely ignore this email.
  <br><br>
  &copy; 2025 s-code. All rights reserved.
</p>
  </a>
</div>

</div>
</div>`;
}
