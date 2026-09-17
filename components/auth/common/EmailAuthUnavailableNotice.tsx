"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { EMAIL_AUTH_UNAVAILABLE_MESSAGE } from "@/lib/auth/emailAuthAvailability";

export default function EmailAuthUnavailableNotice() {
  useEffect(() => {
    toast.error(EMAIL_AUTH_UNAVAILABLE_MESSAGE);
  }, []);

  return (
    <div
      role="alert"
      className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-left text-amber-950"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <p className="text-sm leading-relaxed">{EMAIL_AUTH_UNAVAILABLE_MESSAGE}</p>
    </div>
  );
}