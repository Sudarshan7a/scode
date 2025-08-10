export function generateEmailTemplate(
  type: "verification" | "forgotPassword" | "welcome",
  data: string
): string {
  // 1. Define Content Based on Type
  let content = {
    title: "You're Almost In!",
    contextText:
      "Welcome to s-code! We're excited to see what you'll create. Just one final step to secure your account and unlock your new coding environment.",
    buttonText: "Confirm & Start Coding",
    middlePath: "verify-email",
    expiryText: "",
  };

  if (type === "verification") {
    content = {
      ...content,
      title: "Verify your email address",
      contextText:
        "Thanks for signing up for s-code. Please confirm this email address to activate your account.",
      buttonText: "Verify Email",
      middlePath: "verify-email",
      // Token TTL is 10 minutes (600s)
      expiryText: "This verification link expires in 10 minutes.",
    };
  } else if (type === "forgotPassword") {
    content = {
      ...content,
      title: "Reset Your Password",
      contextText:
        "We received a request to reset your password. Click the button below to continue.",
      buttonText: "Reset Password",
      middlePath: "reset-password",
      expiryText: "",
    };
  }

  const { title, contextText, buttonText, middlePath, expiryText } = content;
  const actionUrl = `${process.env.MY_DOMAIN}/${middlePath}/${data}`;

  // 2. Generate the HTML with the content
  // This template uses a table-based layout for maximum email client compatibility.
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .body {
        background-color: #121212 !important;
      }
      .container {
        background-color: #1e1e1e !important;
        box-shadow: 0 4px 8px rgba(255,255,255,0.1) !important;
      }
      .main-text, .greeting, .footer-text {
        color: #e0e0e0 !important;
      }
      h1 {
        color: #ffffff !important;
      }
      .link {
        color: #4dabf7 !important;
      }
      .button a {
        background-color: #007bff !important;
        color: #ffffff !important;
      }
      hr {
        border-top: 1px solid #333333 !important;
      }
    }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: Arial, sans-serif; text-align: center;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="color: #333333; font-family: Arial, sans-serif; margin-top: 0;">${title}</h1>
              <p class="main-text" style="color: #555555; font-size: 16px; line-height: 1.5;">${contextText}</p>
              ${
                expiryText
                  ? `<p style="color:#777; font-size: 13px; margin-top: 8px;">${expiryText}</p>`
                  : ""
              }
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px auto;" class="button">
                <tr>
                  <td align="center" style="border-radius: 5px; background-color: #007bff;">
                    <a href="${actionUrl}" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 15px 25px; border: 1px solid #007bff; display: inline-block; font-family: Arial, sans-serif;">${buttonText}</a>
                  </td>
                </tr>
              </table>
              
              <p class="footer-text" style="color: #555555; font-size: 14px;">If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all;">
                <a href="${actionUrl}" target="_blank" class="link" style="color: #007bff; text-decoration: underline;">${actionUrl}</a>
              </p>
              
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
              
              <p class="greeting" style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0;">Happy Coding,<br>– The s-code Team</p>
              
              <p class="footer-text" style="color: #888888; font-size: 12px; margin-top: 20px; line-height: 1.5;">
                If you did not request this, you can safely ignore this email.
                <br><br>
                &copy; ${new Date().getFullYear()} s-code. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        </td>
    </tr>
  </table>
</body>
</html>`;
}
