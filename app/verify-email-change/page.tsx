"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailChangePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmailChange(token);
    } else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [searchParams]);

  const verifyEmailChange = async (token: string) => {
    try {
      const response = await axiosInstance.post(
        "/api/user/verify-email-change",
        {
          token,
        }
      );

      if (response.data.success) {
        setStatus("success");
        setMessage(response.data.message);
        setNewEmail(response.data.newEmail);

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMessage =
        error.response?.data?.error || "Failed to verify email change";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="w-16 h-16 text-mysecondary animate-spin mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                Verifying Email Change
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email change...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">
                Email Successfully Updated!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
              {newEmail && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Your new email: <strong>{newEmail}</strong>
                </p>
              )}
              <p className="text-sm text-gray-500">
                Redirecting to profile in 3 seconds...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Button
                onClick={() => router.push("/profile")}
                className="bg-mysecondary hover:bg-mysecondary-hover text-white"
              >
                Go to Profile
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
