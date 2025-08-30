"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmailStatusCard from "@/components/auth/EmailStatusCard";
import { CheckCircle2, XCircle } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";
function VerifyUser() {
  const params = useParams<{ token: string }>();

  const router = useRouter();
  const token = params.token;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fixed = window.location.pathname.replace(/^\/+/, "/");
      if (fixed !== window.location.pathname) {
        router.replace(fixed); // same-origin safe
        return;
      }
    }

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify?token=${token}`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(
            result.message || `HTTP error! status: ${res.status}`
          );
        }

        setStatus("success");
        setMessage(result.message || "Email verified successfully");

        // Redirect to login page after 2 seconds
        if (result.redirect) {
          setTimeout(() => {
            router.push(result.redirect);
          }, 2000);
        }
      } catch (error) {
        setStatus("error");
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("Verification failed. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [token, router]);
  const base = {
    subtle: status === "success" ? "Redirecting you shortly..." : undefined,
  };

  if (status === "loading")
    return (
      <EmailStatusCard
        title="Verifying your email"
        message="Hold on a moment while we confirm your verification link."
        variant="info"
        loading
        icon={
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        }
        {...base}
      />
    );
  if (status === "error")
    return (
      <EmailStatusCard
        title="Verification Failed"
        message={message || "The link is invalid or expired."}
        variant="error"
        icon={<XCircle className="text-destructive" />}
        actionHref="/check-email"
        actionLabel="Resend Link"
      />
    );
  return (
    <EmailStatusCard
      title="Email Verified"
      message={message || "Your email has been confirmed."}
      variant="success"
      icon={<CheckCircle2 className="text-green-500" />}
      actionHref="/dashboard"
      actionLabel="Go to Dashboard"
      {...base}
    />
  );
}

export default VerifyUser;
