"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function VerifyUser() {
  const params = useParams<{ token: string }>();

  const router = useRouter();
  const token = params.token;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
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
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [token, router]);
  if (status === "loading") return <div>Verifying email...</div>;
  if (status === "error") return <div>Error: {message}</div>;
  return <div>Success: {message}</div>;
}

export default VerifyUser;
