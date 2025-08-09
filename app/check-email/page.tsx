import EmailStatusCard from "@/components/auth/EmailStatusCard";
import { Mail } from "lucide-react";

export default function CheckEmail() {
  return (
    <EmailStatusCard
      title="Check your inbox"
      message="We sent you a verification link. Click it to activate your account and jump right in."
      variant="info"
      icon={<Mail className="text-[var(--color-mysecondary)]" />}
      subtle="Didn’t get it? Check spam or request a new link from the login page."
      actionHref="/login"
      actionLabel="Back to Login"
    />
  );
}
